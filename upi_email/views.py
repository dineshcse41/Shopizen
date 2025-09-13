from decimal import Decimal
from django.conf import settings
from rest_framework import status, permissions, generics, views
from rest_framework.response import Response
from django.db import transaction

from .models import Payment, Notification
from .serializers import (
    PaymentCreateSerializer, RazorpayVerifySerializer,
    PaymentSerializer, NotificationSerializer
)
from order.models import Order

import razorpay
import stripe
from .email import send_order_confirmation_email

stripe.api_key = settings.STRIPE_SECRET_KEY

def notify(user, message, ntype):           # Creates a notification entry every time a payment/order update happens.
    Notification.objects.create(user=user, message=message, type=ntype)     # Keeps the system event-driven → user gets updates without manually checking order status.

class PaymentCreateAPIView(views.APIView):
    """
    POST /api/payment/create
    Body: { "order_id": 123, "provider": "razorpay" | "stripe" | "cod" }
    """
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        ser = PaymentCreateSerializer(data=request.data, context={"request": request})
        ser.is_valid(raise_exception=True)
        order = ser.validated_data["order"]
        provider = ser.validated_data["provider"]
        amount = Decimal(ser.validated_data["amount"])
        currency = ser.validated_data.get("currency", "INR")

        if provider == "cod":
            # Create Payment row and mark order Pending (COD)
            payment = Payment.objects.create(
                user=request.user, order=order, provider="cod",
                amount=amount, currency=currency, status="cod_marked"
            )
            order.status = "Pending (COD)"
            order.save(update_fields=["status"])
            notify(request.user, f"COD selected for Order #{order.id}. Awaiting processing.", "Payment")
            return Response({
                "message": "COD selected. Order marked as Pending (COD).",
                "payment": PaymentSerializer(payment).data
            }, status=status.HTTP_201_CREATED)

        if provider == "razorpay":
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            amount_paise = int(Decimal(amount) * 100)
            rp_order = client.order.create({
                "amount": amount_paise,
                "currency": currency,
                "receipt": f"order_{order.id}",
                "payment_capture": 1,  # auto-capture
            })
            payment = Payment.objects.create(
                user=request.user, order=order, provider="razorpay",
                amount=amount, currency=currency, status="created",
                gateway_order_id=rp_order["id"], meta={"rp_order": rp_order}
            )
            notify(request.user, f"Razorpay order created for Order #{order.id}.", "Payment")
            return Response({
                "key": settings.RAZORPAY_KEY_ID,
                "order_id": rp_order["id"],
                "amount": amount_paise,
                "currency": currency,
                "payment_id": payment.id,
            }, status=status.HTTP_201_CREATED)

        if provider == "stripe":
            # Optional: create PaymentIntent
            intent = stripe.PaymentIntent.create(
                amount=int(Decimal(amount) * 100),
                currency=currency.lower(),
                metadata={"order_id": order.id, "user_id": request.user.id},
                automatic_payment_methods={"enabled": True},
            )
            payment = Payment.objects.create(
                user=request.user, order=order, provider="stripe",
                amount=amount, currency=currency, status="created",
                gateway_order_id=intent["id"], meta={"pi": intent}
            )
            notify(request.user, f"Stripe payment initiated for Order #{order.id}.", "Payment")
            return Response({
                "client_secret": intent["client_secret"],
                "payment_id": payment.id,
            }, status=status.HTTP_201_CREATED)

        return Response({"detail": "Unsupported provider."}, status=400)

# 2. PaymentCreateAPIView
# class PaymentCreateAPIView(views.APIView):


# Endpoint: POST /api/payment/create

# Input:

# { "order_id": 123, "provider": "razorpay" | "stripe" | "cod", "amount": 500.00 }


# Uses @transaction.atomic → ensures DB consistency (if anything fails, rollback happens).

# ✅ Flow inside post():

# Validate input with PaymentCreateSerializer.

# Get order, provider, amount.

# Branch logic by provider:

# COD (Cash on Delivery):

# Creates a Payment row with status="cod_marked".

# Updates Order.status = "Pending (COD)".

# Notifies user → "COD selected".

# Razorpay:

# Creates an Razorpay order using SDK.

# Saves gateway_order_id in Payment.

# Returns Razorpay keys to frontend → needed for checkout popup.

# Stripe:

# Creates a PaymentIntent in Stripe.

# Saves gateway_order_id (intent ID).

# Returns client_secret to frontend → needed for Stripe Elements/JS integration.

class RazorpayVerifyAPIView(views.APIView):
    """
    POST /api/payment/verify
    Body:
    {
      "order_id": 123,
      "razorpay_order_id": "...",
      "razorpay_payment_id": "...",
      "razorpay_signature": "..."
    }
    """
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        ser = RazorpayVerifySerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        try:
            order = Order.objects.get(id=data["order_id"], user=request.user)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=404)

        payment = Payment.objects.filter(
            order=order, user=request.user, provider="razorpay",
            gateway_order_id=data["razorpay_order_id"]
        ).order_by("-id").first()

        if not payment:
            return Response({"detail": "Payment record not found."}, status=404)

        # Verify signature
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        try:
            client.utility.verify_payment_signature({
                "razorpay_order_id": data["razorpay_order_id"],
                "razorpay_payment_id": data["razorpay_payment_id"],
                "razorpay_signature": data["razorpay_signature"],
            })
        except razorpay.errors.SignatureVerificationError:
            payment.status = "failed"
            payment.gateway_payment_id = data["razorpay_payment_id"]
            payment.gateway_signature = data["razorpay_signature"]
            payment.save(update_fields=["status", "gateway_payment_id", "gateway_signature"])
            order.status = "Failed"
            order.save(update_fields=["status"])
            notify(request.user, f"Payment failed for Order #{order.id}.", "Payment")
            return Response({"status": "failure", "reason": "Signature verification failed"}, status=400)

        # Signature OK — consider captured (we used payment_capture=1)
        payment.status = "captured"
        payment.gateway_payment_id = data["razorpay_payment_id"]
        payment.gateway_signature = data["razorpay_signature"]
        payment.save(update_fields=["status", "gateway_payment_id", "gateway_signature"])

        # Update order status + email + notification
        order.status = "Confirmed"
        order.save(update_fields=["status"])

        notify(request.user, f"Payment successful. Order #{order.id} confirmed.", "Payment")

        # Send confirmation email (best effort)
        try:
            if request.user.email:
                send_order_confirmation_email(request.user, order)
        except Exception:
            # Log in real projects
            pass

        return Response({"status": "success"} , status=200)

# 3. RazorpayVerifyAPIView
# class RazorpayVerifyAPIView(views.APIView):


# Endpoint: POST /api/payment/verify

# Input:

# {
#   "order_id": 123,
#   "razorpay_order_id": "...",
#   "razorpay_payment_id": "...",
#   "razorpay_signature": "..."
# }

# ✅ Flow inside post():

# Validate input with RazorpayVerifySerializer.

# Get the Order and related Payment record.

# Use Razorpay SDK to verify signature.

# If verification fails → mark Payment.status = failed & Order.status = Failed.

# If success:

# Mark Payment.status = captured.

# Update Order.status = Confirmed.

# Send notification + confirmation email.

# 👉 This ensures that payments cannot be faked — only Razorpay’s signed response confirms them.

class NotificationListAPIView(generics.ListAPIView):
    """
    GET /api/notifications/?status=unread|read (optional)
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = self.request.user.notifications.order_by("-created_at")
        status_param = self.request.query_params.get("status")
        if status_param in ("read", "unread"):
            qs = qs.filter(status=status_param)
        return qs


from rest_framework.decorators import action
class NotificationMarkReadAPIView(views.APIView):
    """
    PATCH /api/notifications/<id>/read
    """
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            notif = request.user.notifications.get(id=pk)
        except Notification.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)
        notif.status = "read"
        notif.save(update_fields=["status"])
        return Response({"detail": "Marked read."})

# 4. NotificationListAPIView
# class NotificationListAPIView(generics.ListAPIView):


# Endpoint: GET /api/notifications/?status=read|unread

# Fetches user-specific notifications.

# Supports filtering by status → so frontend can show unread counts.

# 🔹 5. NotificationMarkReadAPIView
# class NotificationMarkReadAPIView(views.APIView):


# Endpoint: PATCH /api/notifications/<id>/read

# Marks a specific notification as read.

# Helps build a "mark as read" button in frontend.

# 🔹 💡 Key Points in Your Design

# Supports Multiple Providers (cod, razorpay, stripe) → extensible for future.

# Transaction safety → @transaction.atomic ensures no half-finished records.

# Event-driven notifications → user always knows what’s happening.

# Email integration → ensures real-world usability.

# Signature verification → prevents fraud.

# Separation of Concerns → creation & verification handled in different endpoints.
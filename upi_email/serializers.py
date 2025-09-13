from rest_framework import serializers
from .models import Payment, Notification
from order.models import Order

class PaymentCreateSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    provider = serializers.ChoiceField(choices=["razorpay", "stripe", "cod"])

    # Optionally allow overriding amount/currency
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    currency = serializers.CharField(required=False, default="INR")
    
# Used by PaymentCreateAPIView when a user wants to start a payment.

# Accepts order_id and chosen provider (razorpay | stripe | cod).

# Optionally allows overriding amount and currency.

    def validate(self, attrs):
        user = self.context["request"].user
        try:
            order = Order.objects.get(id=attrs["order_id"], user=user)
        except Order.DoesNotExist:
            raise serializers.ValidationError("Order not found for this user.")
        attrs["order"] = order
        if "amount" not in attrs:
            attrs["amount"] = order.total_price
        return attrs

# Ensures the order belongs to the current user (prevents fraud).

# Attaches the Order object into validated data (so views don’t need to refetch).

# Defaults amount to order.total_price if not explicitly passed.

class RazorpayVerifySerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    razorpay_order_id = serializers.CharField()
    razorpay_payment_id = serializers.CharField()
    razorpay_signature = serializers.CharField()
    
# Used by RazorpayVerifyAPIView to validate payment verification requests.

# Ensures all required fields are present in request body before signature verification happens.

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"
        
# Serializes the full Payment model (all fields).

# Used in responses like when COD payment is created or Razorpay order is generated.

# Good for admin/debugging APIs, but for production you might want a "safe" version (to avoid leaking sensitive fields like gateway_signature).

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "message", "type", "status", "created_at"]

# Serializes the Notification model for API responses.

# Minimal fields: just the message, type (e.g., Payment, Order, System),
# status (read/unread), and timestamp.

# Used by:

# NotificationListAPIView (to list all notifications).

# NotificationMarkReadAPIView (to confirm updates).
# --------------------------------------------------
# 🔹 How they all work together (Flow)

# Frontend → POST /api/payment/create

# Sends { "order_id": 123, "provider": "razorpay" }

# PaymentCreateSerializer validates:

# Checks if the order belongs to the user.

# Injects the Order object into validated data.

# View creates a Payment record and returns gateway details.

# Frontend completes payment (via Razorpay/Stripe widget)

# Frontend → POST /api/payment/verify

# Sends Razorpay fields (razorpay_order_id, etc.)

# RazorpayVerifySerializer validates structure.

# View uses Razorpay SDK to verify signature and updates order/payment status.

# Notifications

# Any important step (COD chosen, Razorpay order created, Payment confirmed/failed) triggers notify() → creates a Notification.

# NotificationSerializer is used to send them back to frontend.

# ✅ In short:

# PaymentCreateSerializer = ensure order + provider is valid before starting payment.

# RazorpayVerifySerializer = ensure all Razorpay verification fields are present.

# PaymentSerializer = expose payment details to frontend/backend.

# NotificationSerializer = expose user notifications.
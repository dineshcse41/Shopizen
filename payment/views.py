from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

from payment.utils import razorpay_client
from user_shopizen.models import Order


class CreatePayment(APIView):
    def post(self, request):
        try:
            order_id = request.data.get("order_id")
            order = Order.objects.get(id=order_id)

            razorpay_order = razorpay_client.order.create({
                "amount": int(order.total_price * 100),   # in paise
                "currency": "INR",
                "payment_capture": 1
            })

            # Save Payment ID in your database
            order.razorpay_order_id = razorpay_order["id"]
            order.save()

            return Response({
                "orderId": razorpay_order["id"],
                "amount": razorpay_order["amount"],
                "currency": razorpay_order["currency"],
                "key": settings.RAZORPAY_KEY_ID
            })

        except Exception as e:
            return Response({"error": str(e)}, status=400)


import hmac
import hashlib

class VerifyPayment(APIView):
    def post(self, request):
        data = request.data

        order_id = data.get("razorpay_order_id")
        payment_id = data.get("razorpay_payment_id")
        signature = data.get("razorpay_signature")

        body = order_id + "|" + payment_id
        secret = settings.RAZORPAY_KEY_SECRET

        generated_signature = hmac.new(
            key=bytes(secret, 'utf-8'),
            msg=bytes(body, 'utf-8'),
            digestmod=hashlib.sha256
        ).hexdigest()

        if generated_signature == signature:
            # SUCCESS PAYMENT
            order = Order.objects.get(razorpay_order_id=order_id)
            order.status = "Confirmed"
            order.save()

            return Response({"message": "Payment Verified", "status": "success"})

        else:
            return Response({"message": "Payment Failed", "status": "failed"}, status=400)


class CreateCOD(APIView):
    def post(self, request):
        order_id = request.data.get("order_id")
        order = Order.objects.get(id=order_id)

        order.payment_method = "COD"
        order.status = "Pending (COD)"
        order.save()

        return Response({"message": "COD order placed"})

from django.db import models
from django.conf import settings
from order.models import Order

# If you already have Order, import it. Otherwise, sketch here:
# from order.models import Order

class Payment(models.Model):
    PROVIDER_CHOICES = [
        ("razorpay", "Razorpay"),
        ("stripe", "Stripe"),
        ("cod", "Cash on Delivery"),
    ]
    STATUS_CHOICES = [
        ("created", "Created"),
        ("authorized", "Authorized"),
        ("captured", "Captured"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
        ("cod_pending", "COD Pending"),
        ("cod_marked", "COD Marked"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="payments")
    order = models.ForeignKey("order.Order", on_delete=models.CASCADE, related_name="payments")
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default="INR")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="created")

    gateway_order_id = models.CharField(max_length=100, blank=True, null=True)     # Razorpay order_id / Stripe pi id
    gateway_payment_id = models.CharField(max_length=100, blank=True, null=True)   # Razorpay payment_id / Stripe charge id
    gateway_signature = models.CharField(max_length=200, blank=True, null=True)

    meta = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.provider}:{self.id} - {self.status}"


class Notification(models.Model):
    TYPE_CHOICES = [
        ("Order", "Order"),
        ("Payment", "Payment"),
        ("Offer", "Offer"),
    ]
    STATUS_CHOICES = [
        ("read", "read"),
        ("unread", "unread"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="unread")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.type}] {self.message[:40]}"

class UpiPayment(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="upi_payment")
    transaction_id = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)

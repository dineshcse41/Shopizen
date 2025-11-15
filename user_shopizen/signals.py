# user_shopizen/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order, Refund, Notification

@receiver(post_save, sender=Order)
def order_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.user,
            message=f"Your order #{instance.id} has been placed successfully!",
            type="Order"
        )
    elif instance.status == "Delivered":
        Notification.objects.create(
            user=instance.user,
            message=f"Your order #{instance.id} has been delivered.",
            type="Order"
        )
    elif instance.status == "Cancelled":
        Notification.objects.create(
            user=instance.user,
            message=f"Your order #{instance.id} was cancelled.",
            type="Order"
        )

@receiver(post_save, sender=Refund)
def refund_notification(sender, instance, created, **kwargs):
    if instance.status == "Approved":
        Notification.objects.create(
            user=instance.user,
            message=f"Your refund request for Order #{instance.order.id} has been approved.",
            type="Refund"
        )
    elif instance.status == "Rejected":
        Notification.objects.create(
            user=instance.user,
            message=f"Your refund request for Order #{instance.order.id} has been rejected.",
            type="Refund"
        )

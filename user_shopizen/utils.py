from django.core.mail import send_mail
from django.conf import settings
from .models import Notification

def send_order_confirmation_email(user, order):
    subject = f"Order #{order.id} Confirmation"
    message = f"Hello {user.username},\n\nYour order #{order.id} has been placed successfully.\nTotal Amount: ₹{order.total_price}\n\nThank you for shopping!"
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])

    # Save Notification
    Notification.objects.create(
        user=user,
        message=f"Your order #{order.id} was placed successfully.",
        type="Order"
    )


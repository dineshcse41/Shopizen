from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

def send_order_confirmation_email(user, order):
    subject = f"Order #{order.id} Confirmed"
    from_email = settings.DEFAULT_FROM_EMAIL
    to = [user.email]
# subject → personalized email subject with the order number.

# from_email → taken from settings.DEFAULT_FROM_EMAIL (must be configured in settings.py).

# to → recipient list (the user’s email address).

    context = {"user": user, "order": order}
    text_body = render_to_string("emails/order_confirmation.txt", context)
    html_body = render_to_string("emails/order_confirmation.html", context)

# context → variables passed into the email templates (user, order).

# render_to_string → loads and renders Django templates:

# emails/order_confirmation.txt → plain text version (for email clients that don’t support HTML).

# emails/order_confirmation.html → HTML version (formatted email).
# 👉 This ensures compatibility across all email clients.

    msg = EmailMultiAlternatives(subject, text_body, from_email, to)
    msg.attach_alternative(html_body, "text/html")
    msg.send()

# EmailMultiAlternatives → lets you send both text and HTML in the same email.

# attach_alternative() → attaches the HTML version as an alternative.

# msg.send() → sends the email using Django’s email backend.
# -------------------------------------------

# How it fits into your system

# User places an order → payment is confirmed (via Razorpay/Stripe or COD).

# In your RazorpayVerifyAPIView or COD flow:

# send_order_confirmation_email(request.user, order)


# User receives an email:

# Subject: Order #101 Confirmed

# Text body: Plain text fallback

# HTML body: A nicely formatted email with order details

# 🔹 What you need in place

# Django email settings (settings.py)

# EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
# EMAIL_HOST = "smtp.gmail.com"
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = "your_email@gmail.com"
# EMAIL_HOST_PASSWORD = "your_app_password"  # Use App Password, not normal password
# DEFAULT_FROM_EMAIL = "Shop <your_email@gmail.com>"


# Templates

# templates/emails/order_confirmation.txt (plain text)

# templates/emails/order_confirmation.html (HTML version)
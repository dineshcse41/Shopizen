from django.urls import path
from .views import (
    PaymentCreateAPIView, RazorpayVerifyAPIView,
    NotificationListAPIView, NotificationMarkReadAPIView
)

urlpatterns = [
    path("payment/create", PaymentCreateAPIView.as_view(), name="payment-create"),
    path("payment/verify", RazorpayVerifyAPIView.as_view(), name="payment-verify"),
    path("notifications/", NotificationListAPIView.as_view(), name="notifications-list"),
    path("notifications/<int:pk>/read", NotificationMarkReadAPIView.as_view(), name="notifications-read"),
]

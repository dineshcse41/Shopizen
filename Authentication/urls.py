from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    # Custom Auth APIs
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    # admin
    path('register/', AdminRegisterView.as_view()),
    path('login/', AdminLoginView.as_view()),
    path("admin/reset-password/", AdminResetPasswordView.as_view()),
    # Reset
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    # mobile login OTP
    path('send-otp/', SendMobileOTPView.as_view(), name="send_otp"),
    path('verify-otp/', VerifyMobileOTPView.as_view(), name="verify_otp"),
    
]
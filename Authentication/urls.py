from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    # Custom Auth APIs
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    # admin
    path('register/', AdminRegisterAPIView.as_view()),
    path("login/", AdminLoginAPIView.as_view(), name="admin-login"),
    # path("admin/reset-password/", AdminResetPasswordView.as_view()),
    # Reset
    path('resetpassword/', ResetPasswordRequestView.as_view(), name='reset-password'),
    path('reset-password-confirm/', SetNewPasswordView.as_view(), name='reset-password-confirm'),
    # mobile login OTP
    path('sendotp/', SendOTPView.as_view(), name="send_otp"),
    path('verifyotp/', VerifyOTPView.as_view(), name="verify_otp"),
    
]
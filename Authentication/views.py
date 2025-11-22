from django.contrib.auth import authenticate, get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import MobileOTP
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    ResetPasswordSerializer
)

import random

User = get_user_model()


# ---------------- REGISTER ----------------
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "phone_number": user.phone_number,
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------- LOGIN ----------------
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

        # Create JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
            },
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_200_OK)


# ---------------- SEND OTP ----------------
class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        phone_number = request.data.get("phone_number")

        if not phone_number:
            return Response({"error": "Phone number is required"}, status=400)

        phone_number_digits = phone_number[-10:]

        try:
            user = User.objects.get(phone_number=phone_number_digits)
        except User.DoesNotExist:
            return Response({"error": "Mobile number not registered!"}, status=404)

        otp = str(random.randint(100000, 999999))
        MobileOTP.objects.create(phone_number=user.phone_number, otp=otp)

        print(f"OTP for {user.phone_number}: {otp}")

        return Response({"message": "OTP sent successfully"})


# ---------------- VERIFY OTP ----------------
class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        phone_number = request.data.get("phone_number")
        otp = request.data.get("otp")

        if not phone_number or not otp:
            return Response({"error": "Phone number and OTP required"}, status=400)

        phone_number_digits = phone_number[-10:]

        try:
            user = User.objects.get(phone_number=phone_number_digits)
        except User.DoesNotExist:
            return Response({"error": "Mobile number not registered!"}, status=404)

        try:
            mobile_otp = MobileOTP.objects.filter(
                phone_number=user.phone_number
            ).latest("created_at")
        except MobileOTP.DoesNotExist:
            return Response({"error": "OTP not found. Request a new one"}, status=404)

        if mobile_otp.otp != otp:
            return Response({"error": "Invalid OTP"}, status=400)

        return Response({
            "message": "OTP verified",
            "user": {
                "id": user.id,
                "email": user.email,
                "phone": user.phone_number,
            }
        })


# ---------------- RESET PASSWORD ----------------
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        try:
            user = User.objects.get(email=email)
            user.set_password(password)
            user.save()

            return Response(
                {"message": "Password reset successfully!"},
                status=200
            )
        except User.DoesNotExist:
            return Response(
                {"email": ["User not found."]},
                status=400
            )


# ---------------- CHECK EMAIL EXISTS ----------------
class CheckEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"email": ["Email is required"]}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({"valid": True}, status=200)

        return Response({"email": ["Email not registered"]}, status=404)


# class SetNewPasswordView(APIView):
#     def post(self, request):
#         serializer = SetNewPasswordSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response({'message': 'Password has been reset successfully'}, status=status.HTTP_200_OK)

#--------------------------------------------------------------------------Admin----------------------------------------------------------------

from rest_framework import generics, status
from rest_framework.response import Response
from .models import UserProfile, AdminUser  # <- same here
from .serializers import AdminRegisterSerializer

class AdminRegisterAPIView(generics.CreateAPIView):
    queryset = AdminUser.objects.all()
    serializer_class = AdminRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # This will call AdminUserManager.create_user()
        admin_user = serializer.save()

        return Response(
            {
                "message": "Admin registered successfully!",
                "admin_id": admin_user.id
            },
            status=status.HTTP_201_CREATED
        )


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import AdminUser


class AdminLoginAPIView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email & password required"}, status=400)

        try:
            user = AdminUser.objects.get(email=email)
        except AdminUser.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=401)

        if not user.check_password(password):
            return Response({"error": "Invalid credentials"}, status=401)

        if not user.is_active:
            return Response({"error": "Account disabled"}, status=403)

        refresh = RefreshToken.for_user(user)

        return Response({
        'user': {
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_admin': True,
    },
    'access': str(refresh.access_token),
    'refresh': str(refresh)
})


# Authentication/views.py
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import AdminResetPasswordSerializer

class AdminResetPasswordView(APIView):
    def post(self, request):
        serializer = AdminResetPasswordSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Password reset successful"},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

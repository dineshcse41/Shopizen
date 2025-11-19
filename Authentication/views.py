from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserProfile, MobileOTP
from .serializers import (
    LoginSerializer, MobileSendOTPSerializer, MobileVerifyOTPSerializer,
    AdminRegisterSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer,RegisterSerializer
)

import random

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        serializer.save()
        return Response({"message": "User registered successfully"}, status=201)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Accept either "username" or "identifier" from frontend
        identifier = request.data.get("username") or request.data.get("identifier")
        password = request.data.get("password")

        if not identifier or not password:
            return Response({"error": "Username/email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Try authenticate assuming identifier is username
        user = authenticate(username=identifier, password=password)

        # If not found, try identifier as email
        if user is None:
            try:
                user_obj = User.objects.get(email=identifier)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None

        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # create tokens
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        # Safely get profile fields — avoid server 500 if profile missing
        profile_data = {"full_name": None, "phone_number": None}
        try:
            profile = getattr(user, "userprofile", None)
            if profile:
                profile_data["full_name"] = getattr(profile, "full_name", None)
                profile_data["phone_number"] = getattr(profile, "phone_number", None)
        except Exception:
            # don't crash on weird profile implementations
            pass

        return Response({
            "refresh": str(refresh),
            "access": access,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": profile_data["full_name"],
                "phone_number": profile_data["phone_number"]
            }
        }, status=status.HTTP_200_OK)


class SendMobileOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = MobileSendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data['phone_number']
        otp = str(random.randint(100000, 999999))

        MobileOTP.objects.create(phone_number=phone, otp=otp)

        print("OTP SENT:", otp)  # replace with SMS API

        return Response({"message": "OTP sent successfully"}, status=200)


class VerifyMobileOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = MobileVerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data['phone_number']
        otp = serializer.validated_data['otp']

        try:
            otp_obj = MobileOTP.objects.filter(phone_number=phone).latest("created_at")
        except MobileOTP.DoesNotExist:
            return Response({"error": "Invalid phone number"}, status=400)

        if otp_obj.otp != otp:
            return Response({"error": "Incorrect OTP"}, status=400)

        try:
            user = UserProfile.objects.get(phone_number=phone).user
        except UserProfile.DoesNotExist:
            return Response({"error": "User does not exist. Register first."}, status=404)

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "phone": phone
            }
        }, status=200)


class AdminRegisterView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = AdminRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Admin registered successfully"}, status=201)
        return Response(serializer.errors, status=400)


class AdminLoginView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid email or password"}, status=401)

        user = authenticate(username=user.username, password=password)

        if not user:
            return Response({"error": "Invalid email or password"}, status=401)

        if not user.is_staff:
            return Response({"error": "Access denied. Not an admin."}, status=403)

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Admin login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=200)

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']

        if not User.objects.filter(email=email).exists():
            return Response({'error': 'Email not found'}, status=404)

        return Response({'message': 'Password reset link sent'}, status=200)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        new_password = serializer.validated_data['new_password']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Invalid email'}, status=404)

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password reset successfully'}, status=200)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from django.contrib.auth.models import User
from .models import AdminProfile
from .serializers import AdminResetPasswordSerializer


class AdminResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        security_code = serializer.validated_data["security_code"]
        new_password = serializer.validated_data["new_password"]

        # 1. Find the admin by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Admin not found"}, status=404)

        # 2. Check if user is admin
        if not user.is_staff:
            return Response({"error": "Not an admin account"}, status=400)

        # 3. Get AdminProfile
        try:
            admin_profile = AdminProfile.objects.get(user=user)
        except AdminProfile.DoesNotExist:
            return Response({"error": "Admin profile missing"}, status=404)

        # 4. Compare security code
        if admin_profile.security_code != security_code:
            return Response({"error": "Invalid security code"}, status=400)

        # 5. Set the new password
        user.set_password(new_password)
        user.save()

        return Response({"message": "Password reset successfully"}, status=200)

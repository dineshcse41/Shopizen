from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import MobileOTP, get_user_model

from .models import UserProfile, MobileOTP
from .serializers import (
    LoginSerializer, MobileSendOTPSerializer, MobileVerifyOTPSerializer,
    AdminRegisterSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer,RegisterSerializer
)
User = get_user_model()
import random

class RegisterView(APIView):

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

class LoginView(APIView):
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


# ----------------- SEND OTP -----------------
# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import MobileOTP, User
import random

class SendOTPView(APIView):
    def post(self, request):
        phone_number = request.data.get("phone_number")  # frontend may send +91XXXX

        if not phone_number:
            return Response({"error": "Phone number is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Only consider last 10 digits
        phone_number_digits = phone_number[-10:]

        try:
            user = User.objects.get(phone_number=phone_number_digits)
        except User.DoesNotExist:
            return Response({"error": "Mobile number not registered!"}, status=404)

        otp = str(random.randint(100000, 999999))
        MobileOTP.objects.create(phone_number=user.phone_number, otp=otp)

        # send OTP via SMS here if needed
        print(f"OTP for {user.phone_number} is {otp}")

        return Response({"message": "OTP sent successfully"})

# ----------------- VERIFY OTP -----------------
class VerifyOTPView(APIView):
    def post(self, request):
        phone_number = request.data.get("phone_number")
        otp = request.data.get("otp")

        if not phone_number or not otp:
            return Response({"error": "Phone number and OTP are required"}, status=400)

        phone_number_digits = phone_number[-10:]

        try:
            user = User.objects.get(phone_number=phone_number_digits)
        except User.DoesNotExist:
            return Response({"error": "Mobile number not registered!"}, status=404)

        try:
            mobile_otp = MobileOTP.objects.filter(phone_number=user.phone_number).latest("created_at")
        except MobileOTP.DoesNotExist:
            return Response({"error": "OTP not found, request a new one"}, status=404)

        if mobile_otp.otp != otp:
            return Response({"error": "Invalid OTP"}, status=400)

        # OTP verified successfully
        return Response({
            "message": "OTP verified",
            "user": {
                "id": user.id,
                "email": user.email,
                "phone": user.phone_number,
            }
        })

# user reset password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from .serializers import ResetPasswordRequestSerializer, SetNewPasswordSerializer

class ResetPasswordRequestView(APIView):
    def post(self, request):
        serializer = ResetPasswordRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link = f"http://localhost:5173/reset-password-confirm/{uid}/{token}/"  # React front-end link
        
        # Send email
        send_mail(
            'Reset your password',
            f'Click the link to reset your password: {reset_link}',
            'from@example.com',
            [user.email],
            fail_silently=False,
        )
        
        return Response({'message': 'Password reset link sent to your email'}, status=status.HTTP_200_OK)


class SetNewPasswordView(APIView):
    def post(self, request):
        serializer = SetNewPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'Password has been reset successfully'}, status=status.HTTP_200_OK)

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



# class PasswordResetRequestView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = PasswordResetRequestSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         email = serializer.validated_data['email']

#         if not User.objects.filter(email=email).exists():
#             return Response({'error': 'Email not found'}, status=404)

#         return Response({'message': 'Password reset link sent'}, status=200)


# class PasswordResetConfirmView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = PasswordResetConfirmSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         email = serializer.validated_data['email']
#         new_password = serializer.validated_data['new_password']

#         try:
#             user = User.objects.get(email=email)
#         except User.DoesNotExist:
#             return Response({'error': 'Invalid email'}, status=404)

#         user.set_password(new_password)
#         user.save()

#         return Response({'message': 'Password reset successfully'}, status=200)


# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import AllowAny
# from rest_framework import status

# from .models import AdminProfile
# from .serializers import AdminResetPasswordSerializer


# class AdminResetPasswordView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = AdminResetPasswordSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         email = serializer.validated_data["email"]
#         security_code = serializer.validated_data["security_code"]
#         new_password = serializer.validated_data["new_password"]

#         # 1. Find the admin by email
#         try:
#             user = User.objects.get(email=email)
#         except User.DoesNotExist:
#             return Response({"error": "Admin not found"}, status=404)

#         # 2. Check if user is admin
#         if not user.is_staff:
#             return Response({"error": "Not an admin account"}, status=400)

#         # 3. Get AdminProfile
#         try:
#             admin_profile = AdminProfile.objects.get(user=user)
#         except AdminProfile.DoesNotExist:
#             return Response({"error": "Admin profile missing"}, status=404)

#         # 4. Compare security code
#         if admin_profile.security_code != security_code:
#             return Response({"error": "Invalid security code"}, status=400)

#         # 5. Set the new password
#         user.set_password(new_password)
#         user.save()

#         return Response({"message": "Password reset successfully"}, status=200)

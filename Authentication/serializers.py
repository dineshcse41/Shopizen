from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile
User = get_user_model()


# -------------------- User Profile --------------------
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['full_name', 'phone_number']


# -------------------- User Register --------------------
class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone_number', 'password', 'confirm_password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')

        user = User.objects.create_user(password=password, **validated_data)
        return user


# -------------------- Login --------------------
# authentication/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(email=email, password=password)
            if not user:
                raise serializers.ValidationError("Invalid email or password")
        else:
            raise serializers.ValidationError("Email and password are required")

        data['user'] = user
        return data
# user reset password
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class ResetPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist.")
        return value

from rest_framework import serializers
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode

User = get_user_model()

class SetNewPasswordSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        try:
            uid = urlsafe_base64_decode(attrs['uidb64']).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError('Invalid link')

        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError('Invalid or expired token')

        attrs['user'] = user
        return attrs

    def save(self):
        password = self.validated_data['password']
        user = self.validated_data['user']
        user.set_password(password)
        user.save()
        return user


# -------------------- Mobile OTP --------------------
# authentication/serializers.py
from rest_framework import serializers

class MobileSendOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)

class MobileVerifyOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    otp = serializers.CharField(max_length=6)


# -------------------- Admin Register --------------------
from rest_framework import serializers
from .models import UserProfile, AdminUser  # <- change AdminProfile to AdminUser


from rest_framework import serializers
from .models import AdminUser

class AdminRegisterSerializer(serializers.ModelSerializer):
    # Accept camelCase fields from frontend
    employeeId = serializers.CharField(write_only=True)
    securityCode = serializers.CharField(write_only=True)
    confirmPassword = serializers.CharField(write_only=True)

    class Meta:
        model = AdminUser
        fields = [
            "first_name", "last_name", "email",
            "password", "confirmPassword",
            "designation", "department",
            "employeeId", "securityCode"
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate(self, data):
        if data["password"] != data["confirmPassword"]:
            raise serializers.ValidationError({"confirmPassword": "Passwords do not match"})
        return data

    def create(self, validated_data):
        validated_data["employeeId"] = validated_data.pop("employeeId")
        validated_data["securityCode"] = validated_data.pop("securityCode")
        validated_data.pop("confirmPassword")

        user = AdminUser.objects.create_user(
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            password=validated_data["password"],
            designation=validated_data["designation"],
            department=validated_data["department"],
            employeeId=validated_data["employeeId"],
            securityCode=validated_data["securityCode"],
        )
        return user



from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from .models import AdminUser

class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if not AdminUser.objects.filter(email=email).exists():
            raise AuthenticationFailed("Admin email not found.")

        user = authenticate(email=email, password=password)

        if not user:
            raise AuthenticationFailed("Invalid credentials.")

        if not user.is_active:
            raise AuthenticationFailed("Account is disabled.")

        data["user"] = user
        return data


# -------------------- Password Reset --------------------
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(max_length=128)
    confirm_password = serializers.CharField(max_length=128)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data


# -------------------- Admin Password Reset --------------------
class AdminResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    security_code = serializers.CharField()
    new_password = serializers.CharField(min_length=6)

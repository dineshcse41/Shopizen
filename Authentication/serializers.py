# user
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['full_name', 'phone_number']

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile
class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    phone_number = serializers.CharField(max_length=20)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"error": "Passwords do not match"})

        # check email, not username
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"error": "Email already registered"})
        
        return data

    def create(self, validated_data):
        full_name = validated_data['full_name']
        phone_number = validated_data['phone_number']
        email = validated_data['email']
        password = validated_data['password']

        # Generate username automatically (user1, user2, etc.)
        last_user = User.objects.order_by('-id').first()
        new_username = f"user{(last_user.id + 1) if last_user else 1}"

        # Create user with generated username
        user = User.objects.create_user(
            username=new_username,    
            email=email,
            password=password
        )

        UserProfile.objects.create(
            user=user,
            full_name=full_name,
            phone_number=phone_number
        )

        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

# login mobile verification OTP
from rest_framework import serializers

class MobileSendOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)

class MobileVerifyOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    otp = serializers.CharField(max_length=6)


# admin
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import AdminProfile

class AdminRegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    designation = serializers.CharField(max_length=150)
    department = serializers.CharField(max_length=150)
    employee_id = serializers.CharField(max_length=50)
    security_code = serializers.CharField(max_length=50)
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        # extract data
        full_name = validated_data['full_name']
        email = validated_data['email']
        password = validated_data['password']

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            is_staff=True   # admin
        )

        AdminProfile.objects.create(
            user=user,
            full_name=validated_data['full_name'],
            designation=validated_data['designation'],
            department=validated_data['department'],
            employee_id=validated_data['employee_id'],
            security_code=validated_data['security_code']
        )

        return user

# PasswordReset
from django.contrib.auth.models import User
from rest_framework import serializers

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

# Admin reset password
from rest_framework import serializers

class AdminResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    security_code = serializers.CharField()
    new_password = serializers.CharField(min_length=6)

# user
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['full_name', 'phone_number']

class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    phone_number = serializers.CharField(max_length=20)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        full_name = validated_data['full_name']
        phone_number = validated_data['phone_number']
        email = validated_data['email']
        password = validated_data['password']

        username = email  # Using email as username

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        # Create Profile
        UserProfile.objects.create(
            user=user,
            full_name=full_name,
            phone_number=phone_number
        )

        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)



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

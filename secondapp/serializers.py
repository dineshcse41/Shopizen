# secondapp/serializers.py
from rest_framework import serializers              # DRF provides the serializers module for making serializers.
from django.contrib.auth.models import User         # get_user_model() ensures you always use the active User model (instead of hardcoding django.contrib.auth.models.User).
from django.contrib.auth import get_user_model
User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):      # Inherits from ModelSerializer → this automatically generates serializer fields based on a Django model (here: User).
    password = serializers.CharField(write_only=True)       # password = serializers.CharField(write_only=True) →
                                                            # Makes password a required field.
                                                            # write_only=True means password is accepted as input, but never returned in responses (important for security).
    
    
    class Meta:                                               # Tells DRF:
        model = User                                          # Which model? → User.
        fields = ['username', 'password', 'email']            # Which fields to expose in API? → username, password, email.
                                                              # So when someone does a POST request to register, these are the only allowed fields.
                                                              

    def create(self, validated_data):                          # This overrides how a new User is created.
        return User.objects.create_user(                       # Normally, if you just used User.objects.create(...), the password would be stored as plain text ❌ (very insecure).
            username=validated_data['username'],               # But create_user() automatically hashes the password (so it’s securely stored in DB). ✅
            password=validated_data['password'],               # validated_data is the dictionary of cleaned, validated inputs (e.g., { "username": "john", "password": "1234", "email": "test@mail.com" }).
            email=validated_data.get('email', '')
        )


# How It Works with the RegisterView

# User sends a request:

# POST /api/register/
# {
#   "username": "john",
#   "password": "mypassword",
#   "email": "john@example.com"
# }


# RegisterView passes this data into RegisterSerializer.

# serializer.is_valid() → checks required fields, data format, etc.

# serializer.save() → calls create() → creates a new User with hashed password.

# Response:

# {
#   "message": "User created successfully"
# }


# ✅ In short:
# This serializer makes sure new users can be registered securely by validating input and hashing the password properly before saving.
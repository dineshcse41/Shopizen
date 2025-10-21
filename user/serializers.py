from rest_framework import serializers
from django.contrib.auth.models import User
from product_api.models import Review

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_active', 'is_staff']

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    product = serializers.StringRelatedField()
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'product', 'rating', 'comment', 'approved', 'created_at']

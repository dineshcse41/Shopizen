from rest_framework import serializers
from user_shopizen.models import Product

class AdminProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'description', 'image',
            'category', 'category_name', 'brand', 'brand_name', 'created_at'
        ]

    def validate_name(self, value):
        """Prevent duplicate product names"""
        if Product.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("Product with this name already exists.")
        return value

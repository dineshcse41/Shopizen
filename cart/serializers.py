# cart/serializers.py
from rest_framework import serializers
from .models import Cart
from product_api.models import Product

class CartSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source="product.name")

# Adds a read-only field product_name that pulls the name from the related Product model.

# Example: Instead of just showing product: 3, the API response will include "product_name": "iPhone 14".

# This improves API usability for frontend developers.

    class Meta:
        model = Cart
        fields = ["id", "user", "product", "product_name", "quantity", "added_date"]
        read_only_fields = ["user", "added_date"]

# model = Cart → Serializer is tied to your Cart model.

# fields:

# id → unique cart item ID.

# user → which user owns the cart item (read-only).

# product → product ID (foreign key, writeable).

# product_name → product name (read-only, comes from product relation).

# quantity → how many units of the product in cart.

# added_date → timestamp when added (read-only).

# read_only_fields:

# user → we don’t let the client set this; it’s automatically assigned in the view (perform_create).

# added_date → auto-handled by the model (auto_now_add=True).
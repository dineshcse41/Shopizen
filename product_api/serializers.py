# secondapp/serializers.py

from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'      # Creates Product instance in DB
        
# Explanation

# from rest_framework import serializers

# Imports Django REST Framework’s serializers, which are used to convert Django models ↔ JSON (serialization & deserialization).

# class ProductSerializer(serializers.ModelSerializer):

# Creates a serializer class for the Product model.

# ModelSerializer is a shortcut — it automatically generates serializer fields based on the model fields (instead of writing each one manually).

# class Meta:

# Defines metadata for the serializer.

# model = Product

# Tells DRF which model to use (Product).

# fields = '__all__'

# Includes all fields from the Product model in the API response.

# If your Product model has fields like id, name, price, description, category, brand, etc., they will all be included.

# 🔑 What this does

# Converts model objects → JSON for API responses:

# product = Product.objects.first()
# serializer = ProductSerializer(product)
# print(serializer.data)


# Output:

# {
#   "id": 1,
#   "name": "Laptop",
#   "price": 50000,
#   "description": "High performance laptop",
#   "category": 2,
#   "brand": 1,
#   "created_at": "2025-08-22T15:30:00Z"
# }


# Converts JSON → model object for saving new data:

# data = {"name": "Tablet", "price": 15000, "description": "Android tablet"}
# serializer = ProductSerializer(data=data)
# if serializer.is_valid():
#     serializer.save()   # Creates Product instance in DB


# ✅ So ProductSerializer is the bridge between your Product model and the API (JSON).
# Without it, you’d have to manually convert models to dictionaries and back.



#------------------------------------------------------------------------------9th week task------------------------------------

# product_api/serializers.py
from rest_framework import serializers
from .models import Product
from wishlist.models import Wishlist
from .models import Review

class ProductCompareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "price", "description", "rating"]
        
# Simple serializer for product comparison.

# Only exposes the most relevant fields (id, name, price, description, rating).

# Used in your CompareProductsView.
# ➡️ Example Response for comparing two products:

# [
#   {"id": 1, "name": "iPhone 14", "price": "799.00", "description": "Latest iPhone", "rating": 4.5},
#   {"id": 2, "name": "Samsung S23", "price": "699.00", "description": "Flagship Samsung", "rating": 4.6}
# ]
      
#---------------wishlisht 

# product_api/serializers.py
class WishlistSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "product", "product_name"]
        
# ✅ Handles user wishlists.

# product → the product ID (FK).

# product_name → human-readable product name (read-only).

# ➡️ Example Response:

# [
#   {"id": 10, "product": 1, "product_name": "iPhone 14"},
#   {"id": 11, "product": 2, "product_name": "Samsung S23"}
# ]


# review 

# product_api/serializers.py
from order.models import OrderItem

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["id", "product", "rating", "comment", "created_at"]

    def validate(self, data):
        user = self.context["request"].user
        product = data["product"]

        # Check if user purchased this product
        purchased = OrderItem.objects.filter(order__user=user, product=product).exists()
        if not purchased:
            raise serializers.ValidationError("You must purchase this product before reviewing.")
        return data

    def create(self, validated_data):
        review = Review.objects.create(**validated_data)
        product = review.product
        # Update product average rating
        reviews = product.reviews.all()
        avg = sum(r.rating for r in reviews) / reviews.count()
        product.rating = avg
        product.save()
        return review

# Features:

# Purchase Validation:

# A user can only leave a review if they actually bought the product (OrderItem check).

# Prevents fake/spam reviews.

# Rating Update Logic:

# After each new review, it recalculates the average rating of the product.

# Keeps product rating in sync automatically.

# ➡️ Example Response:
# {
#   "id": 22,
#   "product": 1,
#   "rating": 5,
#   "comment": "Amazing quality!",
#   "created_at": "2025-09-13T08:30:00Z"
# }

# 🔹 Workflow Summary

# Compare Products → ProductCompareSerializer → used in /api/products/compare/

# Wishlist → WishlistSerializer → used in /api/wishlist/ (list, add, delete items)

# Reviews → ReviewSerializer

# Validates user purchase history before review.

# Auto-updates product average rating.

# ----------------------------------------------------------10th week task

from rest_framework import serializers
from .models import Offer

class OfferSerializer(serializers.ModelSerializer):
    # optionally show product name if Product has `name` field:
    product_name = serializers.ReadOnlyField(source="product.name")

    class Meta:
        model = Offer
        fields = [
            "id", "product", "product_name", "category",
            "discount_percent", "active", "start_date", "end_date", "created_at"
        ]

# ModelSerializer

# Automatically maps your Offer model fields → JSON fields.

# Less boilerplate, easy maintenance.

# product_name = serializers.ReadOnlyField(source="product.name")

# Exposes the name of the related Product (FK).

# source="product.name" → follows the relation and pulls the product’s name.

# Read-only → not required during creation, only visible in response.

# Example output:

# {
#   "id": 5,
#   "product": 12,
#   "product_name": "iPhone 14",
#   "category": null,
#   "discount_percent": "10.00",
#   "active": true,
#   "start_date": "2025-09-01T00:00:00Z",
#   "end_date": "2025-09-30T23:59:59Z",
#   "created_at": "2025-09-10T10:20:30Z"
# }


# fields

# Exposes both raw IDs (product) and human-readable (product_name) fields.

# Makes it API-friendly:

# Clients can submit product IDs when creating offers.

# Clients can display product names without an extra API call.
# 🔹 Why This Serializer is Great

# Keeps API readable (ID + name).

# Flexible for both product-level and category-level offers.

# Works perfectly with your ActiveOffersListView (filters out expired/inactive offers).



# ----------------------------------------------------------------Task(12)--------------------------------
# from rest_framework import serializers
# from .models import Product

# class ProductSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Product
#         fields = ["id", "name", "price"]
        
# ----------------------------------------------------------------Task(14)--------------------------------

# serializers.py
from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def validate_name(self, value):
        qs = Product.objects.filter(name__iexact=value)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
        if qs.exists():
            raise serializers.ValidationError("Product with this name already exists.")
        return value

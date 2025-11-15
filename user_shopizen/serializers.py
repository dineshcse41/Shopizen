# Task 2 updated
from rest_framework import serializers
from .models import Product, Cart, Order


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    brand = serializers.StringRelatedField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description', 'image', 'category', 'brand', 'created_at']

# task 4 updated
class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'product', 'product_id', 'quantity', 'added_date']

# Task 7 # task updated in 11(2)
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['product_name', 'quantity', 'price', 'subtotal']

    subtotal = serializers.SerializerMethodField()

    def get_subtotal(self, obj):
        return obj.subtotal()


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'total_price', 'status', 'created_at', 'items']
        read_only_fields = ['user', 'created_at']


# For placing order
class CreateOrderSerializer(serializers.Serializer):
    items = serializers.ListField(
        child=serializers.DictField(child=serializers.IntegerField())
    )

    def create(self, validated_data):
        user = self.context['request'].user
        items_data = validated_data['items']

        # Calculate total
        total_price = 0
        order = Order.objects.create(user=user, total_price=0)  # temp price

        for item in items_data:
            product_id = item.get('product')
            quantity = item.get('quantity', 1)

            product = Product.objects.get(id=product_id)
            total_price += product.price * quantity

            OrderItem.objects.create(order=order, product=product, quantity=quantity)

        # Update total
        order.total_price = total_price
        order.save()

        return order

# Task 9
from rest_framework import serializers
from .models import Product, Wishlist, Review, Order, OrderItem


# --- COMPARE PRODUCTS ---
class ProductCompareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description', 'image', 'brand', 'category', 'rating']


from rest_framework import serializers
from .models import Review, Wishlist, Offer, Product

# task updated in 10
# --- REVIEW SERIALIZER ---
class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'product', 'rating', 'comment', 'created_at']
        read_only_fields = ['user', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


# --- WISHLIST SERIALIZER ---
class WishlistSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', read_only=True, max_digits=10, decimal_places=2)
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_name', 'product_price', 'product_image', 'added_at']


# --- OFFER SERIALIZER ---
class OfferSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    active = serializers.SerializerMethodField()

    class Meta:
        model = Offer
        fields = ['id', 'offer_type', 'product_name', 'category_name', 'discount_percent', 'start_date', 'end_date', 'active']

    def get_active(self, obj):
        return obj.is_active


from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_active', 'date_joined']

from rest_framework import serializers
from .models import Refund   # <-- ensure Refund model exists


class RefundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refund
        fields = ['id', 'order', 'reason', 'status', 'created_at']

from rest_framework import serializers
from .models import Notification   # make sure Notification model exists


# user_shopizen/serializers.py
from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'type', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']

# task 13
from rest_framework import serializers
from .models import Wallet, WalletTransaction

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['id', 'balance']

class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = ['id', 'transaction_type', 'amount', 'description', 'created_at']


from rest_framework import serializers
from .models import ContactMessage

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'user', 'subject', 'message', 'admin_reply', 'status', 'created_at', 'replied_at']
        read_only_fields = ['id', 'status', 'admin_reply', 'created_at', 'replied_at']


from rest_framework import serializers
from .models import Address, Wishlist
from user_shopizen.serializers import ProductSerializer

# Address Serializer
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'full_name', 'phone', 'address_line', 'city', 'state', 'pincode', 'is_default', 'created_at']


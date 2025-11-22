# Task 2 updated
from rest_framework import serializers
from .models import *


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ("id", "image", "order")

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url"):
            url = obj.image.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return None


class ReviewMediaSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ReviewMedia
        fields = ("id", "image")

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url"):
            url = obj.image.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return None
 

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category = serializers.StringRelatedField()
    brand = serializers.StringRelatedField()
    subCategory = serializers.CharField(source='sub_category')
    dealOfTheDay = serializers.BooleanField(source='deal_of_the_day')
    isNewArrival = serializers.BooleanField(source='is_new_arrival')
    midSeasonSale = serializers.BooleanField(source='mid_season_sale')
    createdAt = serializers.DateTimeField(source='created_at')
    updatedAt = serializers.DateTimeField(source='updated_at')
    priceBySize = serializers.DictField(source='price_by_size')
    reviews = serializers.SerializerMethodField()
    price_by_size = serializers.JSONField(source="price_by_size", read_only=True)

    class Meta:
        model = Product
        fields = (
            "id", "name", "slug", "description", "price", "currency", "discount", "rating", "sizes", "stock","priceBySize", "price_by_size",
            "images", "reviews", "category", "subCategory", "brand", "tags", "dealOfTheDay",
            "isNewArrival", "midSeasonSale", "images", "sizes", "priceBySize",
            "createdAt", "updatedAt"
        )
        
    def get_images(self, obj):
        """
        Prefer the JSONField 'images' if populated (frontend expects that),
        otherwise return ProductImage set.
        JSONField may contain list of URLs or dicts; we'll normalize to list of strings (URLs).
        """
        request = self.context.get("request")

        # 1) If Product.images JSONField is non-empty (list), use that
        try:
            images_json = obj.__dict__.get("images", None)
        except Exception:
            images_json = None

        if images_json:
            # If items look like {"url": "..."} or strings, normalize to absolute URLs when possible
            normalized = []
            for item in images_json:
                if isinstance(item, dict) and ("url" in item or "image" in item):
                    url = item.get("url") or item.get("image")
                elif isinstance(item, str):
                    url = item
                else:
                    url = None
                if url and request and url.startswith("/"):
                    normalized.append(request.build_absolute_uri(url))
                else:
                    normalized.append(url)
            return normalized

        # 2) fallback: use ProductImage related objects
        imgs = ProductImage.objects.filter(product=obj).order_by("order")
        serializer = ProductImageSerializer(imgs, many=True, context={"request": request})
        # return just list of image URLs (to match your frontend which expects product.images to be array)
        urls = [it["image"] for it in serializer.data if it.get("image")]
        return urls

    def get_priceBySize(self, obj):
        # return price_by_size mapping, ensure keys/values simple primitives
        pb = obj.price_by_size or {}
        # convert values to float for JSON serialization
        return {k: float(v) for k, v in pb.items()}

    def get_reviews(self, obj):
        qs = obj.reviews.order_by("-created_at")
        return ReviewSerializer(qs, many=True, context=self.context).data


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.CharField()
    selected_size = serializers.CharField(allow_blank=True, required=False)
    price = serializers.DecimalField(max_digits=12, decimal_places=2)
    quantity = serializers.IntegerField(min_value=1, default=1)
# task 4 updated
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ("id", "product", "selected_size", "price", "quantity", "created_at")

from rest_framework import serializers
from .models import Cart, Product

class CartSerializer(serializers.ModelSerializer):
    product_details = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'product', 'quantity', 'added_at', 'product_details']
        read_only_fields = ['added_at', 'user']   # user will be set automatically

    def get_product_details(self, obj):
        """Return selected product info inside the cart response"""
        return {
            "id": obj.product.id,
            "name": obj.product.name,
            "price": obj.product.price,
            "image": obj.product.image.url if obj.product.image else None
        }


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
    media = ReviewMediaSerializer(many=True, read_only=True)
    user = serializers.SerializerMethodField()
    product = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ("id", "product", "user", "name", "stars", "text", "created_at", "updated_at", "media", "helpful_up", "helpful_down")

    def get_user(self, obj):
        if obj.user:
            return {"id": obj.user.id, "email": getattr(obj.user, "email", ""), "username": getattr(obj.user, "username", "")}
        return None

    

# --- WISHLIST SERIALIZER ---
class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ("id", "product", "created_at")


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
        fields = ['id', 'message', 'type', 'status', 'created_at']
        read_only_fields = ['id', 'created_at', 'status']


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


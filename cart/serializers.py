from rest_framework import serializers
from .models import Cart, CartItem, Order, Products

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = "__all__"


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Products.objects.all(), source='products', write_only=True
    )

    class Meta:
        model = CartItem
        fields = ["id", "product", "product_id", "quantity"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = ["id", "items"]

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", [])
        for item_data in items_data:
            product = item_data["product"]
            quantity = item_data["quantity"]

            cart_item, created = CartItem.objects.get_or_create(
                cart=instance, product=product
            )
            cart_item.quantity = quantity
            cart_item.save()

        return instance


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"
        read_only_fields = ["user", "created_at", "status"]

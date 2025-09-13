# order/serializers.py
from rest_framework import serializers
from .models import Order, OrderItem
from product_api.models import Product


class OrderItemSerializer(serializers.ModelSerializer):         # Represents each order item (a product + quantity inside an order).
    product_name = serializers.ReadOnlyField(source="product.name")  # product → returns the product ID. 

    class Meta:
        model = OrderItem               # product_name → returns the product’s name (from related Product).
        fields = ["product", "product_name", "quantity"]        # quantity → number of units of that product.


class OrderSerializer(serializers.ModelSerializer):         # Represents the whole order.
    items = OrderItemSerializer(many=True, read_only=True)      # items → nested list of OrderItemSerializer, showing products inside the order.
# read_only=True → ensures items are not directly writable via this serializer (you’re handling creation manually).

    class Meta:
        model = Order
        fields = ["id", "user", "items", "total_price", "status", "created_at"]
        read_only_fields = ["user", "status", "created_at", "total_price"]
        
# id → order ID.
# user → who placed the order.
# items → nested order items.
# total_price → calculated sum of all order items.
# status → order status (pending, confirmed, etc.).
# created_at → timestamp when order was created.
# ✅ read_only_fields ensures these are set by backend logic, not the client.

    # ✅ Serializer-level create (if we want to support nested creation directly)
    def create(self, validated_data):       # Retrieves the request from serializer context. , Identifies the logged-in user → ensures order is tied to the correct user.
        request = self.context.get("request")
        user = request.user if request else None

        items_data = self.initial_data.get("items", [])     # self.initial_data → raw request data (because nested items aren’t part of validated_data).
        order = Order.objects.create(user=user, total_price=0)  # Creates an order with total_price=0 (will update later).

        total_price = 0
        for item in items_data:             # Loops through each item:  Validates product exists (404 if not).
            product_id = item.get("product")        # Creates an OrderItem linked to the order.
            quantity = item.get("quantity", 1)      # Updates running total (price × quantity).

            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                raise serializers.ValidationError({"error": f"Product {product_id} not found"})

            OrderItem.objects.create(order=order, product=product, quantity=quantity)
            total_price += product.price * quantity

        order.total_price = total_price     # After processing all items, updates the final total.
        order.save()            # Returns the order instance.
        return order

# Why this design is good?

# Protects fields that should not be tampered with by clients (user, status, total_price).

# Nested representation makes frontend easier (no need to fetch order items separately).

# Backend enforces product existence & price logic (no trusting client-side).

# Easily extendable → can add shipping_address, payment_status, etc.
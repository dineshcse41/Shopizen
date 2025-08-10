from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem, Order
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer

# GET, POST, DELETE Cart Items
class CartView(generics.RetrieveUpdateAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart

    def delete(self, request, *args, **kwargs):
        cart = self.get_object()
        cart.items.all().delete()
        return Response({"message": "Cart cleared"}, status=status.HTTP_204_NO_CONTENT)


# Create Order from Cart
class CreateOrderView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        if not cart.items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        # Snapshot of cart
        items_data = [
            {"product": item.product.name, "price": str(item.product.price), "quantity": item.quantity}
            for item in cart.items.all()
        ]
        total_price = cart.total_price()

        order = Order.objects.create(
            user=request.user,
            items=items_data,
            total_price=total_price,
            status='pending'
        )

        # Clear cart
        cart.items.all().delete()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Get past orders
class OrderHistoryView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")

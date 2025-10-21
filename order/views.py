# order/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Order, OrderItem
from product_api.models import Product   # adjust to your product app name
from .serializers import OrderSerializer


class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):     # Ensures users only see their own orders, not everyone’s., Ensures users only see their own orders, not everyone’s.
        # return only current user’s orders
        return Order.objects.filter(user=self.request.user).order_by("-created_at")

    def create(self, request, *args, **kwargs):
        user = request.user
        items = request.data.get("items", [])

        if not items:       # Ensures order cannot be created without items.
            return Response(
                {"error": "No items provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        total_price = 0
        order = Order.objects.create(user=user, total_price=0)  # placeholder       Creates an order row in DB with a temporary total_price=0.  , Will be updated later once items are processed.

        for item in items:              # Loops through each item in request.
            product_id = item.get("product")        # Ensures the product exists (404 if not).
            quantity = item.get("quantity", 1)         # Defaults quantity to 1 if not provided.

            # ensure product exists
            product = get_object_or_404(Product, id=product_id)

            # create order item
            OrderItem.objects.create(           # Creates an OrderItem entry linked to the order.  Each order can have multiple items.
                order=order,
                product=product,
                quantity=quantity
            )

            # calculate running total
            total_price += product.price * quantity

        # update total price after all items are added
        order.total_price = total_price     # Once all items are added, updates the order’s total price.
        order.save()

        serializer = self.get_serializer(order)         # Serializes the final order and sends back as API response.
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")

#Same as above → returns all orders for the logged-in user.
# Useful if you want a separate endpoint for order history (e.g., /orders/history/).



#-----------------------------------------------9th week task----------------------------------------------------------------------------------------------------------------------
# order/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Order
from .serializers import OrderSerializer

# /api/orders/ → List user orders
class UserOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

# Endpoint: GET /api/orders/

# Returns all orders for the logged-in user.

# Uses ListAPIView, which automatically provides pagination, filtering, etc.

# Ensures only authenticated users can see their own orders (security).

# /api/orders/<id>/ → Get order details
class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "id"

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
# Endpoint: GET /api/orders/<id>/

# Fetches a single order by ID, but only if it belongs to the logged-in user.

# lookup_field = "id" → URL expects id instead of the default pk.

# Uses RetrieveAPIView, so it automatically returns a 404 if not found.

# 👉 Example:
# GET /api/orders/15/ → returns details for Order #15 if it belongs to the logged-in user.

# /api/orders/<id>/status → Update order status
class OrderStatusUpdateView(APIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Order.objects.all()

    def patch(self, request, id, *args, **kwargs):
        order = get_object_or_404(Order, id=id, user=request.user)
        status_choice = request.data.get("status")

        if status_choice not in ["Placed", "Shipped", "Delivered", "Cancelled", "Returned"]:
            return Response({"error": "Invalid status"}, status=400)

        # Cancel/Return business logic
        if status_choice in ["Cancelled", "Returned"]:
            if order.status in ["Shipped", "Delivered"]:
                return Response({"error": "Cannot cancel/return after shipment or delivery"}, status=400)

        order.status = status_choice
        order.save()
        return Response({"message": "Order status updated", "status": order.status})

# Endpoint: PATCH /api/orders/<id>/status

# Lets users update the status of their order.

# Uses APIView because we want custom business logic, not just standard CRUD.

# Ensures:

# Order belongs to the logged-in user.

# Only valid statuses can be applied.

# ---------------------------------10th week task --------------------------------------------------------------------------------------------------------------------------------

from rest_framework import generics
from order.models import Order
from order.serializers import OrderSerializer
from .permissions import IsAdminUserRole   # ✅ import here

class OrderUpdateStatusView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUserRole]

# -------------------------------------------- wishlist task 11(1)-------------------------------------------
# order/views.py
from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.response import Response
from .models import OrderItem
from .serializers import OrderSerializer

class CartUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, item_id):
        quantity = request.data.get("quantity")
        if not quantity or int(quantity) <= 0:
            return Response({"detail": "Invalid quantity"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order_item = OrderItem.objects.get(id=item_id, order__user=request.user, order__status="cart")
        except OrderItem.DoesNotExist:
            return Response({"detail": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)

        order_item.quantity = int(quantity)
        order_item.save()

        return Response(OrderSerializer(order_item.order).data, status=status.HTTP_200_OK)


# -------------------------------------------- wishlist task 11(2)-------------------------------------------

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Order, OrderItem
from cart.models import CartItem  # assuming you already have a CartItem model
from .serializers import OrderSerializer

class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        cart_items = CartItem.objects.filter(user=request.user)
        if not cart_items.exists():
            return Response({"detail": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(user=request.user)
        total_price = 0

        for item in cart_items:
            price = item.product.price * item.quantity
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )
            total_price += price

        order.total_price = total_price
        order.save()

        # clear cart after order confirmation
        cart_items.delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



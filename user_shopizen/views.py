#Products task 3
from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer

# List all products
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer


# Product details by ID
class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'id'


# Task 4 updated
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Product, Cart, Order
from .serializers import ProductSerializer, CartSerializer, OrderSerializer


# --- CART APIs ---
class CartListCreateView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartSerializer

    def get(self, request):
        """View user's cart"""
        cart_items = Cart.objects.filter(user=request.user)
        serializer = self.serializer_class(cart_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Add item to cart"""
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = Cart.objects.get_or_create(
            user=request.user, product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        serializer = self.serializer_class(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CartDeleteUpdateView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartSerializer

    def delete(self, request, pk):
        """Remove item from cart"""
        try:
            cart_item = Cart.objects.get(id=pk, user=request.user)
            cart_item.delete()
            return Response({'message': 'Item removed from cart'}, status=status.HTTP_204_NO_CONTENT)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        """Update cart item quantity"""
        try:
            cart_item = Cart.objects.get(id=pk, user=request.user)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

        quantity = int(request.data.get('quantity', 1))
        cart_item.quantity = quantity
        cart_item.save()
        serializer = self.serializer_class(cart_item)
        return Response(serializer.data)
        

# --- ORDER APIs ---
class CreateOrderView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def post(self, request):
        """Create order from cart"""
        cart_items = Cart.objects.filter(user=request.user)
        if not cart_items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        items = []
        total_price = 0

        for item in cart_items:
            product_data = {
                'product': item.product.name,
                'quantity': item.quantity,
                'price': str(item.product.price),
            }
            items.append(product_data)
            total_price += item.product.price * item.quantity

        order = Order.objects.create(
            user=request.user,
            items=items,
            total_price=total_price
        )

        # clear cart after checkout
        cart_items.delete()

        serializer = self.serializer_class(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserOrderListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        """List all past orders of the logged-in user"""
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


# task 6
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import Product
from .serializers import ProductSerializer


# --- PRODUCT LIST + SORT ---
class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Product.objects.all()

        # Sorting
        sort_option = self.request.query_params.get('sort')
        if sort_option == 'price_asc':
            queryset = queryset.order_by('price')
        elif sort_option == 'price_desc':
            queryset = queryset.order_by('-price')
        elif sort_option == 'latest':
            queryset = queryset.order_by('-created_at')
        else:
            queryset = queryset.order_by('id')  # default

        return queryset


# --- PRODUCT SEARCH ---
class ProductSearchView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        query = self.request.query_params.get('query', '')
        return Product.objects.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        ).order_by('-created_at')


# --- PRODUCT FILTER ---
class ProductFilterView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Product.objects.all()

        # Get filters from query params
        category = self.request.query_params.get('category')
        brand = self.request.query_params.get('brand')
        price_min = self.request.query_params.get('price_min')
        price_max = self.request.query_params.get('price_max')
        rating = self.request.query_params.get('rating')  # optional if you add ratings later

        # Apply filters dynamically
        if category:
            queryset = queryset.filter(category__name__icontains=category)
        if brand:
            queryset = queryset.filter(brand__name__icontains=brand)
        if price_min:
            queryset = queryset.filter(price__gte=price_min)
        if price_max:
            queryset = queryset.filter(price__lte=price_max)
        # (Rating logic can be added when Review model exists)

        return queryset.order_by('-created_at')

# Task 7
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer, CreateOrderSerializer


from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem, Cart
from .serializers import OrderSerializer


# ✅ Create order from cart
class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        cart_items = Cart.objects.filter(user=user)

        if not cart_items.exists():
            return Response({'error': 'Your cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        total_price = sum(item.product.price * item.quantity for item in cart_items)

        # Create order
        order = Order.objects.create(user=user, total_price=total_price)

        # Add order items
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        # Clear user’s cart after checkout
        cart_items.delete()

        return Response({'message': 'Order placed successfully', 'order_id': order.id}, status=status.HTTP_201_CREATED)

# ✅ List user orders
class UserOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')
    
# ✅ Get specific order details
class UserOrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

# Task 9
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import Product, Wishlist, Review, Order
from .serializers import (
    ProductCompareSerializer, WishlistSerializer, ReviewSerializer,
    OrderSerializer
)

# --- ORDERS ---
class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, id):
        try:
            order = Order.objects.get(id=id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        new_status = request.data.get('status')
        allowed_status = ['Placed', 'Shipped', 'Delivered', 'Cancelled', 'Returned']

        if new_status not in allowed_status:
            return Response({"error": "Invalid status"}, status=400)

        # Business logic for cancel/return
        if new_status in ['Cancelled', 'Returned'] and order.status == 'Delivered':
            return Response({"error": "Delivered orders cannot be cancelled"}, status=400)

        order.status = new_status
        order.save()
        return Response({"message": f"Order status updated to {new_status}"}, status=200)


# --- COMPARE PRODUCTS ---
class ProductCompareView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        ids = request.query_params.getlist('ids')
        products = Product.objects.filter(id__in=ids)
        serializer = ProductCompareSerializer(products, many=True)
        return Response(serializer.data)


# --- WISHLIST ---
class WishlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wishlist = Wishlist.objects.filter(user=request.user)
        serializer = WishlistSerializer(wishlist, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = WishlistSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request):
        product_id = request.data.get('product_id')
        Wishlist.objects.filter(user=request.user, product_id=product_id).delete()
        return Response({"message": "Removed from wishlist"}, status=200)


# --- REVIEWS ---
class ReviewView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request):
        serializer = ReviewSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

    def get(self, request):
        product_id = request.query_params.get('product_id')
        reviews = Review.objects.filter(product_id=product_id)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

# Task 10
# user_shopizen/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from datetime import date
from .models import Review, Wishlist, Offer, Product
from .serializers import ReviewSerializer, WishlistSerializer, OfferSerializer


# --- REVIEWS ---
class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ProductReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return Review.objects.filter(product_id=product_id).order_by('-created_at')


# --- OFFERS ---
class OfferListView(generics.ListAPIView):
    serializer_class = OfferSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        today = date.today()
        return Offer.objects.filter(start_date__lte=today, end_date__gte=today)


from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Wallet, WalletTransaction
from .serializers import WalletSerializer, WalletTransactionSerializer

class WalletDetailView(generics.RetrieveAPIView):
    serializer_class = WalletSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        wallet, created = Wallet.objects.get_or_create(user=self.request.user)
        return wallet


class WalletAddCreditView(generics.CreateAPIView):
    serializer_class = WalletTransactionSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        amount = request.data.get('amount')
        desc = request.data.get('description', 'Wallet top-up')

        try:
            amount = float(amount)
            if amount <= 0:
                raise ValueError
        except (ValueError, TypeError):
            return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

        wallet.balance += amount
        wallet.save()

        WalletTransaction.objects.create(wallet=wallet, amount=amount, transaction_type='credit', description=desc)

        return Response({'message': f'{amount} credited to wallet', 'new_balance': wallet.balance}, status=status.HTTP_201_CREATED)


# user_shopizen/views_notifications.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.permissions import IsAdminUser


# 1️⃣ Get All Notifications (User)
class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)


# 2️⃣ Mark Notification as Read
class NotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        try:
            notification = Notification.objects.get(id=id, user=request.user)
            notification.status = 'read'
            notification.save()
            return Response({'message': 'Notification marked as read'})
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)


# 3️⃣ Admin: Create System Notification
class AdminNotificationCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

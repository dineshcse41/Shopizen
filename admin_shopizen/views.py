# Task 10
from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from user_shopizen.models import Product
from .serializers import AdminProductSerializer
from .permissions import IsAdminUser


class AdminProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = AdminProductSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        brand = self.request.query_params.get('brand')

        if category:
            queryset = queryset.filter(category__id=category)
        if brand:
            queryset = queryset.filter(brand__id=brand)

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'Product created successfully', 'data': serializer.data},
                        status=status.HTTP_201_CREATED)


class AdminProductRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = AdminProductSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        product = self.get_object()
        new_name = request.data.get('name')

        # Prevent duplicate product names
        if new_name and Product.objects.filter(name__iexact=new_name).exclude(id=product.id).exists():
            return Response({'error': 'Product with this name already exists.'},
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(product, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'Product updated successfully', 'data': serializer.data})

    def destroy(self, request, *args, **kwargs):
        product = self.get_object()
        product.delete()
        return Response({'message': 'Product deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


# admin_shopizen/views_orders.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from user_shopizen.models import Order
from user_shopizen.serializers import OrderSerializer
from .permissions import IsAdminUser

class AdminOrderListView(generics.ListAPIView):
    queryset = Order.objects.select_related('user').prefetch_related('products')
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminOrderDetailView(generics.RetrieveAPIView):
    queryset = Order.objects.select_related('user').prefetch_related('products')
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'


class AdminOrderStatusUpdateView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        order = self.get_object()
        new_status = request.data.get('status')

        if new_status not in ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']:
            return Response({'error': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status
        order.save()
        return Response({'message': f'Order status updated to {new_status}.'})

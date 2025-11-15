from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Address, Wishlist
from .serializers import AddressSerializer, WishlistSerializer
from user_shopizen.models import Product


# ---------------- ADDRESS APIs ---------------- #

class AddressListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        addresses = Address.objects.filter(user=request.user).order_by('-created_at')
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data)


class AddressAddView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        serializer = AddressSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddressUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        try:
            address = Address.objects.get(id=id, user=request.user)
        except Address.DoesNotExist:
            return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AddressSerializer(address, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddressDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            address = Address.objects.get(id=id, user=request.user)
            address.delete()
            return Response({'message': 'Address deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Address.DoesNotExist:
            return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)



from rest_framework import generics, permissions, status
from rest_framework.response import Response
from datetime import date
from .models import Review, Wishlist, Offer, Product
from .serializers import ReviewSerializer, WishlistSerializer, OfferSerializer


# --- WISHLIST ---
class WishlistListCreateView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WishlistDeleteView(generics.DestroyAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'product_id'

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

# ✅ Add product to wishlist  Task 11(1)
class WishlistAddView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        item, created = Wishlist.objects.get_or_create(user=request.user, product=product)
        if not created:
            return Response({'message': 'Product already in wishlist'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Added to wishlist'}, status=status.HTTP_201_CREATED)

class WishlistListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wishlist_items = Wishlist.objects.filter(user=request.user).select_related('product')
        serializer = WishlistSerializer(wishlist_items, many=True)
        return Response(serializer.data)



class WishlistRemoveView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            item = Wishlist.objects.get(id=id, user=request.user)
            item.delete()
            return Response({'message': 'Removed from wishlist'}, status=status.HTTP_204_NO_CONTENT)
        except Wishlist.DoesNotExist:
            return Response({'error': 'Wishlist item not found'}, status=status.HTTP_404_NOT_FOUND)
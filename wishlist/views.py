# wishlist/views.py

from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.db import IntegrityError
from django.db.models import Sum
from django.http import JsonResponse

# Import models & serializers
from .models import Wishlist, Wallet, WalletTransaction, Notification
from .serializers import (
    WishlistSerializer,
    WalletSerializer,
    WalletTransactionSerializer,
    AddCreditSerializer,
    NotificationSerializer,
)

# ================================================================
# 🔹 WISHLIST APIS
# ================================================================
class WishlistListCreateAPIView(generics.ListCreateAPIView):
    """
    List all wishlist items for the logged-in user
    or add a new item to the wishlist.
    """
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except IntegrityError:
            raise serializers.ValidationError({'detail': 'Product already in wishlist'})


class WishlistRemoveAPIView(APIView):
    """
    Remove a specific item from the wishlist.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        item = get_object_or_404(Wishlist, pk=pk, user=request.user)
        item.delete()
        return Response({'detail': 'Removed from wishlist'}, status=status.HTTP_204_NO_CONTENT)


# ================================================================
# 🔹 WALLET APIS
# ================================================================
class WalletRetrieveAPIView(APIView):
    """
    Retrieve wallet details and recent transactions.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        serializer = WalletSerializer(wallet)
        txns = WalletTransaction.objects.filter(wallet=wallet).order_by('-created_at')[:10]
        txn_ser = WalletTransactionSerializer(txns, many=True)
        return Response({'wallet': serializer.data, 'recent_transactions': txn_ser.data})


class WalletTransactionsListAPIView(generics.ListAPIView):
    """
    List all wallet transactions for the logged-in user.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WalletTransactionSerializer

    def get_queryset(self):
        wallet, _ = Wallet.objects.get_or_create(user=self.request.user)
        return WalletTransaction.objects.filter(wallet=wallet)


class WalletAddCreditAPIView(APIView):
    """
    Add credit to the user's wallet (admin or payment API usage).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AddCreditSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            txn = serializer.save(request.user)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        txn_ser = WalletTransactionSerializer(txn)
        return Response(txn_ser.data, status=status.HTTP_201_CREATED)


# ================================================================
# 🔹 NOTIFICATION APIS (Task 12)
# ================================================================
class NotificationListCreateView(generics.ListCreateAPIView):
    """
    Admin API to list or create notifications.
    """
    queryset = Notification.objects.order_by("-created_at")
    serializer_class = NotificationSerializer
    permission_classes = [permission_classes, permissions.IsAdminUser]


@api_view(["DELETE"])
@permission_classes([permissions.IsAdminUser])
def delete_notification(request, pk):
    Notification.objects.filter(pk=pk).delete()
    return Response({"detail": "Notification deleted"}, status=status.HTTP_204_NO_CONTENT)


# ================================================================
# 🔹 ERROR HANDLING ENDPOINTS
# ================================================================
@api_view(['GET'])
def error_forbidden(request):
    return Response({'detail': 'You do not have permission to access this resource.'},
                    status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
def error_session_expired(request):
    return Response({'detail': 'Session expired. Please login again.',
                     'code': 'session_expired'}, status=status.HTTP_401_UNAUTHORIZED)


# Global Django error handlers
def django_403_handler(request, exception=None):
    return JsonResponse({'detail': 'Forbidden'}, status=403)


def django_session_expired_handler(request):
    return JsonResponse({'detail': 'Session expired', 'code': 'session_expired'}, status=401)

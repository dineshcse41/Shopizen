# wishlist/urls.py
from django.urls import path
from .views import (
    WishlistListCreateAPIView,
    WishlistRemoveAPIView,
    WalletRetrieveAPIView,
    WalletTransactionsListAPIView,
    WalletAddCreditAPIView,
    NotificationListCreateView,
    delete_notification,
)

urlpatterns = [
    # Wishlist
    path('', WishlistListCreateAPIView.as_view(), name='wishlist-list-create'),
    path('<int:pk>/remove/', WishlistRemoveAPIView.as_view(), name='wishlist-remove'),

    # Wallet
    path('wallet/', WalletRetrieveAPIView.as_view(), name='wallet-detail'),
    path('wallet/transactions/', WalletTransactionsListAPIView.as_view(), name='wallet-transactions'),
    path('wallet/add-credit/', WalletAddCreditAPIView.as_view(), name='wallet-add-credit'),

    # Notifications (admin)
    path('notifications/', NotificationListCreateView.as_view(), name='notification-list-create'),
    path('notifications/<int:pk>/delete/', delete_notification, name='delete-notification'),
]

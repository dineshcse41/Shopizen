from django.urls import path
from .views import (
    # Product
    ProductListView, ProductDetailView,
    # Cart
    CartListCreateView, CartDeleteUpdateView,
    # Order 
    CreateOrderView, UserOrderListView,OrderDetailView, OrderStatusUpdateView,
    # Search & Filter
    ProductSearchView, ProductFilterView,
    ProductCompareView, WishlistView, ReviewView,
    ReviewCreateView, ProductReviewListView,
    OfferListView,
    OrderCreateView,UserOrderDetailView,
    
    WalletDetailView, WalletAddCreditView,
    NotificationListView,
    NotificationReadView,
    AdminNotificationCreateView,
)
from .views_contact import *
from .views_wallet import *
from .views_address_wishlist import *

urlpatterns = [
    # Product APIs
    path('api/products/', ProductListView.as_view(), name='product-list'),
    path('api/products/<int:id>/', ProductDetailView.as_view(), name='product-detail'),

    # Cart APIs
    path('api/cart/', CartListCreateView.as_view(), name='cart'),
    path('api/cart/<int:pk>/', CartDeleteUpdateView.as_view(), name='cart-update-delete'),

    # Order APIs
    path('api/orders/create/', CreateOrderView.as_view(), name='create-order'),
    path('api/orders/', UserOrderListView.as_view(), name='user-orders'),
    path('api/orders/<int:id>/', OrderDetailView.as_view(), name='order-detail'),
    path('api/orders/<int:id>/status/', OrderStatusUpdateView.as_view(), name='order-status'),
    path('api/orders/create/', OrderCreateView.as_view(), name='order-create'),
    path('api/orders/<int:id>/', UserOrderDetailView.as_view(), name='order-detail'),
    
    # Search & Filter
    path('api/products/search/', ProductSearchView.as_view(), name='product-search'),
    path('api/products/filter/', ProductFilterView.as_view(), name='product-filter'),
    # Compare
    path('api/compare/', ProductCompareView.as_view(), name='product-compare'),

    # Wishlist
    path('api/wishlist/', WishlistView.as_view(), name='wishlist'),
    path('api/wishlist/create/', WishlistListCreateView.as_view(), name='wishlist-list-create'),
    path('api/wishlist/<int:product_id>/', WishlistDeleteView.as_view(), name='wishlist-delete'),
    path('api/wishlist/add/', WishlistAddView.as_view(), name='wishlist-add'),
    path('api/wishlist/remove/<int:product_id>/', WishlistRemoveView.as_view(), name='wishlist-remove'),
    path('api/wishlist/', WishlistListView.as_view(), name='wishlist-list'),
    
    # Address APIs
    path('api/address/', AddressListView.as_view(), name='address-list'),
    path('api/address/add/', AddressAddView.as_view(), name='address-add'),
    path('api/address/<int:id>/', AddressUpdateView.as_view(), name='address-update'),
    path('api/address/<int:id>/delete/', AddressDeleteView.as_view(), name='address-delete'),



    # Reviews
    path('api/reviews/', ReviewView.as_view(), name='reviews'),
    path('api/reviews/', ReviewCreateView.as_view(), name='review-create'),
    path('api/products/<int:product_id>/reviews/', ProductReviewListView.as_view(), name='product-reviews'),
    # --- Offers ---
    path('api/offers/', OfferListView.as_view(), name='offer-list'),
    
    path('api/wallet/', WalletDetailView.as_view(), name='wallet-detail'),
    path('api/wallet/add-credit/', WalletAddCreditView.as_view(), name='wallet-add-credit'),
    
    # Notification
    path('api/notifications/', NotificationListView.as_view(), name='notification-list'),
    path('api/notifications/<int:id>/read/', NotificationReadView.as_view(), name='notification-read'),
    path('api/notifications/create/', AdminNotificationCreateView.as_view(), name='notification-create'),
    # contact
    path('api/contact/send/', ContactSendView.as_view(), name='contact-send'),
    
    # Wallet
    path('api/wallet/', WalletBalanceView.as_view(), name='wallet-balance'),
    path('api/wallet/add/', WalletAddFundsView.as_view(), name='wallet-add'),
    path('api/wallet/transactions/', WalletTransactionListView.as_view(), name='wallet-transactions'),
]

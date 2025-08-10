from django.urls import path
from .views import CartView, CreateOrderView, OrderHistoryView

urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),
    path("order/create/", CreateOrderView.as_view(), name="order-create"),
    path("orders/history/", OrderHistoryView.as_view(), name="order-history"),
]

# order/urls.py
from django.urls import path
from .views import OrderListCreateView
# project/urls.py
from django.urls import path
from order.views import UserOrdersView, OrderDetailView, OrderStatusUpdateView, OrderUpdateStatusView
from product_api.views import CompareProductsView, WishlistView, ReviewListCreateView

urlpatterns = [
    path("orders/", OrderListCreateView.as_view(), name="order-list-create"),
    
    
     # Orders
    path("api/orders/", UserOrdersView.as_view()),
    path("api/orders/<int:id>/", OrderDetailView.as_view()),
    path("api/orders/<int:id>/status/", OrderStatusUpdateView.as_view()),
    
# -------------------------------------10th week task 

    path("orders/<int:pk>/updatestatus/", OrderUpdateStatusView.as_view(), name="order-update-status"),
]


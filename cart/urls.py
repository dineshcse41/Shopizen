# cart/urls.py
from django.urls import path
from .views import CartListCreateView, CartDeleteView

urlpatterns = [
    path("cart/", CartListCreateView.as_view(), name="cart-list-create"),
    path("cart/<int:pk>/", CartDeleteView.as_view(), name="cart-delete"),
]

# secondapp/urls.py

from django.urls import path
from . import views
from .views import ProductListCreateView

urlpatterns = [
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', views.product_detail, name='product_detail'),
]

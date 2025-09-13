# secondapp/urls.py

from django.urls import path
from . import views
from .views import ProductListCreateView
from django.urls import path
from order.views import UserOrdersView, OrderDetailView, OrderStatusUpdateView
from product_api.views import CompareProductsView, WishlistView, ReviewListCreateView
from product_api.views import ActiveOffersListView, ProductCRUDView, ProductDetailView
from product_api.views import ReviewCreateView, ProductReviewListView, ProductReviewListCreateView


urlpatterns = [
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', views.product_detail, name='product_detail'),
    path('api/products/search/', views.product_search, name='product-search'),
    path('api/products/filter/', views.product_filter, name='product-filter'),
    path('api/products/', views.product_sort, name='product-sort'),
#------------------------------------------ 9th week task #
    # Orders
    path("api/orders/", UserOrdersView.as_view()),
    path("api/orders/<int:id>/", OrderDetailView.as_view()),
    path("api/orders/<int:id>/status/", OrderStatusUpdateView.as_view()),

    # Compare
    path("api/compare/", CompareProductsView.as_view()),

    # Wishlist
    path("api/wishlist/", WishlistView.as_view()),

    # Reviews
    path("api/reviews/", ReviewListCreateView.as_view()),

#--------------------------------------------10th week task
 
    path("products/<int:product_id>/reviews/", ProductReviewListView.as_view(), name="product-reviews"),
    path("offers/", ActiveOffersListView.as_view(), name="active-offers"),
    
    path("products/", ProductCRUDView.as_view(), name="product-crud"),
    path("products/<int:pk>/", ProductDetailView.as_view(), name="product-detail"),
    path("productss/<int:product_id>/reviews/", ProductReviewListCreateView.as_view(), name="product-reviews"),

]



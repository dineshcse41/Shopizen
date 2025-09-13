from rest_framework.decorators import api_view   # For function-based API views
from rest_framework.response import Response     # For returning API responses
from rest_framework import status                # For standard HTTP status codes
from .models import Product                      # Import Product model
from .serializers import ProductSerializer       # Import serializer for Product model
from rest_framework import generics              # For class-based generic API views


@api_view(['GET'])
def product_list(request):
    products = Product.objects.all()                     # Get all products from DB
    serializer = ProductSerializer(products, many=True)  # Convert queryset → JSON
    return Response(serializer.data)                     # Send serialized data as response

# Purpose: Returns a list of all products.

# many=True → because we are serializing multiple objects (a list of products).

# Example response:
# [
#   {"id": 1, "name": "Laptop", "price": 50000},
#   {"id": 2, "name": "Phone", "price": 20000}
# ]

@api_view(['GET'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)      # Find product by primary key (id)
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = ProductSerializer(product)       # Serialize single product
    return Response(serializer.data)              # Return serialized product data
# Purpose: Returns one product by ID.

# Uses try/except to handle if product does not exist → returns 404 Not Found.

# Example request: /api/products/1/
# Response:

# {"id": 1, "name": "Laptop", "price": 50000}
class ProductListCreateView(generics.ListCreateAPIView):  # NOT ListAPIView
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
# Inherits from ListCreateAPIView, which provides two things:

# GET → List all products (same as product_list)

# POST → Create a new product (automatically handled by DRF)

# DRF takes care of:

# Validation using ProductSerializer

# Saving the object if data is valid

# Returning 201 Created if success

# ✅ Example requests:

# GET /api/products/ → list all products

# POST /api/products/

# {
#   "name": "Tablet",
#   "price": 15000,
#   "description": "Android tablet"
# }
# -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
from rest_framework.decorators import api_view      # @api_view → tells Django REST Framework that this function is an API endpoint (accepts GET requests here)
from rest_framework.response import Response        # Response → used to return JSON data.
from django.db.models import Q                      # Q → allows complex queries (e.g., OR conditions).
from .models import Product                         # Product → your database model.
from .serializers import ProductSerializer          # ProductSerializer → converts Product objects → JSON.

@api_view(['GET'])
def product_search(request):
    query = request.GET.get('query', '')
    products = Product.objects.filter(
        Q(name__icontains=query) | Q(description__icontains=query)
    )
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# Logic:

# Reads query from URL → /api/products/search?query=phone.

# Uses Q() to check if query is inside name OR description (icontains = case-insensitive substring search).

# Example: "phone" matches "iPhone" or "Smartphone".

# Gets matching products from DB.

# Serializes them into JSON.

# Returns the result.

# ✅ Use case: search bar on e-commerce site.

@api_view(['GET'])
def product_filter(request):
    products = Product.objects.all()

    # Dynamic filters
    category = request.GET.get('category')
    brand = request.GET.get('brand')
    price_min = request.GET.get('price_min')
    price_max = request.GET.get('price_max')
    rating = request.GET.get('rating')

    if category:
        products = products.filter(category__iexact=category)
    if brand:
        products = products.filter(brand__iexact=brand)
    if price_min:
        products = products.filter(price__gte=price_min)
    if price_max:
        products = products.filter(price__lte=price_max)
    if rating:
        products = products.filter(rating__gte=rating)

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# Logic:

# Start with all products.

# Apply filters only if query params are present:

# category__iexact → exact match but case-insensitive (Electronics = electronics).

# brand__iexact → same for brand.

# price__gte → price greater than or equal.

# price__lte → price less than or equal.

# rating__gte → minimum rating.

# Each filter is optional, so users can combine them:

# /api/products/filter?category=Electronics&price_min=5000&rating=4

# Serialize & return JSON.

# ✅ Use case: sidebar filters on shopping site.

@api_view(['GET'])
def product_sort(request):
    sort = request.GET.get('sort', '')

    if sort == 'price_asc':
        products = Product.objects.all().order_by('price')
    elif sort == 'price_desc':
        products = Product.objects.all().order_by('-price')
    elif sort == 'latest':
        products = Product.objects.all().order_by('-created_at')
    else:
        products = Product.objects.all()  # default

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# Logic:

# Reads sort parameter → /api/products?sort=price_desc.

# Orders products:

# price_asc → lowest → highest.

# price_desc → highest → lowest.

# latest → newest first (based on created_at).

# default → no sorting.

# Serializes & returns results.

# ✅ Use case: sorting dropdown (e.g., "Price Low to High").

# 🚀 Summary

# product_search → find products by keyword (name/description).

# product_filter → dynamically filter by category, brand, price, rating.

# product_sort → order products by price or latest.

# Together, these APIs provide a basic e-commerce product system:
# 👉 Search 🔎 + Filter 🎛️ + Sort ↕️



#------------------------------------------------------------------------------9th week task------------------------------------

# product_api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product
from .serializers import ProductCompareSerializer

class CompareProductsView(APIView):
    def post(self, request):
        product_ids = request.data.get("product_ids", [])
        products = Product.objects.filter(id__in=product_ids)
        serializer = ProductCompareSerializer(products, many=True)
        return Response(serializer.data)

# What it does:

# Endpoint: POST /api/products/compare/

# Accepts a list of product_ids in the request body.

# Fetches those products from the database.

# Serializes them with ProductCompareSerializer → sends back comparison data.

# 👉 Example request:

# POST /api/products/compare/
# {
#   "product_ids": [1, 2, 5]
# }
# 👉 Example response:
# [
#   {"id": 1, "name": "iPhone 14", "price": 80000, "rating": 4.5},
#   {"id": 2, "name": "Samsung S23", "price": 75000, "rating": 4.3},
#   {"id": 5, "name": "OnePlus 11", "price": 60000, "rating": 4.2}
# ]


# ➡️ Useful for "Compare Products" feature on e-commerce sites.

#wishlisht

# product_api/views.py
from rest_framework import generics, permissions
from .models import Wishlist
from .serializers import WishlistSerializer

class WishlistView(generics.ListCreateAPIView, generics.DestroyAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ✅ What it does:

# Combines list, add, and delete in one view.

# Endpoint:

# GET /api/wishlist/ → list all wishlist items for logged-in user.

# POST /api/wishlist/ → add a product to wishlist.

# DELETE /api/wishlist/<id>/ → remove a wishlist item.

# Always filters by user so each person sees only their wishlist.

# 👉 Example flow:

# User clicks "Add to wishlist" → POST {"product": 2}

# User views their wishlist → GET /api/wishlist/

# User removes item → DELETE /api/wishlist/10/

# product_api/views.py
from rest_framework import generics, permissions
from .models import Review
from .serializers import ReviewSerializer

class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product_id = self.request.query_params.get("product_id")
        if product_id:
            return Review.objects.filter(product_id=product_id)
        return Review.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# What it does:

# Endpoint: GET /api/reviews/?product_id=123

# Returns reviews for a specific product (if product_id is given).

# Otherwise returns all reviews (not common, but useful for admin).

# Endpoint: POST /api/reviews/

# Allows logged-in users to create a review.

# Automatically assigns user=self.request.user.

# 👉 Example:

# POST /api/reviews/
# {
#   "product": 5,
#   "rating": 4,
#   "comment": "Good phone but battery life could be better."
# }


# ➡️ IsAuthenticatedOrReadOnly ensures:

# Anyone can view reviews.

# Only logged-in users can post.

# 🔹 Summary

# CompareProductsView → lets users compare multiple products (feature tables).

# WishlistView → authenticated users can add/remove products from their wishlist.

# ReviewListCreateView → shows reviews per product & lets users write their own.

# -----------------------------------------------------------10th week --------------------------------------------------
from rest_framework import generics, permissions
from .models import Review
from .serializers import ReviewSerializer


class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
# Only lets authenticated users create a new review.
# ➡️ Example: POST /api/reviews/

class ProductReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        product_id = self.kwargs["product_id"]
        return Review.objects.filter(product_id=product_id).order_by("-created_at")

# ✅ Lists reviews for a specific product.
# ➡️ Example: GET /api/products/5/reviews/

class ProductReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product_id = self.kwargs["product_id"]
        return Review.objects.filter(product_id=product_id).order_by("-created_at")

    def perform_create(self, serializer):
        product_id = self.kwargs["product_id"]
        serializer.save(user=self.request.user, product_id=product_id)
        
# ✅ Combines both list and create in a single endpoint.

# GET /api/products/5/reviews/ → show reviews for product 5

# POST /api/products/5/reviews/ → add new review for product 5

# 🔑 IsAuthenticatedOrReadOnly:

# Anyone can see reviews.

# Only logged-in users can create reviews.     
        
  
from django.utils import timezone
from rest_framework import generics
from .models import Offer
from .serializers import OfferSerializer
from django.db.models import Q

class ActiveOffersListView(generics.ListAPIView):
    serializer_class = OfferSerializer

    def get_queryset(self):
        now = timezone.now()
        qs = Offer.objects.filter(active=True).filter(
            Q(start_date__isnull=True) | Q(start_date__lte=now),
            Q(end_date__isnull=True) | Q(end_date__gte=now),
        ).order_by("-discount_percent", "-created_at")
        return qs
    
# ✅ Lists all currently active offers.

# Filters by active=True.

# Checks that start_date and end_date are valid.

# Orders by highest discount first, then newest.

# ➡️ Example: GET /api/offers/active/


from product_api.models import Product
from product_api.serializers import ProductSerializer
from .permissions import IsAdminUserRole

class ProductCRUDView(generics.ListCreateAPIView):  # ✅ Lets admins list all products and create new ones.
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUserRole]


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView): # Lets admins retrieve, update, or delete a single product.
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUserRole]

# Summary

# Reviews

# ReviewCreateView → create review (only POST).

# ProductReviewListView → list reviews for product (only GET).

# ProductReviewListCreateView → both GET and POST in one.

# Offers

# ActiveOffersListView → only show valid, active offers.

# Products

# ProductCRUDView → list + create (admin only).

# ProductDetailView → retrieve + update + delete (admin only).
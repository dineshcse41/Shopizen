# secondapp/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer
from rest_framework import generics

@api_view(['GET'])
def product_list(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(product)
    return Response(serializer.data)

class ProductListCreateView(generics.ListCreateAPIView):  # NOT ListAPIView
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    
# secondapp/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from .models import Product
from .serializers import ProductSerializer

@api_view(['GET'])
def product_search(request):
    query = request.GET.get('query', '')
    products = Product.objects.filter(
        Q(name__icontains=query) | Q(description__icontains=query)
    )
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


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


from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from user_shopizen.models import Category, Brand
from .serializers_category_brand import AdminCategorySerializer, AdminBrandSerializer
from .permissions import IsAdminUser

# CATEGORY CRUD
class AdminCategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all().order_by('name')
    serializer_class = AdminCategorySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'Category created successfully', 'data': serializer.data},
                        status=status.HTTP_201_CREATED)


class AdminCategoryUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = AdminCategorySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        category = self.get_object()
        new_name = request.data.get('name')

        # Prevent duplicate
        if new_name and Category.objects.filter(name__iexact=new_name).exclude(id=category.id).exists():
            return Response({'error': 'Category with this name already exists.'},
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(category, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'Category updated successfully', 'data': serializer.data})

    def destroy(self, request, *args, **kwargs):
        category = self.get_object()
        category.delete()
        return Response({'message': 'Category deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


# BRAND CRUD
class AdminBrandListCreateView(generics.ListCreateAPIView):
    queryset = Brand.objects.all().order_by('name')
    serializer_class = AdminBrandSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'Brand created successfully', 'data': serializer.data},
                        status=status.HTTP_201_CREATED)


class AdminBrandUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Brand.objects.all()
    serializer_class = AdminBrandSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        brand = self.get_object()
        new_name = request.data.get('name')

        if new_name and Brand.objects.filter(name__iexact=new_name).exclude(id=brand.id).exists():
            return Response({'error': 'Brand with this name already exists.'},
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(brand, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'Brand updated successfully', 'data': serializer.data})

    def destroy(self, request, *args, **kwargs):
        brand = self.get_object()
        brand.delete()
        return Response({'message': 'Brand deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

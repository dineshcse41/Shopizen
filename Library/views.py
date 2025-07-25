from rest_framework.viewsets import ModelViewSet
from rest_framework import generics
from .models import Book, Laptops
from .serializers import Book_Serializer, Laptop_Serializer

class BookView(ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = Book_Serializer

class LaptopView(generics.ListCreateAPIView):
    
    def get_queryset(self):
        return Laptops.objects.filter(brand = 'hp')
    
    def perform_create(self, serializer):
        
        print(self.request.data)
    
    queryset = Laptops.objects.all()
    serializer_class = Laptop_Serializer

class LaptopViewById(generics.RetrieveUpdateDestroyAPIView):
    
    queryset = Laptops.objects.all()
    serializer_class = Laptop_Serializer

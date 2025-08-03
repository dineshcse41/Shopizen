from rest_framework.serializers import ModelSerializer
from .models import Book, Laptops

class Book_Serializer(ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
        
class Laptop_Serializer(ModelSerializer):
    class Meta:
        model = Laptops
        fields = '__all__'

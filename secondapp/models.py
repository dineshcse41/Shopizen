from django.db import models


class Category(models.Model):                   # models.Model → Base class for all Django models.
    name = models.CharField(max_length=100, unique=True)     # name = models.CharField(max_length=100) 
                                                # CharField = short text field (max 100 characters).
                                                # Example: "Electronics", "Shoes".
    def __str__(self):                          # __str__ method → Controls how this object is shown (e.g., in Django Admin).
        return self.name                        # If you open Django admin, instead of seeing "Category object (1)", you’ll see "Electronics".
                                                # 📌 Database table → Category with one column: name.


class Brand(models.Model):                      # Same as Category, but for brands.   Example: "Apple", "Nike", "Sony".
    name = models.CharField(max_length=100, unique=True)     # 📌 Database table → Brand with one column: name.

    def __str__(self):
        return self.name

class Product(models.Model):                                    # name = models.CharField(max_length=100) , Product name (e.g., "iPhone 15").
    name = models.CharField(max_length=200)                     # price = models.DecimalField(max_digits=10, decimal_places=2) , Stores money values. , max_digits=10 → max total digits (e.g., 99999999.99). , 
    price = models.DecimalField(max_digits=10, decimal_places=2)  # decimal_places=2 → two digits after decimal (e.g., 1000.50).
    description = models.TextField()                              # For long text (no max length). , Example: "This is the latest iPhone with A16 Bionic chip...".
    image = models.ImageField(upload_to='products/')              # image = models.ImageField(upload_to='products/') , For storing product images. , Uploaded files go to /media/products/.
    category = models.ForeignKey(Category, on_delete=models.CASCADE)    # category = models.ForeignKey(Category, on_delete=models.CASCADE)  , Creates a relationship → Each product belongs to one category.
                                                                        # Example: iPhone 15 → Category: Electronics. , on_delete=models.CASCADE → If a Category is deleted, all its products will also be deleted.
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)          # brand = models.ForeignKey(Brand, on_delete=models.CASCADE) ,. Each product belongs to one brand.   Example: iPhone 15 → Brand: Apple. , Same CASCADE behavior.
    created_at = models.DateTimeField(auto_now_add=True)                

    def __str__(self):                              # __str__(self) → Returns product name (e.g., "iPhone 15").
        return self.name


# 📌 Database table → Product with columns:

# id (auto-generated primary key)

# name

# price

# description

# image

# category_id (foreign key to Category)

# brand_id (foreign key to Brand)



# 🔹 Relationships Between Models

# One Category → Many Products
# Example:

# Category: "Electronics"

# Products: "iPhone 15", "Samsung TV", "PlayStation 5".

# One Brand → Many Products
# Example:

# Brand: "Apple"

# Products: "iPhone 15", "MacBook Pro", "AirPods".

# So Product is the child model (depends on Category & Brand).


# forms.py  
from django import forms
from .models import Product

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = '__all__' 



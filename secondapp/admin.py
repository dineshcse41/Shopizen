from django.contrib import admin
# Register your models here.


from django.contrib import admin
from .models import Category, Brand, Product

admin.site.register(Category)
admin.site.register(Brand)
admin.site.register(Product)

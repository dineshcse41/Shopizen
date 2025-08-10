from django.contrib import admin
from .models import Products,Order

@admin.register(Products)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'category', 'brand', )  # ✅ show in list    'created_at'
    list_filter = ('category', 'brand', )  # ✅ filter by date too        'created_at'
    search_fields = ('name', 'brand', 'category')  # ✅ search bar
    # ordering = ('-created_at',)  # ✅ newest first

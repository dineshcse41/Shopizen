from django.contrib import admin
from .models import Product, Review   # only product app models


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price", "category", "brand", "rating", "created_at")
    search_fields = ("name", "category__name", "brand__name")
    list_filter = ("category", "brand", "created_at")
    list_per_page = 20



@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "product", "rating", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = ("user__username", "product__name")

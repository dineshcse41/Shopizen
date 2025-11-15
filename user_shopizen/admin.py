from django.contrib import admin
from .models import (
    Category, Brand, Product,
    Cart, Order, OrderItem,
    Review, Wishlist, Offer
)

# ---------- Category ----------
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


# ---------- Brand ----------
@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


# ---------- Product ----------
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'category', 'brand', 'created_at')
    list_filter = ('category', 'brand')
    search_fields = ('name',)
    list_per_page = 20


# ---------- Cart ----------
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'quantity', 'added_date')
    search_fields = ('user__username', 'product__name')
    list_filter = ('added_date',)


# ---------- OrderItem Inline ----------
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


# ---------- Order ----------
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username',)
    inlines = [OrderItemInline]


# ---------- OrderItem ----------
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'product', 'quantity')
    search_fields = ('order__id', 'product__name')


# ---------- Review ----------
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__username', 'product__name')


# ---------- Wishlist ----------
@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'added_at')
    search_fields = ('user__username', 'product__name')


# ---------- Offer ----------
@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ('id', 'offer_type', 'product', 'category', 'discount_percent', 'start_date', 'end_date', 'is_active')
    list_filter = ('offer_type', 'start_date', 'end_date')
    search_fields = ('product__name', 'category__name')

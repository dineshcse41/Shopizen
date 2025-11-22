from django.contrib import admin
from .models import (
    Category, Brand, Product,
    CartItem, Order, OrderItem,
    Review, Wishlist, Offer,
    Refund, Notification,
    Wallet, WalletTransaction,
    ContactMessage, Address
)
from django.contrib.auth import get_user_model
User = get_user_model()


# -------------------------
# CATEGORY
# -------------------------
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


# -------------------------
# BRAND
# -------------------------
@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


# -------------------------
# PRODUCT
# -------------------------
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price", "category", "brand", "created_at")
    list_filter = ("category", "brand")
    search_fields = ("name", "category__name", "brand__name")
    autocomplete_fields = ("category", "brand")


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "product", "selected_size", "price", "quantity", "created_at")
    autocomplete_fields = ("user", "product")
    list_filter = ("created_at",)



# -------------------------
# WISHLIST
# -------------------------


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "product", "created_at")
    autocomplete_fields = ("user", "product")




# -------------------------
# ORDER & ORDER ITEMS
# -------------------------
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['id', 'user__email', 'user__first_name', 'user__last_name']


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "product", "quantity", "price")
    autocomplete_fields = ("order", "product")


# -------------------------
# REVIEW
# -------------------------
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "product", "user", "stars", "created_at")
    list_filter = ("stars", "created_at")
    search_fields = ("product__name", "user__email", "name", "text")



# -------------------------
# OFFER
# -------------------------
@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ("id", "offer_type", "product", "category",
                    "discount_percent", "start_date", "end_date")
    list_filter = ("offer_type", "start_date", "end_date")
    autocomplete_fields = ("product", "category")


# # -------------------------
# # REFUND
# # -------------------------
# @admin.register(Refund)
# class RefundAdmin(admin.ModelAdmin):
#     list_display = ("id", "order", "user", "status", "created_at")
#     list_filter = ("status",)
#     autocomplete_fields = ("order", "user")


# -------------------------
# NOTIFICATION
# -------------------------
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "type", "status", "created_at")
    list_filter = ("type", "status")
    search_fields = ("user__username", "message")


# -------------------------
# WALLET
# -------------------------
@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "balance")
    autocomplete_fields = ("user",)
    search_fields = ("user__username",)


@admin.register(WalletTransaction)
class WalletTransactionAdmin(admin.ModelAdmin):
    list_display = ("id", "wallet", "transaction_type",
                    "amount", "description", "created_at")
    list_filter = ("transaction_type",)
    autocomplete_fields = ("wallet",)


# -------------------------
# CONTACT MESSAGE
# -------------------------
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "subject", "status", "created_at", "replied_at")
    list_filter = ("status",)
    search_fields = ("user__username", "subject")
    autocomplete_fields = ("user",)


# -------------------------
# ADDRESS
# -------------------------
@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "full_name", "city", "state", "pincode", "is_default")
    search_fields = ("full_name", "city", "state", "pincode")
    autocomplete_fields = ("user",)

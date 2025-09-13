from django.contrib import admin
from .models import Cart

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):          # @admin.register(Cart) → registers the Cart model with the Django admin site., CartAdmin → custom admin configuration class for the Cart model.

    list_display = ("id", "user", "product", "quantity", "added_date")
    list_filter = ("user", "added_date")
    search_fields = ("user__username", "product__name")

# list_display = ("id", "user", "product", "quantity", "added_date")
# Defines the columns shown in the Cart list page inside the admin panel.

# Example view in admin list page:

# ID	User	Product	Quantity	Added Date
# 1	john	iPhone 14	2	2025-09-13

# python
# Copy code
# list_filter = ("user", "added_date")
# Adds sidebar filters in admin panel for:

# user (filter cart items by user)

# added_date (filter cart items by date)

# python
# Copy code
# search_fields = ("user__username", "product__name")
# Adds a search box in admin panel.

# You can search cart items by:

# username of the user → e.g., typing "john" finds John’s cart items.

# name of the product → e.g., typing "iPhone" finds all cart entries with iPhone.

# 🔄 Why this is useful
# Makes admin panel much easier to manage.

# Instead of scrolling through all cart items, you can search and filter quickly.

# Helps in debugging when multiple users are using carts.
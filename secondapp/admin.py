


from django.contrib import admin   
from .models import Category, Brand, Product        # You are importing the Category, Brand, and Product models from the current app.
                                                    # These are the models you want to manage via the Django admin.

admin.site.register(Category)
admin.site.register(Brand)
admin.site.register(Product)

# admin.site.register(ModelName) → Tells Django that this model should be visible in the Django Admin Dashboard.

# Once registered, you can:

# Add new records (e.g., new categories, brands, products)

# Edit existing ones

# Delete them

# Search and filter

# THIS IS ADMIN (from django.contrib import admin)
# This line imports the Order model from the cart app.

# However, in this file, it’s not being used.

# Likely you were planning to register Order in the Django admin as well, but forgot (or left it for later).

# If you wanted it in the admin, you’d add:

# 🔑 Logic in Simple Terms

# This file (admin.py) configures which models are visible/manageable in the Django Admin.

# Right now:

# ✅ Category, Brand, and Product are registered.

# ❌ Order was imported but not yet registered.


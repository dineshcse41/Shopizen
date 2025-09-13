from django.db import models
from secondapp.models import Category, Brand   # ✅ linked to secondapp

class Product(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField()
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE,
        related_name="products", null=True, blank=True
    )
    brand = models.ForeignKey(
        Brand, on_delete=models.CASCADE,
        related_name="products", null=True, blank=True
    )
    price = models.DecimalField(max_digits=10, decimal_places=2, db_index=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):      # String representation → shows product name in Django Admin & shell.
        return self.name
    
# How It Connects to Other Apps

# Cart → Cart.product = ForeignKey(Product)

# Lets users add specific products to their cart.

# OrderItem → OrderItem.product = ForeignKey(Product)

# Lets users purchase specific products in orders.

# Category & Brand →

# category.products.all() → all products in a category.

# brand.products.all() → all products of a brand.

# ✅ Why This Design Works Well

# Normalized: product linked cleanly to Category and Brand.

# Indexed fields (name, price, rating) → fast filtering & searching.

# Flexible: optional category/brand for generic products.

# Extendable: easy to add fields later (stock, discount, image, etc.).

#------------------------------------------------------------------------------9th week task------------------------------------

# product_api/models.py
from django.conf import settings
from django.db import models
from .models import Product

class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user", "product")
    
    def __str__(self):
        return f"{self.user} - {self.product}"    

# What it does:

# Links a user to a product they like but haven’t purchased yet.

# unique_together = ("user", "product") → prevents duplicate wishlist entries.

# Example: User can’t add iPhone 14 to their wishlist twice.

# __str__ → makes Django Admin display entries like:

# johndoe - iPhone 14


# ➡️ Use Case in API

# GET /api/wishlist/ → see wishlist items.

# POST /api/wishlist/ → add new item.    
# reviews

# product_api/models.py
class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    rating = models.IntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "product")

# What it does:

# Stores user reviews for products.

# related_name="reviews" → lets you do:

# product = Product.objects.get(id=1)
# product.reviews.all()   # all reviews for this product


# unique_together = ("user", "product") → ensures a user can only leave one review per product (prevents spam).

# created_at auto timestamps reviews.

# ➡️ Validation in Serializer
# You already added a check to ensure:

# Only users who purchased the product (via OrderItem) can leave a review.

# After saving, it recalculates the product’s average rating.

# 🔹 Workflow Together

# Wishlist → save products users want later.

# Review → ensure only verified buyers leave reviews.

# Product → stores aggregated rating (rating field auto-updated when reviews are created).

# Example:

# User adds MacBook Pro to wishlist.

# Later buys it → now eligible to leave a review.

# Leaves review → updates product.rating automatically.


# -----------------------------------------------------------10th week task ----------------------------------------------------------------------------------------


from django.db import models
from django.utils import timezone

# Avoid direct import issues by using the app label + model name string for FK,
# or import your Product model if you prefer: from product_api.models import Product

class Offer(models.Model):
    # use string reference to avoid circular import problems
    product = models.ForeignKey(
        "product_api.Product", on_delete=models.CASCADE,
        null=True, blank=True, related_name="offers"
    )
    category = models.CharField(max_length=100, null=True, blank=True)
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2)
    active = models.BooleanField(default=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        target = self.product if self.product_id else self.category or "All products"
        return f"{self.discount_percent}% off → {target}"

    class Meta:
        indexes = [
            models.Index(fields=["active", "start_date", "end_date"]),
        ]

    def is_current(self):
        now = timezone.now()
        if not self.active:
            return False
        if self.start_date and now < self.start_date:
            return False
        if self.end_date and now > self.end_date:
            return False
        return True


# Logic and Purpose

# Targeting

# product → Apply offer to a specific product.

# category → Apply offer to a whole category of products (e.g., "Mobiles").

# Both are optional → if neither is set, the offer could be applied to all products (your __str__ already handles this nicely).

# Discount Handling

# discount_percent → stored as a DecimalField, so you can support values like 10.00 or 12.50.

# Applied when calculating final price:

# discounted_price = product.price * (1 - (offer.discount_percent / 100))


# Scheduling

# start_date / end_date → define when an offer is valid.

# active → quick toggle for enabling/disabling without deleting.

# Indexing

# indexes = [models.Index(...)] → optimizes queries that check:

# Is the offer active?

# Does current date fall within start/end range?

# Helper Method

# def is_current(self):
#     now = timezone.now()
#     if not self.active:
#         return False
#     if self.start_date and now < self.start_date:
#         return False
#     if self.end_date and now > self.end_date:
#         return False
#     return True


# Clean reusable check for whether an offer is valid at this moment.

# Prevents duplicate filtering logic in views/serializers.

# Real-world Flow

# Admin creates an Offer → “10% off on Mobiles (valid till 30 Sep)”.

# Customer browses → product serializer applies get_final_price.

# Checkout → discount applied automatically if offer is valid.
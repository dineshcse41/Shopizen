# cart/models.py
from django.db import models
from django.conf import settings
from product_api.models import Product  # adjust import to your app # correct import

class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE) # settings.AUTH_USER_MODEL → makes it flexible (works with custom User models)., on_delete=models.CASCADE → if the user is deleted, their cart items are also removed.
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="cart_items")  # make sure it points to product_api.Product
    # If a product is deleted → all cart items referencing it are also deleted.
    # related_name="cart_items" → lets you do product.cart_items.all() to fetch all carts that contain that product. 
    quantity = models.PositiveIntegerField(default=1)
    # PositiveIntegerField → prevents negative values.
    # default=1 → when user adds to cart, it starts with one item.
    added_date = models.DateTimeField(auto_now_add=True)
    # Auto-stores the timestamp when the product was added to the cart.
    # Useful for tracking cart history or clearing old carts.

    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.quantity})"

    # String representation (for admin panel / debugging).
    # Example: john_doe - iPhone 14 (2).
    
    # cart/models.py
from django.db import models
from django.conf import settings
from product_api.models import Product

class CartItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} x {self.quantity} ({self.user.username})"

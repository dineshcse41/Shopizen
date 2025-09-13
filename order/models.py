# order/models.py
from django.db import models
from django.conf import settings
from product_api.models import Product


class Order(models.Model):      # status defines the current state of the order:
    STATUS_CHOICES = (
        ("Pending", "Pending"),     # Pending → Just placed, awaiting confirmation/payment.
        ("Confirmed", "Confirmed"), # Confirmed → Payment done, order accepted.
        ("Delivered", "Delivered"), # Delivered → Order fulfilled.
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Each order belongs to a single user., If user is deleted → all their orders are also deleted.
    products = models.ManyToManyField(Product, through="OrderItem")

    # An order can contain many products, and a product can belong to many orders.
    # The through="OrderItem" ensures you can store extra info (like quantity) in the OrderItem table.
    # This avoids a simple many-to-many and gives you more flexibility.

    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    #     Stores the final cost of the order.
    # DecimalField (not float) → avoids rounding errors with money.
    # max_digits=10, decimal_places=2 → supports values like 99999999.99.
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    # Restricts order status to only allowed choices.
    # Defaults to "Pending" when order is first created.
    
    created_at = models.DateTimeField(auto_now_add=True)    # Timestamp when the order was placed., Automatically set by Django.

    def __str__(self):                                      # Nice human-readable representation in Django admin and shell.
        return f"Order {self.id} - {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):      # Makes it easy to read in Django admin:    Example → "iPhone 14 x 2".
        return f"{self.product.name} x {self.quantity}"     

# order → each item belongs to a specific order.

# related_name="items" → allows reverse access: order.items.all().

# product → the product being purchased.

# quantity → number of units of that product.

# 🔄 How It All Works Together

# Order = high-level record of a purchase.

# OrderItem = detailed line items (product + quantity).

# 👉 Example:

# User john places an order with:

# 2 × iPhone 14

# 1 × AirPods Pro

# Database:

# Order table:

# id: 12, user: john, total_price: 3500.00, status: Pending


# OrderItem table:

# order: 12, product: iPhone 14, quantity: 2
# order: 12, product: AirPods Pro, quantity: 1

# ✅ Why This Design is Solid

# Scalable: supports multiple products per order.

# Normalized: avoids duplicate data, keeps relationships clean.

# Flexible: OrderItem lets you track per-product quantities.

# Extendable: you can add fields later (e.g., shipping_address, payment_id, discounts, etc.).
# user/models.py
from django.db import models
from django.conf import settings

class Review(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_reviews'
    )
    product = models.ForeignKey(
        'product_api.Product',  # reference the app where Product actually exists
        on_delete=models.CASCADE
    )
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)

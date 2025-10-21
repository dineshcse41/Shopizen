from django.db import models, transaction
from django.conf import settings
from product_api.models import Product  # adjust app name

User = settings.AUTH_USER_MODEL


# ---------------------- Wishlist ----------------------

class Wishlist(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="wishlists"
    )
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="wishlist_products"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "product")
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} → {self.product}"


# ---------------------- Notifications ----------------------

class Notification(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="admin_notifications"
    )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.user}"


# ---------------------- Wallet & Transactions ----------------------

class Wallet(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="wallet"
    )
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Wallet(user={self.user_id}, balance={self.balance})"


class WalletTransaction(models.Model):
    CREDIT = 'CR'
    DEBIT = 'DB'
    TXN_TYPE_CHOICES = [
        (CREDIT, 'Credit'),
        (DEBIT, 'Debit'),
    ]

    wallet = models.ForeignKey(
        Wallet, on_delete=models.CASCADE, related_name="transactions"
    )
    txn_type = models.CharField(max_length=2, choices=TXN_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"WalletTransaction(wallet={self.wallet_id}, type={self.txn_type}, amount={self.amount})"

    @classmethod
    def create_credit(cls, wallet, amount, description=''):
        if amount <= 0:
            raise ValueError('Amount must be positive')
        with transaction.atomic():
            w = Wallet.objects.select_for_update().get(pk=wallet.pk)
            w.balance = w.balance + amount
            w.save(update_fields=['balance', 'updated_at'])
            txn = cls.objects.create(
                wallet=w, txn_type=cls.CREDIT, amount=amount, description=description
            )
        return txn

    @classmethod
    def create_debit(cls, wallet, amount, description=''):
        if amount <= 0:
            raise ValueError('Amount must be positive')
        with transaction.atomic():
            w = Wallet.objects.select_for_update().get(pk=wallet.pk)
            if w.balance < amount:
                raise ValueError('Insufficient balance')
            w.balance = w.balance - amount
            w.save(update_fields=['balance', 'updated_at'])
            txn = cls.objects.create(
                wallet=w, txn_type=cls.DEBIT, amount=amount, description=description
            )
        return txn

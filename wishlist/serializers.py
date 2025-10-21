from rest_framework import serializers
from .models import Wishlist, Wallet, WalletTransaction, Notification
from django.db import transaction


class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['balance', 'updated_at']


class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = ['id', 'txn_type', 'amount', 'description', 'created_at']
        read_only_fields = ['id', 'txn_type', 'created_at']


class AddCreditSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    description = serializers.CharField(max_length=255, allow_blank=True, required=False)

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Amount must be greater than zero')
        return value

    def save(self, user):
        from .models import WalletTransaction, Wallet
        amount = self.validated_data['amount']
        description = self.validated_data.get('description', '')
        wallet, _ = Wallet.objects.get_or_create(user=user)
        txn = WalletTransaction.create_credit(wallet, amount, description)
        return txn


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
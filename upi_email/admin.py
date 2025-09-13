from django.contrib import admin
from .models import Payment, Notification, UpiPayment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "order",
        "provider",
        "amount",
        "currency",
        "status",
        "created_at",
        "updated_at",
    )
    list_filter = ("provider", "status", "currency", "created_at")
    search_fields = ("id", "gateway_order_id", "gateway_payment_id", "user__username")
    ordering = ("-created_at",)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "type", "status", "message", "created_at")
    list_filter = ("type", "status", "created_at")
    search_fields = ("message", "user__username")
    ordering = ("-created_at",)


@admin.register(UpiPayment)
class UpiPaymentAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "transaction_id", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("transaction_id", "order__id")
    ordering = ("-created_at",)

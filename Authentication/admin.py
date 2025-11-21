from django.contrib import admin
from .models import UserProfile, AdminUser
from django.contrib.auth import get_user_model
User = get_user_model()

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    search_fields = ['email', 'first_name', 'last_name', 'phone_number']

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'full_name', 'phone_number')
    search_fields = ('user__username', 'full_name', 'phone_number')
    list_filter = ('user__is_active',)

 

from django.contrib import admin
from .models import UserProfile, AdminUser  # <- same here

@admin.register(AdminUser)
class AdminUserAdmin(admin.ModelAdmin):
    list_display = (
        "id", "first_name", "last_name", "designation",
        "department", "employeeId", "email", "is_staff"
    )
    search_fields = (
        "first_name", "last_name", "designation",
        "department", "employeeId", "email"
    )
    list_filter = ("department", "is_staff", "is_active")


from django.contrib import admin
from .models import UserProfile, AdminProfile
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


@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'full_name', 'designation', 
        'department', 'employee_id', 'user'
    )
    search_fields = (
        'full_name', 'designation', 
        'department', 'employee_id', 'user__username'
    )
    list_filter = ('department',)

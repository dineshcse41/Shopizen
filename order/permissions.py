from rest_framework import permissions

class IsAdminUserRole(permissions.BasePermission):
    """
    Custom permission to only allow staff (admin) users.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

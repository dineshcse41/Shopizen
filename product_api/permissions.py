from rest_framework import permissions

class IsAdminUserRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

# Checks if the user is authenticated (request.user exists).

# Grants access only if user.is_staff == True.

# Blocks all non-staff users.

# This is essentially the same as DRF’s built-in IsAdminUser.
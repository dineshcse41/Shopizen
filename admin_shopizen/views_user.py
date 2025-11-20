from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdminUser
from rest_framework.serializers import ModelSerializer

User = get_user_model()


# -------------------------
# SERIALIZER
# -------------------------
class AdminUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'is_active', 'is_staff']


# -------------------------
# LIST ALL USERS
# -------------------------
class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-id')
    serializer_class = AdminUserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


# -------------------------
# BLOCK USER
# -------------------------
class AdminUserBlockView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response({'message': f'User {user.email} blocked'}, status=status.HTTP_200_OK)


# -------------------------
# UNBLOCK USER
# -------------------------
class AdminUserUnblockView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response({'message': f'User {user.email} unblocked'}, status=status.HTTP_200_OK)


# -------------------------
# DELETE USER
# -------------------------
class AdminUserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'

    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        email = user.email
        user.delete()
        return Response({'message': f'User {email} deleted successfully.'})

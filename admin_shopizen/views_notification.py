# task 12
from rest_framework import generics
from user_shopizen.models import Notification
from user_shopizen.serializers import NotificationSerializer
from .permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated


class AdminNotificationListCreateView(generics.ListCreateAPIView):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminNotificationDeleteView(generics.DestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'

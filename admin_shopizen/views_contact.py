from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from user_shopizen.models import ContactMessage
from user_shopizen.serializers import ContactMessageSerializer
from rest_framework.permissions import IsAdminUser
from django.utils import timezone

# 1️⃣ Get All Messages (Inbox)
class AdminInboxView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        messages = ContactMessage.objects.all().order_by('-created_at')
        serializer = ContactMessageSerializer(messages, many=True)
        return Response(serializer.data)


# 2️⃣ Reply to a Message
class AdminReplyView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, id):
        try:
            message = ContactMessage.objects.get(id=id)
        except ContactMessage.DoesNotExist:
            return Response({'error': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)

        reply = request.data.get('reply')
        if not reply:
            return Response({'error': 'Reply content required'}, status=status.HTTP_400_BAD_REQUEST)

        message.admin_reply = reply
        message.status = 'Replied'
        message.replied_at = timezone.now()
        message.save()

        return Response({'message': 'Reply sent successfully'})

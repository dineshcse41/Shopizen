# task 12
from rest_framework import generics, status
from rest_framework.response import Response
from user_shopizen.models import Refund
from user_shopizen.serializers import RefundSerializer
from .permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated


class AdminRefundListView(generics.ListAPIView):
    queryset = Refund.objects.select_related('user', 'order')
    serializer_class = RefundSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminRefundApproveView(generics.UpdateAPIView):
    queryset = Refund.objects.all()
    serializer_class = RefundSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'

    def patch(self, request, *args, **kwargs):
        refund = self.get_object()
        refund.status = 'Approved'
        refund.save()
        return Response({'message': 'Refund approved'}, status=status.HTTP_200_OK)


class AdminRefundRejectView(AdminRefundApproveView):
    def patch(self, request, *args, **kwargs):
        refund = self.get_object()
        refund.status = 'Rejected'
        refund.save()
        return Response({'message': 'Refund rejected'}, status=status.HTTP_200_OK)

class AdminRefundStatusUpdateView(generics.UpdateAPIView):
    queryset = Refund.objects.all()
    serializer_class = RefundSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        refund = self.get_object()
        new_status = request.data.get('status')

        if new_status not in ['Approved', 'Rejected']:
            return Response({'error': 'Invalid refund status.'}, status=status.HTTP_400_BAD_REQUEST)

        refund.status = new_status
        refund.save()
        return Response({'message': f'Refund {new_status} successfully.'})
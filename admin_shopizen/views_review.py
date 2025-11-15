# task 12
from rest_framework import generics, status
from rest_framework.response import Response
from user_shopizen.models import Review
from user_shopizen.serializers import ReviewSerializer
from .permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated


class AdminReviewListView(generics.ListAPIView):
    queryset = Review.objects.select_related('user', 'product')
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminReviewApproveView(generics.UpdateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'

    def patch(self, request, *args, **kwargs):
        review = self.get_object()
        review.approved = True
        review.save()
        return Response({'message': 'Review approved'}, status=status.HTTP_200_OK)


class AdminReviewDeleteView(generics.DestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'


class AdminReviewStatusUpdateView(generics.UpdateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        review = self.get_object()
        new_status = request.data.get('status')

        if new_status not in ['Approved', 'Rejected']:
            return Response({'error': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)

        review.status = new_status
        review.save()
        return Response({'message': f'Review {new_status} successfully.'})
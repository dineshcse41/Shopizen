from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model  # ✅ Correct import

from .serializers import UserSerializer, ReviewSerializer
from .models import Review

# Get the custom User model
User = get_user_model()

# List all users
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Block a user
@api_view(['PATCH'])
def block_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
        user.is_active = False
        user.save()
        return Response({'status': 'user blocked'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

# Unblock a user
@api_view(['PATCH'])
def unblock_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
        user.is_active = True
        user.save()
        return Response({'status': 'user unblocked'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

# List all reviews
class ReviewListView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

# Approve a review
@api_view(['PATCH'])
def approve_review(request, pk):
    try:
        review = Review.objects.get(pk=pk)
        review.is_approved = True
        review.save()
        return Response({'status': 'review approved'})
    except Review.DoesNotExist:
        return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)


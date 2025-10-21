from django.urls import path
from .views import (
    UserListView, block_user, unblock_user,
    ReviewListView, approve_review
)

urlpatterns = [
    path('list/', UserListView.as_view(), name='user-list'),
    path('<int:pk>/block/', block_user, name='block-user'),
    path('<int:pk>/unblock/', unblock_user, name='unblock-user'),
    path('reviews/', ReviewListView.as_view(), name='review-list'),
    path('reviews/<int:pk>/approve/', approve_review, name='approve-review'),
]

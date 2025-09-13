# cart/views.py
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Cart
from .serializers import CartSerializer

class CartListCreateView(generics.ListCreateAPIView):         #  👉 It gives you GET (list all items in the cart) and POST (add new cart item).
    serializer_class = CartSerializer                          # 👉 Ensures that request/response data uses the CartSerializer for validation & representation.
    permission_classes = [permissions.IsAuthenticated]         # Only logged-in users can interact with the cart API.

    def get_queryset(self):                                    # 👉 Limits the cart items shown/handled to the current user only (security).
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):                       # Automatically assigns the current user to the new cart item instead of expecting the user field in the request body.
        serializer.save(user=self.request.user)                 #(Prevents users from adding items to someone else’s cart.)



class CartDeleteView(generics.DestroyAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)


#  CartDeleteView

# Base class: generics.DestroyAPIView
# 👉 Provides a DELETE method (remove a specific cart item).

# serializer_class: CartSerializer
# 👉 Ensures consistency in data representation.

# permission_classes = [IsAuthenticated]
# 👉 Only logged-in users can delete items.

# get_queryset():

# def get_queryset(self):
#     return Cart.objects.filter(user=self.request.user)


# 👉 A user can only delete their own cart items (not others').
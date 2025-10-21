from rest_framework.views import APIView            # APIView → Base class in DRF for creating APIs (instead of Django views).
from rest_framework.response import Response        # Response → Used to return structured HTTP responses.
from .models import User                            # User → A custom user model (or could be Django’s user model if extended).
from django.contrib.auth import authenticate        # authenticate → Django helper to verify username & password.
from .serializers import *                          # serializers → For converting models to JSON / validating request data (though here it’s not fully used).

class UserView(APIView):
    
    def post(self, request):        # request.data → fetches input sent in POST request (usually JSON).
        
        new_user = User(username = request.data['username'], is_superuser = request.data['is_superuser'])  # Creates a new User object with username and is_superuser.
        
        new_user.set_password(request.data['password'])     # Calls set_password() instead of directly assigning password (important because it hashes the password instead of storing plain text).
        
        new_user.save()         # Saves user in DB.
        
        return Response("New User Created")     # Returns confirmation message.
    
    
# EXAMPLE FOR ABOUT CODE
#  
# POST /api/user/
# {
#   "username": "chandra",
#   "password": "mypassword123",
#   "is_superuser": false
# }

class UserLoginView(APIView):       # Takes username and password from request.
    
    def post(self, request):        # Uses authenticate():
        
        user_verificatrion = authenticate(username = request.data['username'], password = request.data['password'])
        
        if user_verificatrion == None:          # If credentials are correct → returns the User object. , If incorrect → returns None.
        
            return Response("User name and password is invalid. Try again!")        
        else:
             return Response("Login successfully")              #   If authentication fails → return error message.
                                                                #   If successful → return "Login successfully".
        user_data = CustomToken_Serializer(data = request.data) 
        
# ⚠️ Note:

# The line user_data = CustomToken_Serializer(data = request.data) will never run, because function already returns before it.

# Maybe the developer intended to generate a JWT token or custom token, but misplaced the code.
        
        
        
        # if user_data.is_valid():
            
        #     return Response(user_data.validated_data)
        
        # else:
            
        #     return Response(user_data.errors)
        
    # def post(self, request):
        
    #     user_password = CustomToken_Serializer(user_password = request.data)
        
    #     if user_password.is_valid():
            
    #         return Response(user_password.validated_data)
        
    #     else:
            
    #         return Response(user_password.errors)
        
        
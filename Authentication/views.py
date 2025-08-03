from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User
from django.contrib.auth import authenticate
from .serializers import *

class UserView(APIView):
    
    def post(self, request):
        
        new_user = User(username = request.data['username'], is_superuser = request.data['is_superuser'])
        
        new_user.set_password(request.data['password'])
        
        new_user.save()
        
        return Response("New User Created")
    
class UserLoginView(APIView):
    
    def post(self, request):
        
        user_verificatrion = authenticate(username = request.data['username'], password = request.data['password'])
        
        if user_verificatrion == None:
        
            return Response("User name and password is invalid. Try again!")
        else:
             return Response("Login successfully")
        
        user_data = CustomToken_Serializer(data = request.data)
        
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
        
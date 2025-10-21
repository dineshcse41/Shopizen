from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    
    phone_number = models.CharField(max_length=10),
    

# 🔹 Why do this?

# If you need extra user information (phone number, address, profile picture, etc.), you extend AbstractUser.

# Then in settings.py, tell Django to use your custom user model:


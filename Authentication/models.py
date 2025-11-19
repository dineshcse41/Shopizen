from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=20)

    def __str__(self):
        return self.user.username

from django.db import models
from django.contrib.auth.models import User
import random

class MobileOTP(models.Model):
    phone_number = models.CharField(max_length=20)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.phone_number} - {self.otp}"

#----------------------------------------------------(admin)------------------------------------------------------------
from django.db import models
from django.contrib.auth.models import User

class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=150)
    designation = models.CharField(max_length=150)
    department = models.CharField(max_length=150)
    employee_id = models.CharField(max_length=50, unique=True)
    security_code = models.CharField(max_length=50)

    def __str__(self):
        return self.full_name



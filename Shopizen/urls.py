"""
URL configuration for Shopizen project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static  # ✅ This line is required

urlpatterns = [
    path('admin/', admin.site.urls),
    path('secondapp/', include('secondapp.urls')),
    path('library/', include('Library.urls')),
    path('auth/', include('Authentication.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('product/', include('product_api.urls')),   
    path('cart/', include('cart.urls')),   
    path('order/', include('order.urls')),   
    path('upi/', include('upi_email.urls')),   
    path('wishlist/', include('wishlist.urls')),   
    path('user/', include('user.urls')),   
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from rest_framework.routers import DefaultRouter
from .views import BookView

library_router = DefaultRouter()
library_router.register(r'book',BookView)
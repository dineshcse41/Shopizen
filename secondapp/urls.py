# from django.urls import path
# from .views import *

# urlpatterns = [
#     path('details/', secondapp.as_view()),
#     path('details/<int:customer_id>/', secondapp.as_view()),

#     path('task/', TaskView.as_view()),
#     path('task/<int:task_id>/', TaskView.as_view()),
    
#     path('task/list/create/', task_list_create),
#     path('task/update/delete/<int:id>/', task_update_delete),
# 


from django.urls import path
from .views import ProtectedView, RegisterView 
from . import views
from .views import add_product

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('protected/', ProtectedView.as_view(), name='protected'),
    path('add/', add_product, name='add_product'),
    path('success/', views.product_success, name='product_success'),
]

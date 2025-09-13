# from rest_framework.views import APIView
# from rest_framework.response import Response
# from .models import shoping, Task
# from .serializers import Task_serializers
# from rest_framework.decorators import api_view
# from rest_framework.permissions import IsAuthenticated
# from rest_framework import status
# from decouple import config

 
# class secondapp(APIView):
    
#     # parser_classes = [IsAuthenticated]
    
#     def get(self, requst):
        
#         all_customers = shoping.objects.all()
        
#         customers_list =[]
        
#         for s in all_customers:
            
#             customer_dict = {
#                 "id": s.id,
#                 "name": s.name,
#                 "age": s.age
#             }
                
#             customers_list.append(customer_dict)
        
#         return Response(customers_list)
    
#     def post(self, request):
        
#         # Correct: use your MODEL, not your VIEW
#         new_customer = shoping(name=request.data['name'], age=request.data['age'])
#         new_customer.save()
        
#         return Response("New customer created successfully")

#     def patch(self, request, customer_id):
        
        
#         customer_data = shoping.objects.filter(id = customer_id)
        
#         print(request.data)
        
#         customer_data.update(name=request.data['name'], age=request.data['age'])
        
#         return Response("Customer Data updated")
    
    
#     def delete(self, request, customer_id):
        
        
#         customer_data = shoping.objects.filter(id = customer_id)
        
#         customer_data.delete()
        
#         return Response("Customer Data Deleted")
    
    
# class TaskView(APIView):
    
    
#     def get(self, request, task_id=None):
        
#         if task_id == None:
            
#             person_name = config('name')
            
#             print(person_name)
        
#             all_task = Task.objects.all()
        
#             task_data = Task_serializers(all_task, many=True).data
        
#             return Response(task_data)

#         else:
#              task = Task.objects.get(id = task_id)
        
#              task_data = Task_serializers(task).data
        
#              return Response (task_data)
    
#     def post(self, request):
        
#         new_task = Task_serializers(data=request.data)
        
#         if new_task.is_valid():
            
#             new_task.save()
            
#             return Response("New Task Added")
        
#         else:
            
#             return Response(new_task.errors)
        
#     def patch(self, request, task_id):
        
#         task = Task.objects.get(id = task_id)
        
#         update_task = Task_serializers(task, data=request.data, partial=True)
        
#         if update_task.is_valid():
            
#             update_task.save()
             
#             return Response("Task updated")
        
#         else:

#             return Response(update_task.errors)
         
         
#     def put(self, request, task_id):
        
#         task = Task.objects.get(id = task_id)
        
#         update_task = Task_serializers(task, data=request.data, partial=True)
        
#         if update_task.is_valid():
            
#             update_task.save()
             
#             return Response("Task updated")
        
#         else:

#              return Response(update_task.errors)
        
        
        
#     def delete(self, request, task_id):
    
#         task = Task.objects.get(id = task_id)
        
#         task.delete()
        
#         return Response ("Task deleted")
        
# @api_view(['GET', 'POST'])
# def task_list_create(request):
    
#     if request.method == 'GET':
        
#         all_task = Task.objects.all()
        
#         task_data = Task_serializers(all_task, many=True).data
        
#         return Response(task_data)
    
#     elif request.method =='POST':
#         new_task = Task_serializers(data=request.data)
        
#         if new_task.is_valid():
            
#             new_task.save()
            
#             return Response("New Task Added")
        
#         else:
            
#             return Response(new_task.errors)


# @api_view(['GET','PATCH', 'PUT', 'DELETE'])   
# def task_update_delete(request, id):
    
#     task = Task.objects.get(id = id)
    
#     if request.method == 'GET':
        
#         task_data = Task_serializers(task).data
        
#         return Response(task_data)
    
#     elif request.method == 'PATCH':
#         update_task = Task_serializers(task, data=request.data, partial=True)
        
#         if update_task.is_valid():
            
#             update_task.save()
             
#             return Response("Task updated")
        
#         else:

#             return Response(update_task.errors)
        
#     elif request.method == 'PUT':
#         update_task = Task_serializers(task, data=request.data, partial=True)
        
#         if update_task.is_valid():
            
#             update_task.save()
             
#             return Response("Task updated")
        
#         else:

#             return Response(update_task.errors)
        
#     elif request.method == 'DELETE': 
#         task.delete()
        
#         return Response ("Task deleted")
    
# secondapp/views.py
from rest_framework.views import APIView                   # APIView → Base class from DRF to create custom API endpoints.
from rest_framework.response import Response               # Response → Used to send JSON responses.          
from rest_framework import status                          # status → Provides HTTP status codes (201 Created, 400 Bad Request, etc).
from .serializers import RegisterSerializer                # RegisterSerializer → A serializer (not shown here) that handles validation & saving a new User.
from rest_framework.permissions import IsAuthenticated     # IsAuthenticated → DRF permission that restricts access to logged-in users only.
from django.shortcuts import render, redirect
from .forms import ProductForm

class RegisterView(APIView):                            # When someone sends a POST request (e.g., via Postman or frontend) with registration data (username, email, password, etc.), the serializer validates it.
    def post(self, request):                            # If valid → serializer.save() creates a new User object in the DB.
        serializer = RegisterSerializer(data=request.data)   # Returns 201 (Created) with success message.
        if serializer.is_valid():                           # If invalid → returns validation errors with 400 (Bad Request).
            user = serializer.save()  # <- returns a User object
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ProtectedView(APIView):                   # permission_classes = [IsAuthenticated] → only logged-in users with a valid token/session can access.
    permission_classes = [IsAuthenticated]      # If a user makes a GET request and is authenticated → they get a personalized message.
                                                # If not logged in → DRF automatically denies with 401 Unauthorized.
    def get(self, request):
        return Response({
            'message': f'Hello, {request.user.username}! You have accessed a protected endpoint.'
        })




from django.shortcuts import render, redirect
from .models import Product, Category, Brand
from .forms import ProductForm

def add_product(request):
    if request.method == 'POST':                # Product, Category, Brand → database models.
        form = ProductForm(request.POST, request.FILES)         # ProductForm → Django form tied to Product model.
        if form.is_valid():
            form.save()
            return redirect('product_success')  # Your success page
    else:
        form = ProductForm()

    return render(request, 'add_product.html', {
        'form': form,
        'categories': Category.objects.all(),
        'brands': Brand.objects.all()
    })
    
# secondapp/views.py

from django.shortcuts import render, redirect
from .forms import ProductForm

def add_product(request):
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('product_success')  # Replace with your success route
    else:
        form = ProductForm()
    return render(request, 'add_product.html', {'form': form})

from django.shortcuts import render

# def add product LOGIC
# If user submits the form (POST request):

# Take submitted data + uploaded images (request.FILES).

# Validate form.

# If valid → save new product to DB and redirect to success page.
# If it's a GET request (user just opened the page) → show an empty form.

# Pass categories & brands to the template → so the form can show dropdowns.

def product_success(request):
    return render(request, 'product_success.html')

# After successfully adding a product, user is redirected here.

# Just renders a simple success message template.


# this code explanaton

# RegisterView → API to create new users (for authentication).

# ProtectedView → API endpoint only accessible if logged in.

# add_product → Webpage (form) to add new products to DB.

# product_success → Confirmation page after product is added.
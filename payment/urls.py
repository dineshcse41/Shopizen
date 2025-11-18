from django.urls import path
from payment.views import CreatePayment, VerifyPayment, CreateCOD

urlpatterns = [
    path("create/", CreatePayment.as_view()),
    path("verify/", VerifyPayment.as_view()),
    path("cod/", CreateCOD.as_view()),
]

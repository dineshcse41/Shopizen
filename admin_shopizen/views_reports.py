# task 12
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, F
from user_shopizen.models import Order, OrderItem, Product
from .permissions import IsAdminUser


class SalesReportView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        data = (
            Order.objects.values('status')
            .annotate(total_sales=Sum('total_price'), order_count=Count('id'))
            .order_by('status')
        )
        return Response(data)


class TopProductsReportView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        data = (
            OrderItem.objects.values(product_name=F('product__name'))
            .annotate(total_sold=Sum('quantity'))
            .order_by('-total_sold')[:10]
        )
        return Response(data)


class RevenueReportView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        total_revenue = Order.objects.filter(status='Delivered').aggregate(
            total_revenue=Sum('total_price')
        )
        return Response(total_revenue)


# admin_shopizen/views_reports.py
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdminUser
from user_shopizen.models import Order, Product, Category

class AdminSalesReportView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        # 1️⃣ Total Sales Summary
        total_sales = Order.objects.filter(status='Delivered').aggregate(
            total_revenue=Sum('total_price'),
            total_orders=Count('id')
        )

        # 2️⃣ Category-wise Sales
        category_sales = (
            Product.objects
            .filter(order__status='Delivered')
            .values('category__name')
            .annotate(total_sales=Sum('price'))
            .order_by('-total_sales')
        )

        # 3️⃣ Date-wise Sales (daily)
        date_sales = (
            Order.objects
            .filter(status='Delivered')
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(total_sales=Sum('total_price'))
            .order_by('date')
        )

        data = {
            "summary": {
                "total_revenue": total_sales['total_revenue'] or 0,
                "total_orders": total_sales['total_orders'] or 0,
            },
            "category_wise_sales": list(category_sales),
            "date_wise_sales": list(date_sales)
        }

        return Response(data)

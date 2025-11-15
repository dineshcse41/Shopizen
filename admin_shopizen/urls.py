from django.urls import path
from .views import (
    AdminProductListCreateView,
    AdminProductRetrieveUpdateDeleteView,
    AdminOrderStatusUpdateView,AdminOrderListView,AdminOrderDetailView
)
from .views_user import *
from .views_review import *
from .views_refund import *
from .views_notification import *
from .views_reports import *
from .views_category_brand import *
from .views_contact import *

urlpatterns = [
    # Product CRUD
    path('api/products/', AdminProductListCreateView.as_view(), name='admin-product-list-create'),
    path('api/products/<int:id>/', AdminProductRetrieveUpdateDeleteView.as_view(), name='admin-product-detail'),

    # Order status management
    path('api/orders/<int:id>/status/', AdminOrderStatusUpdateView.as_view(), name='admin-order-status-update'),
    path('api/admin/orders/', AdminOrderListView.as_view()),
    path('api/admin/orders/<int:id>/', AdminOrderDetailView.as_view()),
    
    # User Management
    path('api/admin/users/', AdminUserListView.as_view()),
    path('api/admin/users/<int:id>/block/', AdminUserBlockView.as_view()),
    path('api/admin/users/<int:id>/unblock/', AdminUserUnblockView.as_view()),
    path('api/admin/users/<int:id>/', AdminUserDeleteView.as_view()),
    path('api/admin/users/<int:id>/block/', AdminUserBlockUnblockView.as_view()),

    # Reviews
    path('api/admin/reviews/', AdminReviewListView.as_view()),
    path('api/admin/reviews/<int:id>/approve/', AdminReviewApproveView.as_view()),
    path('api/admin/reviews/<int:id>/', AdminReviewDeleteView.as_view()),
    path('api/admin/reviews/<int:id>/status/', AdminReviewStatusUpdateView.as_view()),

    # Refunds
    path('api/admin/refunds/', AdminRefundListView.as_view()),
    path('api/admin/refunds/<int:id>/approve/', AdminRefundApproveView.as_view()),
    path('api/admin/refunds/<int:id>/reject/', AdminRefundRejectView.as_view()),
    path('api/admin/refunds/<int:id>/status/', AdminRefundStatusUpdateView.as_view()),

    # Notifications
    path('api/admin/notifications/', AdminNotificationListCreateView.as_view()),
    path('api/admin/notifications/<int:id>/', AdminNotificationDeleteView.as_view()),

    # Reports
    path('api/admin/reports/sales/', SalesReportView.as_view()),
    path('api/admin/reports/top-products/', TopProductsReportView.as_view()),
    path('api/admin/reports/revenue/', RevenueReportView.as_view()),
    path('api/admin/sales-report/', AdminSalesReportView.as_view(), name='admin-sales-report'),
    
    # Category APIs
    path('api/admin/categories/', AdminCategoryListCreateView.as_view(), name='admin-category-list-create'),
    path('api/admin/categories/<int:id>/', AdminCategoryUpdateDeleteView.as_view(), name='admin-category-update-delete'),

    # Brand APIs
    path('api/admin/brands/', AdminBrandListCreateView.as_view(), name='admin-brand-list-create'),
    path('api/admin/brands/<int:id>/', AdminBrandUpdateDeleteView.as_view(), name='admin-brand-update-delete'),
    
    # contact
    path('api/admin/inbox/', AdminInboxView.as_view(), name='admin-inbox'),
    path('api/admin/reply/<int:id>/', AdminReplyView.as_view(), name='admin-reply'),
]

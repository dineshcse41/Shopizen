from django.urls import path

# Product
from .views import (
    AdminProductListCreateView,
    AdminProductRetrieveUpdateDeleteView,
    AdminOrderStatusUpdateView,
    AdminOrderListView,
    AdminOrderDetailView,
)

# User Management
from .views_user import (
    AdminUserListView,
    AdminUserBlockView,
    AdminUserUnblockView,
    AdminUserDeleteView,
)

# Reviews
from .views_review import (
    AdminReviewListView,
    AdminReviewApproveView,
    AdminReviewDeleteView,
    AdminReviewStatusUpdateView,
)

# Refunds
from .views_refund import (
    AdminRefundListView,
    AdminRefundApproveView,
    AdminRefundRejectView,
    AdminRefundStatusUpdateView,
)

# Notifications
from .views_notification import (
    AdminNotificationListCreateView,
    AdminNotificationDeleteView,
)

# Reports
from .views_reports import (
    SalesReportView,
    TopProductsReportView,
    RevenueReportView,
    AdminSalesReportView,
)

# Category & Brand
from .views_category_brand import (
    AdminCategoryListCreateView,
    AdminCategoryUpdateDeleteView,
    AdminBrandListCreateView,
    AdminBrandUpdateDeleteView,
)

# Contact
from .views_contact import (
    AdminInboxView,
    AdminReplyView,
)


urlpatterns = [
    # ============================
    # Product CRUD
    # ============================
    path('api/products/', AdminProductListCreateView.as_view()),
    path('api/products/<int:id>/', AdminProductRetrieveUpdateDeleteView.as_view()),

    # ============================
    # Orders
    # ============================
    path('api/orders/<int:id>/status/', AdminOrderStatusUpdateView.as_view()),
    path('api/admin/orders/', AdminOrderListView.as_view()),
    path('api/admin/orders/<int:id>/', AdminOrderDetailView.as_view()),

    # ============================
    # User Management
    # ============================
    path('api/admin/users/', AdminUserListView.as_view()),
    path('api/admin/users/<int:id>/block/', AdminUserBlockView.as_view()),
    path('api/admin/users/<int:id>/unblock/', AdminUserUnblockView.as_view()),
    path('api/admin/users/<int:id>/', AdminUserDeleteView.as_view()),

    # ============================
    # Reviews
    # ============================
    path('api/admin/reviews/', AdminReviewListView.as_view()),
    path('api/admin/reviews/<int:id>/approve/', AdminReviewApproveView.as_view()),
    path('api/admin/reviews/<int:id>/', AdminReviewDeleteView.as_view()),
    path('api/admin/reviews/<int:id>/status/', AdminReviewStatusUpdateView.as_view()),

    # ============================
    # Refunds
    # ============================
    path('api/admin/refunds/', AdminRefundListView.as_view()),
    path('api/admin/refunds/<int:id>/approve/', AdminRefundApproveView.as_view()),
    path('api/admin/refunds/<int:id>/reject/', AdminRefundRejectView.as_view()),
    path('api/admin/refunds/<int:id>/status/', AdminRefundStatusUpdateView.as_view()),

    # ============================
    # Notifications
    # ============================
    path('api/admin/notifications/', AdminNotificationListCreateView.as_view()),
    path('api/admin/notifications/<int:id>/', AdminNotificationDeleteView.as_view()),

    # ============================
    # Reports
    # ============================
    path('api/admin/reports/sales/', SalesReportView.as_view()),
    path('api/admin/reports/top-products/', TopProductsReportView.as_view()),
    path('api/admin/reports/revenue/', RevenueReportView.as_view()),
    path('api/admin/sales-report/', AdminSalesReportView.as_view()),

    # ============================
    # Categories & Brands
    # ============================
    path('api/admin/categories/', AdminCategoryListCreateView.as_view()),
    path('api/admin/categories/<int:id>/', AdminCategoryUpdateDeleteView.as_view()),

    path('api/admin/brands/', AdminBrandListCreateView.as_view()),
    path('api/admin/brands/<int:id>/', AdminBrandUpdateDeleteView.as_view()),

    # ============================
    # Contact
    # ============================
    path('api/admin/inbox/', AdminInboxView.as_view()),
    path('api/admin/reply/<int:id>/', AdminReplyView.as_view()),
]

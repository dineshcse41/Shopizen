// src/routes/AdminRoutes.jsx
import React from "react";
import { Outlet } from "react-router-dom";

// Admin Components
import Layout from "../components/admin/Layout.jsx";
import AdminRoute from "../components/routes/AdminRoute.jsx";

// Admin Pages
import Dashboard from "../pages/admin/common/Dashboard.jsx";

import AdminLogin from "../pages/admin/auth/Login.jsx";
import AdminRegister from "../pages/admin/auth/AdminRegister.jsx";
import AdminResetPassword from "../pages/admin/auth/AdminResetPassword.jsx";

import ProductsPage from "../pages/admin/products/Products.jsx";
import AddEditProduct from "../pages/admin/products/AddEditProduct.jsx";
import ProductView from "../pages/admin/products/ProductView.jsx";
import CategoriesPage from "../pages/admin/products/CategoriesPage.jsx";
import BrandsPage from "../pages/admin/products/BrandsPage.jsx";

import OrdersPage from "../pages/admin/orders/Orders.jsx";
import OrderDetails from "../pages/admin/orders/OrderDetails.jsx";
import ReviewModeration from "../pages/admin/products/ReviewModeration.jsx";
import RefundHandling from "../pages/admin/products/RefundHandling.jsx";

import UsersPage from "../pages/admin/users/Users.jsx";
import NotificationManagement from "../pages/admin/notifications/NotificationManagement.jsx";
import SalesReport from "../pages/admin/sales/SalesReport.jsx";
import Chat from "../pages/admin/notifications/Chat.jsx";
// Testing Pages
import MaintenancePage from "../pages/testing/MaintenancePage.jsx";
import NotFound404 from "../pages/testing/NotFound404.jsx";
import Forbidden403 from "../pages/testing/Forbidden403.jsx";
import SessionExpired from "../pages/testing/SessionExpired.jsx";


// ✅ Permissions
const pagePermissions = {
    dashboard: "all",
    products: "manageProducts",
    "products/add": "manageProducts",
    "products/edit/:id": "manageProducts",
    "products/view/:id": "manageProducts",
    categories: "manageProducts",
    brands: "manageProducts",
    orders: "manageOrders",
    "order/:id": "viewOrders",
    users: "all",
    reviews: "all",
    refunds: "all",
    notifications: "all",
};

// ✅ Layout wrapper
function AdminLayoutWrapper() {
    return (
        <Layout>
            <Outlet />
        </Layout>
    );
}

// ✅ Helper to wrap each page
const wrapWithAdminRoute = (Component, permission) => (
    <AdminRoute requiredPermission={permission}>
        <Component />
    </AdminRoute>
);

// ✅ Final export
export const adminRoutes = [
    {
        path: "/admin",
        element: (
            <AdminRoute requiredPermission="all">
                <AdminLayoutWrapper />
            </AdminRoute>
        ),
        errorElement: <NotFound404 />,
        children: Object.entries(pagePermissions).map(([path, permission]) => {
            let Component;
            switch (path) {
                case "dashboard": Component = Dashboard; break;
                case "products": Component = ProductsPage; break;
                case "products/add":
                case "products/edit/:id": Component = AddEditProduct; break;
                case "products/view/:id": Component = ProductView; break;
                case "categories": Component = CategoriesPage; break;
                case "brands": Component = BrandsPage; break;
                case "orders": Component = OrdersPage; break;
                case "order/:id": Component = OrderDetails; break;
                case "users": Component = UsersPage; break;
                case "reviews": Component = ReviewModeration; break;
                case "refunds": Component = RefundHandling; break;
                case "notifications": Component = NotificationManagement; break;
                case "sales": Component = SalesReport; break;
                case "contacts": Component = Chat; break;
                case "login": Component = AdminLogin; break;
                case "register": Component = AdminRegister; break;
                case "reset-password": Component = AdminResetPassword; break;
                default: Component = NotFound404; break;
            }

            return {
                path,
                element: wrapWithAdminRoute(Component, permission),
            };
        }),
    },

    //  Auth & Misc pages
    { path: "/admin/login", element: <AdminLogin /> },
    { path: "/admin/register", element: <AdminRegister /> },
    { path: "/admin/reset-password", element: <AdminResetPassword /> },
    { path: "/maintenance", element: <MaintenancePage /> },
    { path: "/403", element: <Forbidden403 /> },
    { path: "/session-expired", element: <SessionExpired /> },
    { path: "*", element: <NotFound404 /> },
];

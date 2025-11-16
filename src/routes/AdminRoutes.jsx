// src/routes/AdminRoutes.jsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

// Layout & Route Guard
import Layout from "../components/admin/Layout.jsx";
import AdminRoute from "../components/routes/AdminRoute.jsx";

// Pages
import Dashboard from "../pages/admin/common/Dashboard.jsx";
import AdminProfile from "../pages/admin/common/AdminProfile.jsx";
import AdminLogin from "../pages/admin/auth/Login.jsx";
import AdminRegister from "../pages/admin/auth/AdminRegister.jsx";
import AdminResetPassword from "../pages/admin/auth/AdminResetPassword.jsx";

import ProductsPage from "../pages/admin/products/Products.jsx";
import AddEditProduct from "../pages/admin/products/AddEditProduct.jsx";
import ProductView from "../pages/admin/products/ProductView.jsx";
import CategoriesPage from "../pages/admin/products/CategoriesPage.jsx";
import BrandsPage from "../pages/admin/products/BrandsPage.jsx";
import ReviewModeration from "../pages/admin/products/ReviewModeration.jsx";
import RefundHandling from "../pages/admin/products/RefundHandling.jsx";

import OrdersPage from "../pages/admin/orders/Orders.jsx";
import OrderDetails from "../pages/admin/orders/OrderDetails.jsx";
import UsersPage from "../pages/admin/users/Users.jsx";

import NotificationManagement from "../pages/admin/notifications/NotificationManagement.jsx";
import Chat from "../pages/admin/notifications/Chat.jsx";
import SalesReport from "../pages/admin/sales/SalesReport.jsx";

import MaintenancePage from "../pages/testing/MaintenancePage.jsx";
import Forbidden403 from "../pages/testing/Forbidden403.jsx";
import NotFound404 from "../pages/testing/NotFound404.jsx";
import SessionExpired from "../pages/testing/SessionExpired.jsx";

// --- Role-Permissions JSON ---
// Later, replace with backend API call
import rolesPermissions from "../data/admin/roles.json";

/**
 * 🧱 Admin Layout Wrapper
 */
function AdminLayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

/**
 * 🧩 Wrap component with AdminRoute and permission
 */
const withAdminProtection = (Component, permission) => (
  <AdminRoute requiredPermission={permission}>
    <Component />
  </AdminRoute>
);

/**
 * 🚀 Final admin routes
 */
export const adminRoutes = [
  {
    path: "/admin",
    element: (
      <AdminRoute requiredPermission="all">
        <AdminLayoutWrapper />
      </AdminRoute>
    ),
    errorElement: <NotFound404 />,
    children: [
      // Protected pages
      {
        path: "dashboard",
        element: withAdminProtection(Dashboard, "dashboard"),
      },
      {
        path: "profile",
        element: withAdminProtection(AdminProfile, "profile"),
      },

      // Products
      {
        path: "products",
        element: withAdminProtection(ProductsPage, "manageProducts"),
      },
      {
        path: "products/add",
        element: withAdminProtection(AddEditProduct, "manageProducts"),
      },
      {
        path: "products/edit/:id",
        element: withAdminProtection(AddEditProduct, "manageProducts"),
      },
      {
        path: "products/view/:id",
        element: withAdminProtection(ProductView, "manageProducts"),
      },
      {
        path: "categories",
        element: withAdminProtection(CategoriesPage, "manageProducts"),
      },
      {
        path: "brands",
        element: withAdminProtection(BrandsPage, "manageProducts"),
      },
      {
        path: "reviews",
        element: withAdminProtection(ReviewModeration, "manageReviews"),
      },

      // Orders & Users
      {
        path: "orders",
        element: withAdminProtection(OrdersPage, "manageOrders"),
      },
      {
        path: "order/:id",
        element: withAdminProtection(OrderDetails, "viewOrders"),
      },
      { path: "users", element: withAdminProtection(UsersPage, "viewUsers") },
      {
        path: "refunds",
        element: withAdminProtection(RefundHandling, "manageOrders"),
      },

      // Notifications, Chat, Sales
      {
        path: "notifications",
        element: withAdminProtection(
          NotificationManagement,
          "manageNotifications"
        ),
      },
      { path: "chat", element: withAdminProtection(Chat, "manageSupport") },
      {
        path: "sales",
        element: withAdminProtection(SalesReport, "viewReports"),
      },
    ],
  },

  // Auth & system pages
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin/register", element: <AdminRegister /> },
  { path: "/admin/reset-password", element: <AdminResetPassword /> },
  { path: "/403", element: <Forbidden403 /> },
  { path: "/session-expired", element: <SessionExpired /> },
  { path: "/maintenance", element: <MaintenancePage /> },
  { path: "*", element: <NotFound404 /> },
];

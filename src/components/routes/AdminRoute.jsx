// src/components/routes/AdminRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import rolesPermissions from "../../data/admin/roles.json";

/**
 * 🔐 AdminRoute Component
 * Handles secure access control for admin routes based on:
 * - Authentication
 * - Active session
 * - Role-based permissions
 */
const AdminRoute = ({ children, requiredPermission }) => {
  const { user, isSessionActive, logout } = useAuth();
  const location = useLocation();

  // ⛔ Not logged in
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // ⏳ Session expired
  if (!isSessionActive()) {
    logout(true);
    return <Navigate to="/session-expired" replace />;
  }

  // 🎯 Get permissions for the user's role
  const roleData = rolesPermissions.find((r) => r.role === user.role);
  const userPermissions = roleData?.permissions || [];

  // 🛑 Permission check
  // ✅ Dashboard & Profile accessible to all roles
  const hasPermission =
    ["dashboard", "profile"].includes(requiredPermission) || // allow these pages for all roles
    userPermissions.includes("all") || // superadmin
    (requiredPermission && userPermissions.includes(requiredPermission));

  if (!hasPermission) {
    console.warn(
      `[ACCESS DENIED] Role "${user.role}" attempted to access "${location.pathname}" without permission "${requiredPermission}".`
    );
    return <Navigate to="/403" replace />;
  }

  // ✅ Access granted
  return children;
};

export default AdminRoute;

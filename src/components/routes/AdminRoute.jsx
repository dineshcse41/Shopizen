// src/components/routes/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import rolesPermissions from "../../data/admin/roles.json";

const AdminRoute = ({ children, requiredPermission }) => {
    const { user, isSessionActive, logout } = useAuth();

    if (!user) return <Navigate to="/admin/login" />;      // not logged in
    if (!isSessionActive()) {                               // session expired
        logout(true);
        return null;
    }

    // find permissions for logged-in role
    const rolePermissions = rolesPermissions.find(r => r.role === user.role)?.permissions || [];

    // if user has 'all' permission or the requiredPermission
    if (requiredPermission && !(rolePermissions.includes("all") || rolePermissions.includes(requiredPermission))) {
        return <Navigate to="/403" />;
    }

    return children;
};

export default AdminRoute;

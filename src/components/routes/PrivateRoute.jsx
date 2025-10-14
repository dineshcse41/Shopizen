import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const PrivateRoute = ({ children }) => {
    const { user, isSessionActive, logout } = useAuth();

    if (!user) return <Navigate to="/login-email" />;       // not logged in
    if (!isSessionActive()) {                                // session expired
        logout(true);
        return null;
    }

    return children;                                        // user is allowed
};

export default PrivateRoute;

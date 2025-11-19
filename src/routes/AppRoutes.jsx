// src/routes/AppRoutes.jsx
import React from "react";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { userRoutes } from "../routes/UserRoutes.jsx";
import { adminRoutes } from "../routes/AdminRoutes.jsx";
import Preloader from "../pages/testing/Preloader.jsx";
import TitleManager from "../components/routes/TitleManager.jsx";
import LoadingWrapper from "../components/routes/LoadingWrapper.jsx";

// Wrapper for global features like title and loading
function AppRoutesWrapper() {
    return (
        <>
            <TitleManager />
            <LoadingWrapper>
                <Outlet />
            </LoadingWrapper>
        </>
    );
}

// ✅ Merge user and admin routes
const router = createBrowserRouter([
    {
        element: <AppRoutesWrapper />,
        children: [
            ...userRoutes,
            ...adminRoutes,
            // Catch-all route for unmatched URLs
            { path: "*", element: <Preloader /> }, // or NotFound404 if you want
        ],
    },
]);

export default function AppRoutes() {
    return <RouterProvider router={router} fallbackElement={<Preloader />} />;
}

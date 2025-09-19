import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate, useLocation,} from "react-router-dom";

import { useAuth } from "../components/context/AuthContext.jsx";
import Layout from "../components/admin/Layout.jsx"; // Admin layout
import productsData from "../data/product_sample.json";

// -------------------- Pages --------------------
// Auth
import LoginWithEmail from "../pages/Authentication/LoginWithEmail.jsx";
import LoginWithMobile from "../pages/Authentication/LoginWithMobile.jsx";
import Register from "../pages/Authentication/Register.jsx";
import Reset from "../pages/Authentication/Reset.jsx";

// General
import Home from "../pages/General/HomePage.jsx";

// Products
import Products from "../pages/Products/ProductListingPage/Products.jsx";
import ProductDetail from "../pages/Products/ProductDetailPage/ProductDetail.jsx";
import ComparisonPage from "../pages/Products/ComparisonPage.jsx";
import WishlistPage from "../pages/Products/WishlistPage.jsx";

// Orders
import OrderPage from "../pages/OrderPage/OrderPage.jsx";
import CartPage from "../pages/OrderPage/CartPage.jsx";
import CheckoutPage from "../pages/OrderPage/CheckoutPage.jsx";
import OrderConfirmPage from "../pages/OrderPage/OrderConfirmPage.jsx";
import TrackOrderPage from "../pages/OrderPage/TrackOrderPage.jsx";

// User Account
import ProfilePage from "../pages/UserAccount/ProfilePage.jsx";

// Admin
import AdminLogin from "../pages/Admin/Login.jsx";
import ProductsPage from "../pages/Admin/Products.jsx";
import AddEditProduct from "../pages/Admin/AddEditProduct.jsx";
import OrdersPage from "../pages/Admin/Orders.jsx";
import OrderDetails from "../pages/Admin/OrderDetails.jsx";
import UsersPage from "../pages/Admin/Users.jsx";
import ReviewModeration from "../pages/Admin/ReviewModeration.jsx";
import RefundHandling from "../pages/Admin/RefundHandling.jsx";
import NotificationManagement from "../pages/Admin/NotificationManagement.jsx";

// Testing
import NotFound404 from "../pages/Testing/NotFound404.jsx";

// Components
import CategoryProducts from "../components/Cart/CategoryProduct.jsx";

// -------------------- Wrappers --------------------
function ProductDetailWrapper() {
    return <ProductDetail products={productsData} />;
}

// -------------------- Title Manager --------------------
function TitleManager() {
    const location = useLocation();
    useEffect(() => {
        const routeTitles = {
            "/": "Home | Shopizen",
            "/login-email": "Login (Email) | Shopizen",
            "/login-mobile": "Login (Mobile) | Shopizen",
            "/register": "Register | Shopizen",
            "/reset": "Reset Password | Shopizen",
            "/products": "Products | Shopizen",
            "/cart": "My Cart | Shopizen",
            "/checkout": "Checkout | Shopizen",
            "/order-confirm": "Order Confirmation | Shopizen",
            "/wishlist": "My Wishlist | Shopizen",
            "/orders": "My Orders | Shopizen",
            "/profile": "My Profile | Shopizen",
        };

        if (location.pathname.startsWith("/product/")) {
            document.title = "Product Details | Shopizen";
        } else if (location.pathname.startsWith("/track/")) {
            document.title = "Track Order | Shopizen";
        } else if (location.pathname.startsWith("/share/")) {
            document.title = "Shared Tracker | Shopizen";
        } else {
            document.title = routeTitles[location.pathname] || "Shopizen";
        }
    }, [location]);
    return null;
}

// -------------------- Layouts --------------------
function UserLayout() {
    return (
        <>
            <TitleManager />
            <Outlet />
        </>
    );
}

function AdminLayoutWrapper() {
    return (
        <Layout>
            <Outlet />
        </Layout>
    );
}

// -------------------- Protected Routes --------------------
function PrivateRoute({ children }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login-email" replace />;
    if (user.role !== "user") return <Navigate to="/" replace />;
    return children;
}

function AdminRoute({ children }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/admin/login" replace />;
    if (user.role !== "admin") return <Navigate to="/" replace />;
    return children;
}

// -------------------- Router --------------------
const router = createBrowserRouter([
    // ---------- User Side ----------
    {
        element: <UserLayout />,
        errorElement: <NotFound404 />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/login-email", element: <LoginWithEmail /> },
            { path: "/login-mobile", element: <LoginWithMobile /> },
            { path: "/register", element: <Register /> },
            { path: "/reset", element: <Reset /> },

            { path: "/products", element: <Products /> },
            { path: "/product/:id", element: <ProductDetailWrapper /> },
            { path: "/products/category/:category", element: <CategoryProducts /> },
            { path: "/compare", element: <ComparisonPage /> },

            {
                path: "/cart",
                element: (
                    <PrivateRoute>
                        <CartPage />
                    </PrivateRoute>
                ),
            },
            {
                path: "/checkout",
                element: (
                    <PrivateRoute>
                        <CheckoutPage />
                    </PrivateRoute>
                ),
            },
            {
                path: "/order-confirm",
                element: (
                    <PrivateRoute>
                        <OrderConfirmPage />
                    </PrivateRoute>
                ),
            },
            {
                path: "/orders",
                element: (
                    <PrivateRoute>
                        <OrderPage />
                    </PrivateRoute>
                ),
            },
            {
                path: "/profile",
                element: (
                    <PrivateRoute>
                        <ProfilePage />
                    </PrivateRoute>
                ),
            },
            {
                path: "/wishlist",
                element: (
                    <PrivateRoute>
                        <WishlistPage />
                    </PrivateRoute>
                ),
            },
            {
                path: "/track/:orderId",
                element: (
                    <PrivateRoute>
                        <TrackOrderPage />
                    </PrivateRoute>
                ),
            },
            {
                path: "/track/:orderId:itemId",
                element: (
                    <PrivateRoute>
                        <TrackOrderPage />
                    </PrivateRoute>
                ),
            },
        ],
    },

    // ---------- Admin Side ----------
    {
        path: "/admin",
        element: (
            <AdminRoute>
                <AdminLayoutWrapper />
            </AdminRoute>
        ),
        children: [
            { path: "dashboard", element: <OrdersPage /> }, // default dashboard
            { path: "products", element: <ProductsPage /> },
            { path: "add-product", element: <AddEditProduct /> },
            { path: "edit-product/:id", element: <AddEditProduct /> },
            { path: "orders", element: <OrdersPage /> },
            { path: "order/:id", element: <OrderDetails /> },
            { path: "users", element: <UsersPage /> },
            { path: "reviews", element: <ReviewModeration /> },
            { path: "refunds", element: <RefundHandling /> },
            { path: "notifications", element: <NotificationManagement /> },
        ],
    },
    { path: "/admin/login", element: <AdminLogin /> },
]);

export default function AppRoutes() {
    return <RouterProvider router={router} />;
}

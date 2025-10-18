// routes/UserRoutes.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import productsData from "../data/products/products.json";
import { useAuth } from "../components/context/AuthContext.jsx";

// General
import Home from "../pages/user/general/Home.jsx";
import OfferPage from "../pages/user/general/OfferPage.jsx";

// Auth
import LoginWithEmail from "../pages/user/auth/LoginWithEmail.jsx";
import LoginWithMobile from "../pages/user/auth/LoginWithMobile.jsx";
import Register from "../pages/user/auth/Register.jsx";
import Reset from "../pages/user/auth/Reset.jsx";

// Products
import Products from "../pages/user/products/Products.jsx";
import ProductDetail from "../pages/user/products/ProductDetail.jsx";
import CategoryProducts from "../components/cart/CategoryProducts.jsx";

// User Account
import ComparisonPage from "../pages/user/account/ComparisonPage.jsx";
import WishlistPage from "../pages/user/account/WishlistPage.jsx";
import ProfilePage from "../pages/user/account/Profile.jsx";
import AddAddress from "../pages/user/account/AddAddress.jsx";
import EditAddress from "../pages/user/account/EditAddress.jsx";
import UserChat from "../pages/user/account/Contact.jsx";
import UserWallet from "../pages/user/account/WalletPage.jsx";

// Orders
import OrderPage from "../pages/user/order/Order.jsx";
import CartPage from "../pages/user/order/CartPage.jsx";
import CheckoutPage from "../pages/user/order/CheckoutPage.jsx";
import OrderConfirmPage from "../pages/user/order/OrderConfirm.jsx";
import TrackOrderPage from "../pages/user/order/TrackOrderPage.jsx";

// Testing
import MaintenancePage from "../pages/testing/MaintenancePage.jsx";
import NotFound404 from "../pages/testing/NotFound404.jsx";
import Forbidden403 from "../pages/testing/Forbidden403.jsx";
import SessionExpired from "../pages/testing/SessionExpired.jsx";

// Routing
import PrivateRoute from "../components/routes/PrivateRoute.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";

function ProductDetailWrapper() {
    return <ProductDetail products={productsData} />;
}

function ContactWrapper() {
    const { user } = useAuth(); // assuming user.id exists
    return <UserChat currentUserId={user.id} />;
}


function UserLayoutWrapper() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}

export const userRoutes = [
    {
        element: <UserLayoutWrapper />,
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
            
            { path: "/cart", element: <PrivateRoute><CartPage /></PrivateRoute> },
            { path: "/checkout", element: <PrivateRoute><CheckoutPage /></PrivateRoute> },
            { path: "/order-confirm", element: <PrivateRoute><OrderConfirmPage /></PrivateRoute> },
            { path: "/orders", element: <PrivateRoute><OrderPage /></PrivateRoute> },
            
            { path: "/profile", element: <PrivateRoute><ProfilePage /></PrivateRoute> },
            { path: "/wishlist", element: <PrivateRoute><WishlistPage /></PrivateRoute> },
            { path: "/track/:orderId", element: <PrivateRoute><TrackOrderPage /></PrivateRoute> },
            { path: "/address/add", element: <PrivateRoute><AddAddress /></PrivateRoute> },
            { path: "/address/edit/:id", element: <PrivateRoute><EditAddress /></PrivateRoute> },
            { path: "/user/wallet", element: <UserWallet /> },
            { path: "/contact", element: <ContactWrapper /> },

            // Add your offer route here
            { path: "/offers/:id", element: <OfferPage /> },

            // Catch-all 404 route (important)
            { path: "*", element: <NotFound404 /> },
        ],
        
    },

    { path: "/maintenance", element: <MaintenancePage /> },
    { path: "/403", element: <Forbidden403 /> },
    { path: "/session-expired", element: <SessionExpired /> },
];


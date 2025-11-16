// routes/UserRoutes.jsx
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import productsData from "../data/products/products.json";
import { useAuth } from "../components/context/AuthContext.jsx";

// General
import Home from "../pages/user/general/Home.jsx";
import OfferPage from "../pages/user/general/OfferPage.jsx";
import About from "../pages/user/general/About.jsx";
import FAQ from "../pages/user/general/FAQ.jsx";
import Terms from "../pages/user/general/Terms.jsx";
import Privacy from "../pages/user/general/Privacy.jsx";
import PaymentPolicy from "../pages/user/general/PaymentPolicy";
import ShippingPolicy from "../pages/user/general/ShippingPolicy";
import ReturnPolicy from "../pages/user/general/ReturnPolicy";

// Auth
import LoginWithEmail from "../pages/user/auth/LoginWithEmail.jsx";
import LoginWithMobile from "../pages/user/auth/LoginWithMobile.jsx";
import Register from "../pages/user/auth/Register.jsx";
import Reset from "../pages/user/auth/Reset.jsx";

// Products
import Products from "../pages/user/products/Products.jsx";
import TodayDeals from "../pages/user/products/TodayDeals.jsx";
import MidSeasonSale from "../pages/user/products/MidSeasonSale.jsx";
import ProductDetail from "../pages/user/products/ProductDetail.jsx";
import CategoryProducts from "../components/cart/CategoryProducts.jsx";

// User Account
import ComparisonPage from "../pages/user/account/ComparisonPage.jsx";
import WishlistPage from "../pages/user/account/WishlistPage.jsx";
import ProfilePage from "../pages/user/account/profile/Profile.jsx";
import EditProfilePage from "../pages/user/account/profile/EditProfilePage.jsx";
import VerifyEmailPage from "../pages/user/account/VerifyEmailPage";
import AddAddress from "../pages/user/account/address/AddAddress.jsx";
import EditAddress from "../pages/user/account/address/EditAddress.jsx";
import UserChat from "../pages/user/account/Contact.jsx";
import UserWallet from "../pages/user/account/WalletPage.jsx";
import Dashboard from "../pages/user/account/Dashboard.jsx";

// Orders
import OrderPage from "../pages/user/order/OrderPage.jsx";
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
import Footer from "../components/Footer/Footer";
import Notifications from "../pages/user/account/Notifications.jsx";
import NotificationSettings from "../pages/user/account/settings/NotificationSettings.jsx";
import PrivacySettings from "../pages/user/account/settings/PrivacySettings.jsx";

function ProductDetailWrapper() {
  return <ProductDetail products={productsData} />;
}

function ContactWrapper() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login-email" replace />;
  }

  return <UserChat currentUserId={user.id} />;
}

function UserLayoutWrapper() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
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
      { path: "/today-deals", element: <TodayDeals /> },
      { path: "/mid-season-sale", element: <MidSeasonSale /> },
      { path: "/product/:id", element: <ProductDetailWrapper /> },
      {
        path: "/products/category/:category/:subcategory?",
        element: <CategoryProducts />,
      },
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
        path: "/account/orders",
        element: (
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
        ),
      },

      {
        path: "/account/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/account/profile",
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        ),
      },
      {
        path: "/account/verify-email",
        element: (
          <PrivateRoute>
            <VerifyEmailPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/account/edit-profile",
        element: (
          <PrivateRoute>
            <EditProfilePage />
          </PrivateRoute>
        ),
      },
      {
        path: "/account/wishlist",
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
        path: "/address/add",
        element: (
          <PrivateRoute>
            <AddAddress />
          </PrivateRoute>
        ),
      },
      {
        path: "/address/edit/:id",
        element: (
          <PrivateRoute>
            <EditAddress />
          </PrivateRoute>
        ),
      },
      { path: "/account/wallet", element: <UserWallet /> },
      { path: "/account/contact", element: <ContactWrapper /> },
      {
        path: "/account/notifications",
        element: (
          <PrivateRoute>
            <Notifications />
          </PrivateRoute>
        ),
      },

      {
        path: "/account/settings/notifications",
        element: (
          <PrivateRoute>
            <NotificationSettings />
          </PrivateRoute>
        ),
      },
      {
        path: "/account/settings/privacy",
        element: (
          <PrivateRoute>
            <PrivacySettings /> {/* Or a separate PrivacySettings page */}
          </PrivateRoute>
        ),
      },

      // Add your offer route here
      { path: "/offers/:id", element: <OfferPage /> },
      { path: "/about", element: <About /> },
      { path: "/faq", element: <FAQ /> },
      { path: "/terms", element: <Terms /> },
      { path: "/privacy", element: <Privacy /> },
      { path: "/payments", element: <PaymentPolicy /> },
      { path: "/shipping", element: <ShippingPolicy /> },
      { path: "/returns", element: <ReturnPolicy /> },

      // Catch-all 404 route (important)
      { path: "*", element: <NotFound404 /> },
    ],
  },

  { path: "/maintenance", element: <MaintenancePage /> },
  { path: "/403", element: <Forbidden403 /> },
  { path: "/session-expired", element: <SessionExpired /> },
];

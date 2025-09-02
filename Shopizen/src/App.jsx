import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import React, { useEffect } from "react";
import './App.css';

// Authentication
import LoginWithEmail from '../pages/Authentication/LoginWithEmail.jsx';
import LoginWithMobile from '../pages/Authentication/LoginWithMobile.jsx';
import Register from '../pages/Authentication/Register.jsx';
import Reset from '../pages/Authentication/Reset.jsx';

// General
import Home from '../pages/General/Home.jsx';

// Products
import Products from '../pages/Products/ProductListingPage/Products.jsx';
import ProductDetail from '../pages/Products/ProductDetailPage/ProductDetail.jsx';

// Testing
import NotFound404 from '../pages/Testing/NotFound404.jsx';

// Data
import productsData from "../data/product_sample_data.json";

// Orders
import OrderPage from '../pages/OrderPage/OrderPage.jsx';
import CartPage from '../pages/OrderPage/CartPage.jsx';
import CheckoutPage from '../pages/OrderPage/CheckoutPage.jsx';
import OrderConfirmPage from '../pages/OrderPage/OrderConfirmPage.jsx';
import WishlistPage from '../pages/Products/WishlistPage.jsx';
import TrackOrderPage from '../pages/OrderPage/TrackOrderPage.jsx';
import ShareTrackerPage from '../pages/OrderPage/ShareTrackerPage.jsx';
import CategoryProducts from './components/Cart/CategoryProduct.jsx';
import PaymentSuccess from './../pages/OrderPage/PaymentSuccess.jsx'

// ✅ Wrapper to pass props safely
function ProductDetailWrapper() {
  return <ProductDetail products={productsData} />;
}

// ✅ TitleManager inside router context
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
      "/orders": "My Orders | Shopizen"
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

// ✅ Layout wrapper so TitleManager is always active
function AppLayout() {
  return (
    <>
      <TitleManager />
      <Outlet />  {/* renders the actual page */}
    </>
  );
}

// ✅ Define router
const router = createBrowserRouter([
  {
    element: <AppLayout />,   // Layout wraps all routes
    errorElement: <NotFound404 />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login-email', element: <LoginWithEmail /> },
      { path: '/login-mobile', element: <LoginWithMobile /> },
      { path: '/register', element: <Register /> },
      { path: '/reset', element: <Reset /> },
      { path: '/products', element: <Products /> },
      { path: '/product/:id', element: <ProductDetailWrapper /> },
      { path: '/cart', element: <CartPage /> },
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/order-confirm', element: <OrderConfirmPage /> },
      { path: '/wishlist', element: <WishlistPage /> },
      { path: '/track/:orderId', element: <TrackOrderPage /> },
      { path: '/share/:orederId', element: <ShareTrackerPage /> },
      { path: '/orders', element: <OrderPage /> },
      {path: "/products/category/:category", element :< CategoryProducts />},
      {path: "/payment-success", element: < PaymentSuccess/>}

    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

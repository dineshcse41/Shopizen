// src/components/Routes/TitleManager.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import productsData from "../../data/products/products.json";

export default function TitleManager() {
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    let title = "Shopizen";

    // -------------------- USER PAGES --------------------
    if (pathname === "/") title = "Home | Shopizen";
    else if (pathname === "/login-email") title = "Login (Email) | Shopizen";
    else if (pathname === "/login-mobile") title = "Login (Mobile) | Shopizen";
    else if (pathname === "/register") title = "Register | Shopizen";
    else if (pathname === "/reset") title = "Reset Password | Shopizen";
    else if (pathname === "/products") title = "All Products | Shopizen";
    else if (pathname === "/today-deals") title = "Today's Deals | Shopizen";
    else if (pathname === "/mid-season-sale")
      title = "Mid Season Sale | Shopizen";
    // ---------------- Dynamic Product Detail ----------------
    else if (pathname.startsWith("/product/")) {
      const productId = pathname.split("/product/")[1];
      const product = productsData.find((p) => p.id.toString() === productId);
      title = product
        ? `${product.name} | Shopizen`
        : "Product Details | Shopizen";
    }

    // ---------------- Product Category ----------------
    else if (pathname.startsWith("/products/category/")) {
      const category = pathname.split("/products/category/")[1];
      title = `${decodeURIComponent(category)} Products | Shopizen`;
    }

    // ---------------- Offer & Info Pages ----------------
    else if (pathname.startsWith("/offers/")) title = "Offers | Shopizen";
    else if (pathname === "/about") title = "About Us | Shopizen";
    else if (pathname === "/faq") title = "FAQ | Shopizen";
    else if (pathname === "/terms") title = "Terms & Conditions | Shopizen";
    else if (pathname === "/privacy") title = "Privacy Policy | Shopizen";
    else if (pathname === "/payments") title = "Payment Policy | Shopizen";
    else if (pathname === "/shipping") title = "Shipping Policy | Shopizen";
    else if (pathname === "/returns") title = "Return Policy | Shopizen";
    // ---------------- Orders & Account ----------------
    else if (pathname === "/cart") title = "My Cart | Shopizen";
    else if (pathname === "/checkout") title = "Checkout | Shopizen";
    else if (pathname === "/order-confirm")
      title = "Order Confirmation | Shopizen";
    else if (pathname === "/account/orders") title = "My Orders | Shopizen";
    else if (pathname === "/account/dashboard")
      title = "My Dashboard | Shopizen";
    else if (pathname === "/account/profile") title = "My Profile | Shopizen";
    else if (pathname === "/account/verify-email")
      title = "Verify Email | Shopizen";
    else if (pathname === "/account/edit-profile")
      title = "Edit Profile | Shopizen";
    else if (pathname === "/account/wishlist") title = "My Wishlist | Shopizen";
    else if (pathname === "/account/wallet") title = "My Wallet | Shopizen";
    else if (pathname === "/account/contact")
      title = "Contact Support | Shopizen";
    else if (pathname === "/account/notifications")
      title = "My Notifications | Shopizen";
    else if (pathname === "/account/settings/notifications")
      title = "Notification Settings | Shopizen";
    else if (pathname === "/account/settings/privacy")
      title = "Privacy Settings | Shopizen";
    else if (pathname.startsWith("/track/"))
      title = "Track My Order | Shopizen";
    else if (pathname.startsWith("/address/add"))
      title = "Add Address | Shopizen";
    else if (pathname.startsWith("/address/edit/"))
      title = "Edit Address | Shopizen";
    else if (pathname === "/compare") title = "Product Comparison | Shopizen";
    // -------------------- SYSTEM TESTING PAGES --------------------
    else if (pathname === "/maintenance") title = "Maintenance Mode | Shopizen";
    else if (pathname === "/403") title = "Access Denied | Shopizen";
    else if (pathname === "/session-expired")
      title = "Session Expired | Shopizen";
    else if (pathname === "/404" || pathname === "/*")
      title = "Page Not Found | Shopizen";
    // -------------------- ADMIN PAGES --------------------
    else if (pathname.startsWith("/admin")) {
      if (pathname === "/admin/login") title = "Admin Login | Shopizen";
      else if (pathname === "/admin/register")
        title = "Admin Register | Shopizen";
      else if (pathname === "/admin/reset-password")
        title = "Admin Reset Password | Shopizen";
      else if (pathname.includes("/dashboard"))
        title = "Admin Dashboard | Shopizen";
      else if (pathname.includes("/profile"))
        title = "Admin Profile | Shopizen";
      else if (pathname.includes("/products/add"))
        title = "Add Product | Shopizen";
      else if (pathname.includes("/products/edit/"))
        title = "Edit Product | Shopizen";
      else if (pathname.includes("/products/view/"))
        title = "Product Details | Shopizen";
      else if (pathname.includes("/products"))
        title = "Manage Products | Shopizen";
      else if (pathname.includes("/categories"))
        title = "Manage Categories | Shopizen";
      else if (pathname.includes("/brands")) title = "Manage Brands | Shopizen";
      else if (pathname.includes("/reviews"))
        title = "Review Moderation | Shopizen";
      else if (pathname.includes("/orders")) title = "Manage Orders | Shopizen";
      else if (pathname.includes("/order/")) title = "Order Details | Shopizen";
      else if (pathname.includes("/refunds"))
        title = "Refund Handling | Shopizen";
      else if (pathname.includes("/users"))
        title = "User Management | Shopizen";
      else if (pathname.includes("/notifications"))
        title = "Notification Management | Shopizen";
      else if (pathname.includes("/chat")) title = "Admin Chat | Shopizen";
      else if (pathname.includes("/sales")) title = "Sales Report | Shopizen";
      else if (pathname.includes("/403")) title = "Access Denied | Shopizen";
      else if (pathname.includes("/session-expired"))
        title = "Session Expired | Shopizen";
      else if (pathname.includes("/maintenance"))
        title = "Maintenance Mode | Shopizen";
      else title = "Admin Panel | Shopizen";
    }

    document.title = title;
  }, [pathname]);

  return null;
}

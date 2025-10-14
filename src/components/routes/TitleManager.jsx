// components/Routes/TitleManager.jsx
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
        else if (pathname === "/products") title = "Products | Shopizen";
        
        // ---------------- Dynamic Product Detail ----------------
        else if (pathname.startsWith("/product/")) {
            const productId = pathname.split("/product/")[1];
            const product = productsData.find((p) => p.id.toString() === productId);
            title = product ? `${product.name} | Shopizen` : "Product Details | Shopizen";
        }
        
        // ---------------- Product Category ----------------
        else if (pathname.startsWith("/products/category/")) {
            const category = pathname.split("/products/category/")[1];
            title = `${decodeURIComponent(category)} Products | Shopizen`;
        }
        
        // ---------------- Order path ----------------
        else if (pathname === "/cart") title = "My Cart | Shopizen";
        else if (pathname === "/checkout") title = "Checkout | Shopizen";
        else if (pathname === "/order-confirm") title = "Order Confirmation | Shopizen";
        else if (pathname === "/wishlist") title = "My Wishlist | Shopizen";
        else if (pathname === "/orders") title = "My Orders | Shopizen";
        else if (pathname === "/profile") title = "My Profile | Shopizen";
        else if (pathname.startsWith("/track/")) title = "Track Order | Shopizen";

        // -------------------- ADMIN PAGES --------------------
        else if (pathname.startsWith("/admin")) {
            if (pathname.includes("/dashboard")) title = "Admin Dashboard | Shopizen";
            else if (pathname.includes("/products")) title = "Admin Products | Shopizen";
            else if (pathname.includes("/add-product")) title = "Add Product | Shopizen";
            else if (pathname.includes("/edit-product")) title = "Edit Product | Shopizen";
            else if (pathname.includes("/orders")) title = "Admin Orders | Shopizen";
            else if (pathname.includes("/order/")) title = "Order Details | Shopizen";
            else if (pathname.includes("/users")) title = "Admin Users | Shopizen";
            else if (pathname.includes("/reviews")) title = "Review Moderation | Shopizen";
            else if (pathname.includes("/refunds")) title = "Refund Handling | Shopizen";
            else if (pathname.includes("/notifications")) title = "Notification Management | Shopizen";
            else if (pathname.includes("/login")) title = "Admin Login | Shopizen";
            else title = "Admin | Shopizen";
        }

        document.title = title;
    }, [pathname]);

    return null;
}

// OrderConfirmPage.jsx
import React, { useContext, useMemo, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../src/components/context/AuthContext";
import { CartContext } from "../../src/components/context/CartContext";
import "./OrderConfirm.css";

// ✅ Unique ID generator
const uid = (prefix = "id") =>
    `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const OrderConfirmPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { clearCart } = useContext(CartContext);
    const [orderData, setOrderData] = useState(null);

    // ✅ Get order data either from state or localStorage
    const loadedOrder = useMemo(() => {
        if (!user) return null;
        const fromState = location.state?.orderData;
        if (fromState) return fromState;

        try {
            const userOrders = JSON.parse(localStorage.getItem(`orders_${user.id}`)) || [];
            return userOrders.length > 0 ? userOrders[userOrders.length - 1] : null;
        } catch (err) {
            console.error("Error parsing localStorage orders:", err);
            return null;
        }
    }, [location.state, user]);

    // inside useEffect in OrderConfirmPage.jsx
    useEffect(() => {
        if (!user || !loadedOrder) return;

        const normalized = { ...loadedOrder };

        if (!normalized.id) normalized.id = uid("order");

        normalized.items = (normalized.items || []).map((item) => {
            const copy = { ...item };
            if (!copy.orderItemId) copy.orderItemId = uid("oi");
            if (typeof copy.statusIndex !== "number") copy.statusIndex = 0;
            if (!copy.expectedDelivery) {
                const days = Math.floor(Math.random() * 5) + 3;
                const d = new Date();
                d.setDate(d.getDate() + days);
                copy.expectedDelivery = d.toDateString();
            }
            return copy;
        });

        try {
            const orders = JSON.parse(localStorage.getItem(`orders_${user.id}`)) || [];
            const idx = orders.findIndex((o) => o.id === normalized.id);
            if (idx >= 0) orders[idx] = normalized;
            else orders.push(normalized);
            localStorage.setItem(`orders_${user.id}`, JSON.stringify(orders));
        } catch (e) {
            console.error("Failed to persist normalized order:", e);
        }

        setOrderData(normalized);

        // ❌ removed clearCart();  (already handled in CheckoutPage)
    }, [loadedOrder, user]);

    if (!user) {
        return <p className="text-center mt-5">Please log in to view your order confirmation.</p>;
    }

    if (!orderData) {
        return <p className="text-center mt-5">⚠️ Order data not found!</p>;
    }

    return (
        <div className="order-confirm-page p-3">
            <div className="text-center py-5">
                <h2 className="mb-3 text-success">🎉 Order Placed Successfully!</h2>
                <p className="mb-4">Thank you for shopping with us. Your order details are below.</p>

                {/* Customer & Shipping Info */}
                <div className="order-summary card p-3 me-2 " style={{maxHeight: "60%"}}>
                    <h5>Customer Info</h5>
                    <p><strong>Name:</strong> {orderData.customer?.firstName} {orderData.customer?.lastName}</p>
                    <p><strong>Email:</strong> {orderData.customer?.email}</p>
                    <p><strong>Order ID:</strong> {orderData.id}</p>
                    <p><strong>Expected Delivery:</strong> {orderData.items?.[0]?.expectedDelivery || "N/A"}</p>

                    <h5 className="mt-3">Shipping Address</h5>
                    <p>
                        {orderData.customer?.address}, {orderData.customer?.city}, {orderData.customer?.state} - {orderData.customer?.pincode}
                    </p>

                    <h5 className="mt-3">Payment Method</h5>
                    <p>{orderData.customer?.paymentMethod === "cod" ? "Cash on Delivery" : "Card Payment"}</p>
                </div>

            {/*   // Inside product list rendering in OrderConfirmPage.jsx */}

                {(orderData.items || []).map((item) => (
                    <div key={item.orderItemId} className="d-flex justify-content-between border p-2 mb-2 align-items-center">
                        <div>
                            <strong>{item.name}</strong> <br />
                            Qty: {item.quantity} | Price: ₹{(item.price || 0) * (item.quantity || 0)} <br />
                            Order Item ID: {item.orderItemId} <br />
                            Expected Delivery: {item.expectedDelivery || "N/A"}
                        </div>

                        <div className="d-flex flex-column gap-1">
                            {/* ✅ Track single item */}
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => navigate(`/track/${orderData.id}/${item.orderItemId}`)}
                            >
                                Track
                            </button>

                            {/* ✅ Share Tracker for individual item */}
                            <button
                                className="btn btn-outline-success"
                                onClick={() => {
                                    const shareLink = `${window.location.origin}/track/${orderData.id}/${item.orderItemId}`;

                                    if (navigator.share) {
                                        // ✅ Use Web Share API (Mobile Friendly)
                                        navigator.share({
                                            title: "Track Your Order",
                                            text: `Track your item: ${item.name}`,
                                            url: shareLink,
                                        });
                                    } else {
                                        // ✅ Fallback: copy link to clipboard
                                        navigator.clipboard.writeText(shareLink);
                                        alert("Tracker link copied to clipboard!");
                                    }
                                }}
                            >
                                Share Tracker
                            </button>
                        </div>
                    </div>
                ))}


                <div className="mt-3 d-flex justify-content-center gap-3">
                    <Link to="/orders" className="btn btn-outline-primary">View My Orders</Link>
                    <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
                </div>
                
            </div>
        </div>
    );
};

export default OrderConfirmPage;

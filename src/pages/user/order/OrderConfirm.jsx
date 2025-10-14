import React, { useContext, useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../../components/context//AuthContext.jsx";
import { useToast } from "../../../components/context/ToastContext.jsx";
import "./OrderConfirm.css";

const OrderConfirmPage = () => {
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const { showToast } = useToast();
    const [orderData, setOrderData] = useState(null);

    // Load latest order
    const loadedOrder = useMemo(() => {
        if (!user) return null;
        const fromState = location.state?.orderData;
        if (fromState) return fromState;

        try {
            const userOrders = JSON.parse(localStorage.getItem(`orders_${user.id}`)) || [];
            return userOrders.length > 0 ? userOrders[userOrders.length - 1] : null;
        } catch {
            return null;
        }
    }, [location.state, user]);

    useEffect(() => {
        if (!user || !loadedOrder) return;

        // Normalize items with unique IDs if missing
        const normalized = { ...loadedOrder };
        normalized.items = (normalized.items || []).map((item) => ({
            ...item,
            orderItemId: item.orderItemId || `IT-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            statusIndex: typeof item.statusIndex === "number" ? item.statusIndex : 0,
            expectedDelivery: item.expectedDelivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toDateString(),
        }));

        // Persist normalized order
        try {
            const orders = JSON.parse(localStorage.getItem(`orders_${user.id}`)) || [];
            const idx = orders.findIndex(o => o.id === normalized.id);
            if (idx >= 0) orders[idx] = normalized;
            else orders.push(normalized);
            localStorage.setItem(`orders_${user.id}`, JSON.stringify(orders));
        } catch (e) {
            console.error("Failed to save order:", e);
        }

        setOrderData(normalized);
    }, [loadedOrder, user]);

    if (!user) return <p className="text-center mt-5">Please log in to view your order confirmation.</p>;
    if (!orderData) return <p className="text-center mt-5">⚠️ Order data not found!</p>;

    return (
        <>
           
            <div className="order-confirm-page p-3">
                <div className="text-center py-5">
                    <h2 className="mb-3 text-success">🎉 Order Placed Successfully!</h2>
                    <p>Thank you for shopping with us. Your order details are below.</p>

                    <div className="order-summary card p-3 mb-4">
                        <h5>Customer Info</h5>
                        <p><strong>Name:</strong> {orderData.customer?.firstName} {orderData.customer?.lastName}</p>
                        <p><strong>Email:</strong> {orderData.customer?.email}</p>
                        <p><strong>Order ID:</strong> {orderData.id}</p>
                        <p><strong>Expected Delivery:</strong> {orderData.items?.[0]?.expectedDelivery}</p>

                        <h5 className="mt-3">Shipping Address</h5>
                        <p>{orderData.customer?.address}, {orderData.customer?.city}, {orderData.customer?.state} - {orderData.customer?.pincode}</p>

                        <h5 className="mt-3">Payment Method</h5>
                        <p>{orderData.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</p>
                    </div>

                    {/* Products */}
                    {(orderData.items || []).map((item) => (
                        <div key={item.orderItemId} className="d-flex justify-content-between border p-2 mb-2 align-items-center">
                            <div>
                                <strong>{item.name}</strong> <br />
                                Qty: {item.quantity} | ₹{(item.price || 0) * (item.quantity || 0)} <br />
                                Order Item ID: {item.orderItemId} <br />
                                Expected Delivery: {item.expectedDelivery}
                            </div>
                            <div className="d-flex flex-column gap-1">
                                <Link to={`/track/${orderData.id}/${item.orderItemId}`} className="btn btn-outline-primary btn-sm">Track</Link>
                                <button className="btn btn-outline-success btn-sm"
                                    onClick={() => {
                                        const shareUrl = `${window.location.origin}/track/${orderData.id}/${item.orderItemId}`;
                                        if (navigator.share) {
                                            navigator.share({ title: "Track My Order", text: `Track item: ${item.name}`, url: shareUrl })
                                                .then(() => showToast("Shared successfully!", "success"))
                                                .catch(() => showToast("Sharing failed", "error"));
                                        } else {
                                            navigator.clipboard.writeText(shareUrl).then(() => showToast("Link copied!", "success"));
                                        }
                                    }}
                                >Share Tracker</button>
                            </div>
                        </div>
                    ))}

                    <div className="mt-3 d-flex justify-content-center gap-3">
                        <Link to="/orders" className="btn btn-outline-primary">View My Orders</Link>
                        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderConfirmPage;

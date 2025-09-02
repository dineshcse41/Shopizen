import React, { useContext, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../src/components/context/AuthContext";
import Navbar from '../../src/components/Navbar/Navbar';

const OrderPage = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    const storageKey = useMemo(() => (user ? `orders_${user.id}` : null), [user]);

    useEffect(() => {
        if (!storageKey) return;
        try {
            const loaded = JSON.parse(localStorage.getItem(storageKey)) || [];
            setOrders(Array.isArray(loaded) ? loaded : []);
        } catch {
            setOrders([]);
        }
    }, [storageKey]);

    if (!user) return <p className="text-center mt-4">Please login to see your orders.</p>;
    if (!orders || orders.length === 0) return (
        <>
            <Navbar />
            <div className="mx-3 mt-4"><p>No orders found.</p></div>
        </>
    );

    const saveOrders = (updated) => {
        localStorage.setItem(storageKey, JSON.stringify(updated));
        setOrders(updated);
    };

    const cancelOrder = (orderId, itemId) => {
        const reason = prompt("Please provide a reason for cancellation:");
        if (!reason) return;

        const updatedOrders = orders.map(order => {
            if (order.id === orderId) {
                return {
                    ...order,
                    items: (order.items || []).map(item => {
                        if (item.orderItemId === itemId) {
                            return { ...item, statusIndex: -1, cancelReason: reason };
                        }
                        return item;
                    })
                };
            }
            return order;
        });

        saveOrders(updatedOrders);
    };

    return (
        <>
            <Navbar />
            <div className="mx-3 mt-4">
                <h2>My Orders</h2>
                {orders.map(order => (
                    <div key={order.id} className="border p-3 mb-3">
                        <h5>Order ID: {order.id}</h5>
                        <p>
                            Total Items: {order.totalItems ?? (order.items?.reduce((a, c) => a + (c.quantity || 0), 0) || 0)} |
                            {" "}Total Price: ₹{order.totalPrice ?? (order.items?.reduce((a, c) => a + (c.price || 0) * (c.quantity || 0), 0) || 0)}
                        </p>
                        <p>Expected Delivery: {order.items?.[0]?.expectedDelivery ?? "N/A"}</p>

                        {(order.items || []).map(item => (
                            <div key={item.orderItemId} className="border-top pt-2 mt-2">
                                <p>
                                    <strong>{item.name}</strong> - Qty: {item.quantity} - ₹{(item.price || 0) * (item.quantity || 0)}
                                </p>
                                <Link to={`/track/${order.id}`} className="btn btn-outline-primary btn-sm me-2">
                                    Track
                                </Link>
                                <Link to={`/share/${order.id}`} className="btn btn-outline-success btn-sm me-2">
                                    Share Tracker
                                </Link>
                                {item.statusIndex !== -1 && item.statusIndex < 4 && (
                                    <button
                                        onClick={() => cancelOrder(order.id, item.orderItemId)}
                                        className="btn btn-outline-danger btn-sm"
                                    >
                                        Cancel Order
                                    </button>
                                )}
                                {item.statusIndex === -1 && (
                                    <p className="text-danger mt-1"><strong>Cancelled:</strong> {item.cancelReason}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
};

export default OrderPage;

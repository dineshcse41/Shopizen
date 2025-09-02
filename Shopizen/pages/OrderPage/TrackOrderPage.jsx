import React, { useEffect, useState, useContext, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../src/components/context/AuthContext";

const statuses = ["Order Placed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

const TrackOrderPage = () => {
    const { orderId, itemId } = useParams(); // ✅ Capture itemId if present
    const { user } = useContext(AuthContext);
    const [order, setOrder] = useState(null);
    const intervalRef = useRef(null);

    const storageKey = useMemo(() => (user ? `orders_${user.id}` : null), [user]);

    // Load order on mount/user change
    useEffect(() => {
        if (!storageKey || !orderId) return;

        const orders = JSON.parse(localStorage.getItem(storageKey)) || [];
        const foundOrder = orders.find((o) => o.id === orderId);

        if (foundOrder) {
            // Normalize items
            const normalizedItems = (foundOrder.items || []).map((item) => {
                const copy = { ...item };
                if (!copy.expectedDelivery) {
                    const days = Math.floor(Math.random() * 5) + 3;
                    const deliveryDate = new Date();
                    deliveryDate.setDate(deliveryDate.getDate() + days);
                    copy.expectedDelivery = deliveryDate.toDateString();
                }
                if (typeof copy.statusIndex !== "number") {
                    copy.statusIndex = 0;
                }
                return copy;
            });

            const normalizedOrder = { ...foundOrder, items: normalizedItems };

            // Persist normalization
            const idx = orders.findIndex((o) => o.id === orderId);
            if (idx !== -1) {
                orders[idx] = normalizedOrder;
                localStorage.setItem(storageKey, JSON.stringify(orders));
            }

            setOrder(normalizedOrder);
        }
    }, [storageKey, orderId]);

    // Auto-update status every 5 seconds
    useEffect(() => {
        if (!order || !storageKey || !orderId) return;

        intervalRef.current = setInterval(() => {
            setOrder((prevOrder) => {
                if (!prevOrder) return prevOrder;

                const allFinal = (prevOrder.items || []).every(
                    (it) => it.statusIndex === -1 || it.statusIndex >= statuses.length - 1
                );

                if (allFinal) {
                    clearInterval(intervalRef.current);
                    return prevOrder;
                }

                const updatedItems = prevOrder.items.map((item) => {
                    if (item.statusIndex === -1) return item; // cancelled
                    if (item.statusIndex < statuses.length - 1) {
                        return { ...item, statusIndex: item.statusIndex + 1 };
                    }
                    return item;
                });

                const updatedOrder = { ...prevOrder, items: updatedItems };

                // Persist to localStorage
                const orders = JSON.parse(localStorage.getItem(storageKey)) || [];
                const idx = orders.findIndex((o) => o.id === orderId);
                if (idx !== -1) {
                    orders[idx] = updatedOrder;
                    localStorage.setItem(storageKey, JSON.stringify(orders));
                }

                return updatedOrder;
            });
        }, 5000);

        return () => clearInterval(intervalRef.current);
    }, [order, storageKey, orderId]);

    if (!user) return <p className="text-center mt-4">Please login to track your order.</p>;
    if (!order) return <p className="text-center mt-4">Order not found!</p>;

    // ✅ If itemId exists, filter to that single item
    const itemsToShow = itemId
        ? order.items.filter((item) => item.orderItemId === itemId)
        : order.items;

    if (!itemsToShow || itemsToShow.length === 0) {
        return <p className="text-center mt-4">⚠️ No tracking info available for this item.</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>
                Tracking Order: {orderId} {itemId ? `(Item: ${itemId})` : ""}
            </h2>
            {itemsToShow.map((item) => (
                <div
                    key={item.orderItemId}
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        padding: "15px",
                        marginBottom: "15px",
                    }}
                >
                    <h4>{item.name}</h4>
                    <p>
                        Expected Delivery: <strong>{item.expectedDelivery}</strong>
                    </p>

                    {/* Progress bar */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        {statuses.map((status, index) => (
                            <div key={index} style={{ textAlign: "center", flex: 1 }}>
                                <div
                                    style={{
                                        height: "10px",
                                        backgroundColor: index <= item.statusIndex ? "#4caf50" : "#ddd",
                                        margin: "0 2px",
                                        borderRadius: "5px",
                                    }}
                                />
                                <small>{status}</small>
                            </div>
                        ))}
                    </div>

                    {item.statusIndex === -1 && (
                        <p className="text-danger"><strong>Cancelled:</strong> {item.cancelReason}</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TrackOrderPage;

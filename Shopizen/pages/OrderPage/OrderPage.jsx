import React, { useContext, useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
import { useToast } from "../../components/context/ToastContext";
import Navbar from "../../components/Navbar/Navbar";
import { useNotifications } from "../../components/context/NotificationContext";
import "./Order.css";

const OrderPage = () => {
    const { user } = useContext(AuthContext);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const { addNotification } = useNotifications();

    const [orders, setOrders] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [reason, setReason] = useState("");
    const [actionType, setActionType] = useState(""); // cancel | return

    const storageKey = useMemo(() => (user ? `orders_${user.id}` : null), [user]);

    // 🔄 Load orders from localStorage
    const loadOrders = () => {
        if (!storageKey) return;
        try {
            const loaded = JSON.parse(localStorage.getItem(storageKey)) || [];
            loaded.sort((a, b) => b.id.localeCompare(a.id));
            setOrders(loaded);
        } catch {
            setOrders([]);
        }
    };

    // Initial load
    useEffect(() => {
        loadOrders();
    }, [storageKey]);

    // 🔥 Listen to localStorage changes from other tabs/components
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === storageKey) {
                loadOrders(); // refresh orders
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [storageKey]);

    if (!user) {
        addNotification("Please login first to place an order.", "error");
        navigate("/login-email");
        return null;
    }

    const saveOrders = (updated) => {
        updated.sort((a, b) => b.id.localeCompare(a.id));
        localStorage.setItem(storageKey, JSON.stringify(updated));
        setOrders(updated);
    };

    const openModal = (orderId, itemId, type) => {
        setSelectedOrderId(orderId);
        setSelectedItemId(itemId);
        setActionType(type);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedOrderId(null);
        setSelectedItemId(null);
        setReason("");
        setActionType("");
        setModalOpen(false);
    };

    const confirmAction = () => {
        if (!reason.trim()) {
            showToast("Please provide a reason", "error");
            return;
        }

        const updatedOrders = orders.map((order) => {
            if (order.id === selectedOrderId) {
                return {
                    ...order,
                    items: order.items.map((item) => {
                        if (item.orderItemId === selectedItemId) {
                            return {
                                ...item,
                                statusIndex: -1, // mark as cancelled/returned
                                action: actionType,
                                reason,
                            };
                        }
                        return item;
                    }),
                };
            }
            return order;
        });

        saveOrders(updatedOrders);
        showToast(
            actionType === "return"
                ? "Return request submitted successfully!"
                : "Order cancelled successfully!",
            "success"
        );
        closeModal();
    };

    return (
        <>
            <Navbar />
            <div className="mx-4 my-4">
                <h2 className="mb-4">My Orders</h2>

                {orders.length === 0 ? (
                    <div className="alert alert-info">No orders found.</div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="card shadow-sm mb-4 order-card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <span>
                                    <strong>Order ID:</strong> {order.id}
                                </span>
                                <span className="badge bg-primary">
                                    {order.items?.[0]?.statusIndex === -1
                                        ? order.items?.[0]?.action === "return"
                                            ? "Returned"
                                            : "Cancelled"
                                        : ["Placed", "Confirmed", "Shipped", "Delivered"][
                                        order.items?.[0]?.statusIndex || 0
                                        ]}
                                </span>
                            </div>
                            <div className="card-body">
                                {order.items?.map((item) => (
                                    <div
                                        key={item.orderItemId}
                                        className="d-flex align-items-center border-bottom pb-2 mb-2"
                                    >
                                        <img
                                            src={item.image || "https://via.placeholder.com/60"}
                                            alt={item.name}
                                            className="img-thumbnail me-3 order-img"
                                        />
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1">{item.name}</h6>
                                            <p className="mb-0 text-muted">
                                                Qty: {item.quantity} | ₹
                                                {(item.price || 0) * (item.quantity || 0)}
                                            </p>

                                            {item.statusIndex !== -1 && (
                                                <div className="mt-2">
                                                    <button
                                                        className="btn btn-primary btn-sm me-2"
                                                        onClick={() =>
                                                            openModal(order.id, item.orderItemId, "cancel")
                                                        }
                                                    >
                                                        Cancel
                                                    </button>
                                                    {item.statusIndex === 3 && (
                                                        <button
                                                            className="btn btn-danger btn-sm me-2"
                                                            onClick={() =>
                                                                openModal(order.id, item.orderItemId, "return")
                                                            }
                                                        >
                                                            Return
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {item.statusIndex === -1 && (
                                                <p className="text-danger mt-1 small">
                                                    <strong>
                                                        {item.action === "return" ? "Returned:" : "Cancelled:"}
                                                    </strong>{" "}
                                                    {item.reason}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div className="d-flex justify-content-between mt-3">
                                    <p className="fw-bold mb-0">
                                        Total Price: ₹
                                        {order.items?.reduce(
                                            (a, c) => a + (c.price || 0) * (c.quantity || 0),
                                            0
                                        )}
                                    </p>
                                    <div>
                                        <Link
                                            to={`/track/${order.id}`}
                                            className="btn btn-primary btn-sm me-2"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            className="btn btn-dark btn-sm"
                                            onClick={() => {
                                                const shareUrl = `${window.location.origin}/track/${order.id}`;
                                                if (navigator.share) {
                                                    navigator
                                                        .share({
                                                            title: "Track My Order",
                                                            text: `Here’s my order tracking link: ${order.id}`,
                                                            url: shareUrl,
                                                        })
                                                        .then(() => showToast("Shared successfully!", "success"))
                                                        .catch(() =>
                                                            showToast("Sharing cancelled or failed", "error")
                                                        );
                                                } else if (navigator.clipboard) {
                                                    navigator.clipboard
                                                        .writeText(shareUrl)
                                                        .then(() =>
                                                            showToast("Sharable tracker link copied!", "success")
                                                        )
                                                        .catch(() => showToast("Failed to copy link!", "error"));
                                                } else {
                                                    showToast("Sharing not supported!", "error");
                                                }
                                            }}
                                        >
                                            Share Tracker
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Cancel / Return Modal */}
            {modalOpen && (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-3 shadow">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {actionType === "return" ? "Return Order" : "Cancel Order"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <label className="form-label">
                                    Reason for {actionType === "return" ? "return" : "cancellation"}:
                                </label>
                                <select
                                    className="form-select mb-3"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                >
                                    <option value="">Select reason</option>
                                    <option value="Ordered by mistake">Ordered by mistake</option>
                                    <option value="Found cheaper elsewhere">Found cheaper elsewhere</option>
                                    <option value="Product not required anymore">
                                        Product not required anymore
                                    </option>
                                    <option value="Delivery taking too long">
                                        Delivery taking too long
                                    </option>
                                    <option value="Damaged/Defective item">Damaged/Defective item</option>
                                    <option value="Other">Other</option>
                                </select>
                                {reason === "Other" && (
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Enter your reason"
                                        onChange={(e) => setReason(e.target.value)}
                                    ></textarea>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={closeModal}>
                                    Close
                                </button>
                                <button className="btn btn-danger" onClick={confirmAction}>
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderPage;

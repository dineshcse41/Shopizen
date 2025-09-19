// src/pages/admin/OrderManagement.js
import React, { useState, useEffect } from "react";
import "./OrderManagement.css";

const OrderManagement = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    // 🔄 Load all orders from localStorage
    const loadOrders = () => {
        const all = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("orders_")) {
                const userOrders = JSON.parse(localStorage.getItem(key)) || [];
                all.push(...userOrders);
            }
        }
        // sort by recent
        all.sort((a, b) => b.id.localeCompare(a.id));
        setAllOrders(all);
    };

    useEffect(() => {
        loadOrders();
    }, []);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key?.startsWith("orders_")) {
                loadOrders();
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Update status manually
    const updateStatus = (orderId, itemId, newStatusIndex) => {
        const updatedOrders = allOrders.map((order) => {
            if (order.id === orderId) {
                return {
                    ...order,
                    items: order.items.map((item) =>
                        item.orderItemId === itemId
                            ? { ...item, statusIndex: newStatusIndex }
                            : item
                    ),
                };
            }
            return order;
        });

        const targetOrder = updatedOrders.find((o) => o.id === orderId);
        if (targetOrder) {
            const userKey = `orders_${targetOrder.userId}`;
            const userOrders = updatedOrders.filter((o) => o.userId === targetOrder.userId);
            localStorage.setItem(userKey, JSON.stringify(userOrders));
        }

        setAllOrders(updatedOrders);
    };

    // ✅ Filtering
    const getFilteredOrders = () => {
        let filtered = [...allOrders];

        if (filter !== "all") {
            filtered = filtered.filter((order) =>
                order.items.some((item) => {
                    if (filter === "cancelled") return item.statusIndex === -1 && item.action === "cancel";
                    if (filter === "returned") return item.statusIndex === -1 && item.action === "return";
                    if (filter === "delivered") return item.statusIndex === 3;
                    if (filter === "pending") return item.statusIndex >= 0 && item.statusIndex < 3;
                    return true;
                })
            );
        }

        if (search.trim() !== "") {
            filtered = filtered.filter(
                (o) =>
                    o.id.toLowerCase().includes(search.toLowerCase()) ||
                    o.userId.toLowerCase().includes(search.toLowerCase())
            );
        }

        return filtered;
    };

    // ✅ Export CSV
    const exportToCSV = () => {
        const rows = [
            ["Order ID", "User ID", "Product", "Quantity", "Status"],
            ...allOrders.flatMap((order) =>
                order.items.map((item) => [
                    order.id,
                    order.userId,
                    item.name,
                    item.quantity,
                    item.statusIndex === -1
                        ? item.action === "return"
                            ? "Returned"
                            : "Cancelled"
                        : ["Placed", "Confirmed", "Shipped", "Delivered"][item.statusIndex || 0],
                ])
            ),
        ];

        const csvContent =
            "data:text/csv;charset=utf-8," +
            rows.map((e) => e.join(",")).join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "orders_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredOrders = getFilteredOrders();

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Admin Order Management</h2>

            {/* Controls */}
            <div className="d-flex justify-content-between mb-3">
                <div>
                    <select
                        className="form-select d-inline w-auto me-2"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="returned">Returned</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search Order/User ID"
                        className="form-control d-inline w-auto"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="btn btn-success" onClick={exportToCSV}>
                    Export CSV
                </button>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="alert alert-info">No orders found.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Order ID</th>
                                <th>User ID</th>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) =>
                                order.items.map((item) => (
                                    <tr key={item.orderItemId}>
                                        <td>{order.id}</td>
                                        <td>{order.userId}</td>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>
                                            {item.statusIndex === -1
                                                ? item.action === "return"
                                                    ? "Returned"
                                                    : "Cancelled"
                                                : ["Placed", "Confirmed", "Shipped", "Delivered"][
                                                item.statusIndex || 0
                                                ]}
                                        </td>
                                        <td>
                                            {item.statusIndex >= 0 && item.statusIndex < 3 && (
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() =>
                                                        updateStatus(
                                                            order.id,
                                                            item.orderItemId,
                                                            item.statusIndex + 1
                                                        )
                                                    }
                                                >
                                                    Next Step
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )
            }
        </div >
    );
};

export default OrderManagement;

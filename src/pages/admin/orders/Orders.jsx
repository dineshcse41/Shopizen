import React, { useState, useMemo } from "react";
import Table from "../../../components/admin/Table";
import { useData } from "../../../components/context/DataContext";
import { Link } from "react-router-dom";

// --- Currency symbol map ---
const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useData();

  // --- Filter state ---
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // --- Get unique payment methods dynamically from orders ---
  const paymentMethods = useMemo(() => {
    const methods = orders
      .map((o) => o.paymentType)
      .filter((v) => v && v.trim() !== ""); // remove empty/null
    return Array.from(new Set(methods)); // unique values only
  }, [orders]);

  // --- Filtered orders using useMemo for performance ---
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter ? order.status === statusFilter : true;
      const matchesPayment = paymentFilter
        ? order.paymentType === paymentFilter
        : true;
      const matchesSearch = searchQuery
        ? order.customer.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesStatus && matchesPayment && matchesSearch;
    });
  }, [orders, statusFilter, paymentFilter, searchQuery]);

  const cols = [
    { key: "orderId", title: "Order ID" },
    { key: "customer", title: "User" },
    {
      key: "total",
      title: "Total",
      render: (r) => {
        const symbol = currencySymbols[r.currency] || r.currency;
        const formattedAmount = r.total?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return `${symbol}${formattedAmount}`;
      },
    },
    { key: "status", title: "Status" },
    {
      key: "paymentMethod",
      title: "Payment Method",
      render: (r) => r.paymentType || "N/A",
    },
    {
      key: "createdAt",
      title: "Date",
      render: (r) => new Date(r.createdAt).toLocaleDateString() || "N/A",
    },
    {
      key: "actions",
      title: "Actions",
      render: (r) => (
        <div className="d-flex gap-2">
          <Link
            to={`/admin/order/${r.orderId}`}
            className="btn btn-sm btn-outline-secondary"
          >
            <i className="bi bi-eye-fill"></i>
          </Link>
          <select
            value={r.status}
            onChange={(e) => updateOrderStatus(r.orderId, e.target.value)}
            className="btn btn-sm btn-outline-secondary"
          >
            {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
              (s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              )
            )}
          </select>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="fw-bold mb-4 mb-md-0">Orders</h2>

      {/* --- Filters --- */}
      <div className="d-flex flex-wrap gap-2 mt-2 mb-3">
        <input
          type="text"
          placeholder="Search by user"
          className="form-control"
          style={{ width: "200px" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="form-select"
          style={{ width: "150px" }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
            (s) => (
              <option key={s} value={s}>
                {s}
              </option>
            )
          )}
        </select>

        <select
          className="form-select"
          style={{ width: "150px" }}
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="">All Payments</option>
          {paymentMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </div>

      <Table columns={cols} data={filteredOrders} />
    </div>
  );
}

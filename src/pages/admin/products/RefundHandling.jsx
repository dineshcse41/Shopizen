// src/pages/admin/orders/RefundHandling.jsx
import React, { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import Table from "../../../components/admin/Table";

import paymentsData from "../../../data/orders/payments.json";
import ordersData from "../../../data/orders/orders.json";
import usersData from "../../../data/users/users.json";

export default function RefundHandling() {
  const [refunds, setRefunds] = useState([]);

  // --- Filter states ---
  const [statusFilter, setStatusFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [orderFilter, setOrderFilter] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // ============================
  // Merge and prepare refund data
  // ============================
  useEffect(() => {
    const merged = paymentsData.map((payment) => {
      const order = ordersData.find((o) => o.orderId === payment.orderId);
      const user = usersData.find((u) => u.id === order?.userId);

      return {
        id: payment.id,
        orderId: payment.orderId,
        user: user ? user.name : "Unknown User",
        amount: payment.amount,
        status: payment.status === "paid" ? "pending" : payment.status,
        reason:
          payment.status === "pending"
            ? "Customer requested refund due to delay"
            : "Refund processed",
      };
    });
    setRefunds(merged);
  }, []);

  // ============================
  // Update refund status
  // ============================
  const updateStatus = (id, newStatus) => {
    setRefunds((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );

    Swal.fire({
      icon: newStatus === "approved" ? "success" : "warning",
      title:
        newStatus === "approved"
          ? "Refund Approved"
          : "Refund Request Rejected",
      text:
        newStatus === "approved"
          ? "The refund has been successfully processed."
          : "The refund request has been rejected.",
      showConfirmButton: false,
      timer: 1800,
    });
  };

  // ============================
  // Filtered refunds
  // ============================
  const filteredRefunds = useMemo(() => {
    return refunds.filter((r) => {
      const matchesStatus =
        !statusFilter || r.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesUser =
        !userFilter ||
        r.user.toLowerCase().includes(userFilter.toLowerCase().trim());

      const matchesOrderId =
        !orderFilter || r.orderId.toString().includes(orderFilter.trim());

      const matchesAmount =
        (!minAmount || r.amount >= parseFloat(minAmount)) &&
        (!maxAmount || r.amount <= parseFloat(maxAmount));

      return matchesStatus && matchesUser && matchesOrderId && matchesAmount;
    });
  }, [refunds, statusFilter, userFilter, orderFilter, minAmount, maxAmount]);

  // ============================
  // Table columns
  // ============================
  const columns = [
    { key: "id", title: "ID" },
    { key: "orderId", title: "Order ID" },
    { key: "user", title: "User" },
    { key: "reason", title: "Reason" },
    { key: "amount", title: "Amount (₹)", render: (r) => `₹${r.amount}` },
    {
      key: "status",
      title: "Status",
      render: (r) => (
        <span
          className={`badge rounded-pill ${
            r.status === "approved"
              ? "bg-success"
              : r.status === "rejected"
              ? "bg-danger"
              : "bg-warning text-dark"
          }`}
        >
          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (r) => (
        <div className="d-flex gap-2">
          {r.status !== "approved" && (
            <button
              className="btn btn-success btn-sm px-3"
              onClick={() => updateStatus(r.id, "approved")}
            >
              Approve
            </button>
          )}
          {r.status !== "rejected" && (
            <button
              className="btn btn-danger btn-sm px-3"
              onClick={() => updateStatus(r.id, "rejected")}
            >
              Reject
            </button>
          )}
        </div>
      ),
    },
  ];

  // ============================
  // Render
  // ============================
  return (
    <div className="p-4">
      <h2 className="fw-bold mb-4">Refund Handling</h2>

      {/* --- Filters --- */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {/* Status Filter */}
        <select
          className="form-select"
          style={{ width: "180px" }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          {["Pending", "Approved", "Rejected"].map((s) => (
            <option key={s} value={s.toLowerCase()}>
              {s}
            </option>
          ))}
        </select>

        {/* User Filter (live-searchable) */}
        <input
          type="text"
          className="form-control"
          placeholder="Search User"
          style={{ width: "180px" }}
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
        />

        {/* Order ID Filter */}
        <input
          type="text"
          className="form-control"
          placeholder="Order ID"
          style={{ width: "140px" }}
          value={orderFilter}
          onChange={(e) => setOrderFilter(e.target.value)}
        />

        {/* Amount Filters */}
        <input
          type="number"
          className="form-control"
          placeholder="Min Amount"
          style={{ width: "120px" }}
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Max Amount"
          style={{ width: "120px" }}
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
        />

        {/* Reset Button */}
        <button
          className="btn btn-secondary"
          onClick={() => {
            setStatusFilter("");
            setUserFilter("");
            setOrderFilter("");
            setMinAmount("");
            setMaxAmount("");
          }}
        >
          Reset
        </button>
      </div>

      {/* --- Table --- */}
      <Table columns={columns} data={filteredRefunds} />
    </div>
  );
}

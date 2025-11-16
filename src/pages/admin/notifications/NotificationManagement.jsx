// src/pages/admin/NotificationManagement.jsx
import React, { useState, useMemo } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import Table from "../../../components/admin/Table";
import Swal from "sweetalert2";
import notificationsData from "../../../data/notifications/notifications.json";
import "./NotificationManagement.css";

export default function NotificationManagement() {
  const [notifications, setNotifications] = useState(
    notificationsData.map((n) => ({ ...n, status: "Unread" }))
  );
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Latest");

  // Add Notification
  const addNotification = () => {
    if (!title || !message)
      return Swal.fire("Error", "Enter title and message", "error");
    const newNotification = {
      id: notifications.length + 1,
      title,
      message,
      status: "Unread",
      createdAt: new Date().toISOString(),
    };
    setNotifications([newNotification, ...notifications]);
    setTitle("");
    setMessage("");
  };

  // Delete with SweetAlert2
  const deleteNotification = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This notification will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setNotifications(notifications.filter((n) => n.id !== id));
      Swal.fire({
        title: "Deleted!",
        text: "The notification has been removed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // Toggle Read/Unread
  const toggleStatus = (id) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id
          ? { ...n, status: n.status === "Unread" ? "Read" : "Unread" }
          : n
      )
    );
  };

  // Filter and Sort
  const filteredNotifications = useMemo(() => {
    let data = [...notifications];
    if (filterStatus !== "All")
      data = data.filter((n) => n.status === filterStatus);
    data.sort((a, b) => {
      if (sortOrder === "Latest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
    return data;
  }, [notifications, filterStatus, sortOrder]);

  const columns = [
    { key: "id", title: "ID" },
    { key: "title", title: "Title" },
    { key: "message", title: "Message" },
    {
      key: "status",
      title: "Status",
      render: (n) => (
        <span
          className={`status-tag ${n.status.toLowerCase()}`}
          onClick={() => toggleStatus(n.id)}
          style={{ cursor: "pointer" }}
        >
          {n.status}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (n) => (
        <button
          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
          onClick={() => deleteNotification(n.id)}
        >
          <FaTrash /> Delete
        </button>
      ),
    },
  ];

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-center">Notification Management</h2>

      {/* Add Notification Form */}
      <div className="add-notification-card mb-3 p-3 shadow-sm rounded">
        <div className="d-flex flex-column flex-md-row gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Notification Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Notification Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="btn btn-primary d-flex align-items-center gap-1"
            onClick={addNotification}
          >
            <FaPlus /> Add Notification
          </button>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="d-flex flex-column flex-md-row gap-2 mb-3">
        <select
          className="form-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Unread">Unread</option>
          <option value="Read">Read</option>
        </select>

        <select
          className="form-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="Latest">Sort by Latest</option>
          <option value="Oldest">Sort by Oldest</option>
        </select>
      </div>

      {/* Notification Table */}
      <Table columns={columns} data={filteredNotifications} />
    </div>
  );
}

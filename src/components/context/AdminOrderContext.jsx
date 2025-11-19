// src/components/context/AdminOrderNotificationContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import orderData from "../../data/notifications/adminOrderNotifications.json";

// Create Context
const AdminOrderNotificationContext = createContext();

// Provider Component
export const AdminOrderNotificationProvider = ({ children }) => {
  const [adminOrders, setAdminOrders] = useState([]);

  // Load from localStorage or fallback to JSON
  useEffect(() => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem("adminOrders"));
      if (Array.isArray(storedOrders) && storedOrders.length > 0) {
        setAdminOrders(storedOrders);
      } else {
        setAdminOrders(orderData);
        localStorage.setItem("adminOrders", JSON.stringify(orderData));
      }
    } catch (error) {
      console.error("Error loading admin orders:", error);
      setAdminOrders(orderData);
    }
  }, []);

  // ✅ Mark single order as read
  const markOrderAsRead = (id) => {
    const updatedOrders = adminOrders.map((order) =>
      order.id === id ? { ...order, isRead: true } : order
    );
    setAdminOrders(updatedOrders);
    localStorage.setItem("adminOrders", JSON.stringify(updatedOrders));
  };

  // ✅ Mark all orders as read
  const markAllOrdersAsRead = () => {
    const updatedOrders = adminOrders.map((order) => ({
      ...order,
      isRead: true,
    }));
    setAdminOrders(updatedOrders);
    localStorage.setItem("adminOrders", JSON.stringify(updatedOrders));
  };

  // ✅ Unread count badge
  const unreadOrderCount = adminOrders.filter((o) => !o.isRead).length;

  // Provide context values
  return (
    <AdminOrderNotificationContext.Provider
      value={{
        adminOrders,
        markOrderAsRead,
        markAllOrdersAsRead,
        unreadOrderCount,
      }}
    >
      {children}
    </AdminOrderNotificationContext.Provider>
  );
};

// Custom Hook
export const useAdminOrderNotifications = () => {
  const context = useContext(AdminOrderNotificationContext);
  if (!context) {
    throw new Error(
      "useAdminOrderNotifications must be used within AdminOrderNotificationProvider"
    );
  }
  return context;
};

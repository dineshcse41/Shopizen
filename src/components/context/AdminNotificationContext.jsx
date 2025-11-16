import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { AuthContext } from "./AuthContext";
import adminNotificationsData from "../../data/notifications/adminNotifications.json";

const AdminNotificationContext = createContext();

export const AdminNotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [adminNotifications, setAdminNotifications] = useState([]);

  // Load notifications from localStorage or fallback to JSON
  useEffect(() => {
    if (user) {
      try {
        const storageKey = `admin_notifications_${user.id}`;
        const savedData = JSON.parse(localStorage.getItem(storageKey));

        if (savedData && savedData.length > 0) {
          setAdminNotifications(savedData);
        } else {
          setAdminNotifications(adminNotificationsData);
        }
      } catch (error) {
        console.error("Error loading admin notifications:", error);
        setAdminNotifications(adminNotificationsData);
      }
    }
  }, [user]);

  // Save notifications to localStorage
  useEffect(() => {
    if (user) {
      const storageKey = `admin_notifications_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(adminNotifications));
    }
  }, [adminNotifications, user]);

  const addNotification = (title, message, type = "info") => {
    const newNotification = {
      notificationId: Date.now(),
      title,
      message,
      type,
      isRead: false,
      timestamp: new Date().toISOString(),
    };
    setAdminNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id) => {
    setAdminNotifications((prev) =>
      prev.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setAdminNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = useMemo(
    () => adminNotifications.filter((n) => !n.isRead).length,
    [adminNotifications]
  );

  return (
    <AdminNotificationContext.Provider
      value={{
        adminNotifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        unreadCount,
      }}
    >
      {children}
    </AdminNotificationContext.Provider>
  );
};

export const useAdminNotifications = () => useContext(AdminNotificationContext);

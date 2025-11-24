import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { AuthContext } from "./AuthContext";
import userData from "../../data/users/notifications.json";
import globalData from "../../data/notifications/globalNotifications.json";

const UserNotificationContext = createContext();

export const UserNotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [personalNotifs, setPersonalNotifs] = useState([]);
  const [globalNotifs, setGlobalNotifs] = useState([]);

  // Load notifications
  useEffect(() => {
    try {
      const savedGlobal = JSON.parse(
        localStorage.getItem("global_notifications")
      );
      if (Array.isArray(savedGlobal) && savedGlobal.length > 0) {
        setGlobalNotifs(savedGlobal);
      } else {
        // If empty or invalid, use fallback JSON
        setGlobalNotifs(globalData);
        localStorage.setItem(
          "global_notifications",
          JSON.stringify(globalData)
        );
      }

      if (user) {
        const storageKey = `notifications_user_${
          user.email || user.mobile || user.id
        }`;
        const savedPersonal =
          JSON.parse(localStorage.getItem(storageKey)) || userData;
        setPersonalNotifs(savedPersonal);
      } else {
        setPersonalNotifs([]);
      }
    } catch (e) {
      console.error("Failed to load notifications:", e);
      setGlobalNotifs(globalData);
      setPersonalNotifs([]);
    }
  }, [user]);


  // Save personal notifications
  useEffect(() => {
    if (user) {
      const storageKey = `notifications_user_${
        user.email || user.mobile || user.id
      }`;
      localStorage.setItem(storageKey, JSON.stringify(personalNotifs));
    }
  }, [personalNotifs, user]);

  // Save global notifications
  useEffect(() => {
    localStorage.setItem("global_notifications", JSON.stringify(globalNotifs));
  }, [globalNotifs]);

  const addNotification = (message, type = "info", orderId = null) => {
    if (!user) return;

    setPersonalNotifs((prev) => {
      if (orderId && prev.some((n) => n.orderId === orderId)) return prev;
      return [
        {
          id: Date.now(),
          orderId,
          message,
          type,
          isRead: false,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  };

  const markAsRead = (id, isGlobal = false) => {
    if (isGlobal) {
      setGlobalNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } else if (user) {
      setPersonalNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    }
  };

  const markAllAsRead = () => {
    setGlobalNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
    if (user) {
      setPersonalNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  const deleteNotification = (id, isGlobal = false) => {
    if (isGlobal) {
      setGlobalNotifs((prev) => prev.filter((n) => n.id !== id));
    } else if (user) {
      setPersonalNotifs((prev) => prev.filter((n) => n.id !== id));
    }
  };

  // Merge notifications
  const notifications = useMemo(() => {
    const normalizedGlobal = globalNotifs.map((n) => ({
      ...n,
      timestamp: n.timestamp || n.date,
      isRead: n.isRead ?? n.read ?? false,
      isGlobal: true,
    }));

    const normalizedPersonal = personalNotifs.map((n) => ({
      ...n,
      timestamp: n.timestamp || n.date,
      isRead: n.isRead ?? n.read ?? false,
      isGlobal: false,
    }));

    return [...normalizedGlobal, ...normalizedPersonal].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [personalNotifs, globalNotifs]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  return (
    <UserNotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        unreadCount,
      }}
    >
      {children}
    </UserNotificationContext.Provider>
  );
};

export const useUserNotifications = () => useContext(UserNotificationContext);

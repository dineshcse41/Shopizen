import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import adminData from "../../data/notifications/adminNotifications.json";

const AdminNotificationContext = createContext();

export const AdminNotificationProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [adminNotifs, setAdminNotifs] = useState([]);

    useEffect(() => {
        if (user && user.role === "admin") {
            try {
                const storageKey = `notifications_admin_${user.id}`;
                let savedAdmin = JSON.parse(localStorage.getItem(storageKey));
                if (!savedAdmin) savedAdmin = adminData;
                setAdminNotifs(savedAdmin);
            } catch (e) {
                console.error("Failed to load admin notifications:", e);
                setAdminNotifs([]);
            }
        }
    }, [user]);

    useEffect(() => {
        if (user && user.role === "admin") {
            const storageKey = `notifications_admin_${user.id}`;
            localStorage.setItem(storageKey, JSON.stringify(adminNotifs));
        }
    }, [adminNotifs, user]);

    const addAdminNotification = (message, type = "info") => {
        setAdminNotifs(prev => [{ id: Date.now(), message, type, isRead: false, timestamp: new Date().toISOString() }, ...prev]);
    };

    const markAsRead = (id) => {
        setAdminNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllAsRead = () => {
        setAdminNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const unreadCount = useMemo(() => adminNotifs.filter(n => !n.isRead).length, [adminNotifs]);

    return (
        <AdminNotificationContext.Provider value={{ adminNotifs, addAdminNotification, markAsRead, markAllAsRead, unreadCount }}>
            {children}
        </AdminNotificationContext.Provider>
    );
};

export const useAdminNotifications = () => useContext(AdminNotificationContext);

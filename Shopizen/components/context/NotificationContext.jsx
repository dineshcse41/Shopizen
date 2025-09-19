import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { AuthContext } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    //  Load notifications from localStorage when user logs in
    useEffect(() => {
        if (user) {
            try {
                const saved = JSON.parse(localStorage.getItem(`notifications_${user.id}`)) || [];
                setNotifications(saved);
            } catch (e) {
                console.error("Failed to parse notifications:", e);
            }
        } else {
            setNotifications([]);
        }
    }, [user]);

    //  Persist notifications per user in localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
        }
    }, [notifications, user]);

    //  Add new notification (default unread)
    const addNotification = (message, type = "info", orderId = null) => {
        setNotifications((prev) => {
            if (orderId && prev.some((n) => n.orderId === orderId)) return prev; // prevent duplicate
            const newNotif = {
                id: Date.now(),
                orderId,
                message,
                type,
                isRead: false,
                timestamp: new Date().toISOString(),
            };
            return [newNotif, ...prev];
        });
    };


    //  Mark a single notification as read
    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, isRead: true } : n
            )
        );
    };

    //  Mark all as read
    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    //  Unread count
    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.isRead).length,
        [notifications]
    );

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                markAsRead,
                markAllAsRead,
                unreadCount
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
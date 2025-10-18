import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import userData from "../../data/notifications/userNotifications.json";
import globalData from "../../data/notifications/globalNotifications.json";

const UserNotificationContext = createContext();

export const UserNotificationProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [personalNotifs, setPersonalNotifs] = useState([]);
    const [globalNotifs, setGlobalNotifs] = useState([]);

    // Load notifications
    useEffect(() => {
        try {
            // Global notifications (always available)
            const savedGlobal = JSON.parse(localStorage.getItem("global_notifications")) || globalData;
            setGlobalNotifs(savedGlobal);

            // Personal notifications (only if user logged in)
            if (user) {
                const storageKey = `notifications_user_${user.email || user.mobile || user.id}`;
                const savedPersonal = JSON.parse(localStorage.getItem(storageKey)) || userData;
                setPersonalNotifs(savedPersonal);
            } else {
                setPersonalNotifs([]); // no personal notifications for guests
            }
        } catch (e) {
            console.error("Failed to load notifications:", e);
            setGlobalNotifs(globalData);
            setPersonalNotifs([]);
        }
    }, [user]);

    // Save personal notifications when they change
    useEffect(() => {
        if (user) {
            const storageKey = `notifications_user_${user.email || user.mobile || user.id}`;
            localStorage.setItem(storageKey, JSON.stringify(personalNotifs));
        }
    }, [personalNotifs, user]);

    // Save global notifications
    useEffect(() => {
        localStorage.setItem("global_notifications", JSON.stringify(globalNotifs));
    }, [globalNotifs]);

    const addNotification = (message, type = "info", orderId = null) => {
        if (!user) return; // only allow adding personal notifications if logged in

        setPersonalNotifs(prev => {
            if (orderId && prev.some(n => n.orderId === orderId)) return prev;
            return [
                { id: Date.now(), orderId, message, type, isRead: false, timestamp: new Date().toISOString() },
                ...prev
            ];
        });
    };

    const markAsRead = (id, isGlobal = false) => {
        if (isGlobal) {
            setGlobalNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } else if (user) {
            setPersonalNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        }
    };

    const markAllAsRead = () => {
        setGlobalNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
        if (user) {
            setPersonalNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
        }
    };

    // Merge notifications (personal only if user logged in)
    const notifications = useMemo(() => {
        return [...globalNotifs, ...personalNotifs].sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
    }, [personalNotifs, globalNotifs]);

    const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

    return (
        <UserNotificationContext.Provider
            value={{ notifications, addNotification, markAsRead, markAllAsRead, unreadCount }}
        >
            {children}
        </UserNotificationContext.Provider>
    );
};

export const useUserNotifications = () => useContext(UserNotificationContext);

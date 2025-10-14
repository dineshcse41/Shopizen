import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import userData from "../../data/notifications/userNotifications.json";
import globalData from "../../data/notifications/globalNotifications.json";

const UserNotificationContext = createContext();

export const UserNotificationProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [personalNotifs, setPersonalNotifs] = useState([]);
    const [globalNotifs, setGlobalNotifs] = useState([]);

    useEffect(() => {
        if (user && user.role !== "admin") {
            try {
                const storageKey = `notifications_user_${user.id}`;
                let savedPersonal = JSON.parse(localStorage.getItem(storageKey));
                if (!savedPersonal) savedPersonal = userData;
                setPersonalNotifs(savedPersonal);

                let savedGlobal = JSON.parse(localStorage.getItem("global_notifications"));
                if (!savedGlobal) savedGlobal = globalData;
                setGlobalNotifs(savedGlobal);

            } catch (e) {
                console.error("Failed to load notifications:", e);
                setPersonalNotifs([]);
                setGlobalNotifs([]);
            }
        }
    }, [user]);

    useEffect(() => {
        if (user && user.role !== "admin") {
            const storageKey = `notifications_user_${user.id}`;
            localStorage.setItem(storageKey, JSON.stringify(personalNotifs));
        }
    }, [personalNotifs, user]);

    useEffect(() => {
        localStorage.setItem("global_notifications", JSON.stringify(globalNotifs));
    }, [globalNotifs]);

    const addNotification = (message, type = "info", orderId = null) => {
        setPersonalNotifs(prev => {
            if (orderId && prev.some(n => n.orderId === orderId)) return prev;
            return [{ id: Date.now(), orderId, message, type, isRead: false, timestamp: new Date().toISOString() }, ...prev];
        });
    };

    const markAsRead = (id, isGlobal = false) => {
        if (isGlobal) {
            setGlobalNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } else {
            setPersonalNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        }
    };

    const markAllAsRead = () => {
        setPersonalNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
        setGlobalNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const notifications = useMemo(() => [...globalNotifs, ...personalNotifs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)), [personalNotifs, globalNotifs]);

    const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

    return (
        <UserNotificationContext.Provider value={{ notifications, addNotification, markAsRead, markAllAsRead, unreadCount }}>
            {children}
        </UserNotificationContext.Provider>
    );
};

export const useUserNotifications = () => useContext(UserNotificationContext);

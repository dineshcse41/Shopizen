import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { useToast } from "./ToastContext";

export const AuthContext = createContext();

const LOGGED_USER_KEY = "loggedInUser_v2"; // bump key to avoid collisions

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [sessionMeta, setSessionMeta] = useState(null); // { idleExpiresAt, absoluteExpiresAt }
    const { showToast } = useToast();
    const activityEventsRef = useRef(null);
    const checkIntervalRef = useRef(null);

    // Helper: build storage object
    const createStoredObject = (userData, meta) => ({ user: userData, meta });

    // Default config
    const DEFAULT_IDLE_MINUTES = 15; // idle timeout
    const DEFAULT_ABSOLUTE_HOURS = 8; // absolute session lifetime

    // Utility: check expired
    const isExpired = (meta) => {
        if (!meta) return true;
        const now = Date.now();
        return now >= (meta.idleExpiresAt || 0) || now >= (meta.absoluteExpiresAt || 0);
    };

    // Startup: load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(LOGGED_USER_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed && parsed.user && parsed.meta && !isExpired(parsed.meta)) {
                    setUser(parsed.user);
                    setSessionMeta(parsed.meta);
                } else {
                    localStorage.removeItem(LOGGED_USER_KEY);
                }
            } catch (err) {
                console.error("Failed to parse stored user", err);
                localStorage.removeItem(LOGGED_USER_KEY);
            }
        }
    }, []);

    // Start / stop background check interval and activity listeners when user/sessionMeta changes
    useEffect(() => {
        // Clear previous
        if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
        }
        if (activityEventsRef.current) {
            const { removeListeners } = activityEventsRef.current;
            removeListeners();
            activityEventsRef.current = null;
        }

        if (user && sessionMeta) {
            // 1) periodic expiry checker (every 10s)
            checkIntervalRef.current = setInterval(() => {
                if (isExpired(sessionMeta)) {
                    // expire
                    showToast("Session expired. Please log in again.", "info");
                    logout(true); // true => expired flag
                }
            }, 10_000);

            // 2) activity listeners
            const events = ["mousemove", "keydown", "touchstart", "click"];
            const handleActivity = () => {
                extendIdleTimeout();
            };
            events.forEach((ev) => window.addEventListener(ev, handleActivity));
            activityEventsRef.current = {
                removeListeners: () =>
                    events.forEach((ev) => window.removeEventListener(ev, handleActivity)),
            };
        }

        return () => {
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
                checkIntervalRef.current = null;
            }
            if (activityEventsRef.current) {
                activityEventsRef.current.removeListeners();
                activityEventsRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, sessionMeta]);

    // Extend idle timeout on activity
    const extendIdleTimeout = (idleMinutes = DEFAULT_IDLE_MINUTES) => {
        setSessionMeta((prev) => {
            if (!prev) return prev;
            const newMeta = {
                ...prev,
                idleExpiresAt: Date.now() + idleMinutes * 60 * 1000,
            };
            localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(createStoredObject(user, newMeta)));
            return newMeta;
        });
    };

    // Public login
    const login = (userData, config = {}) => {
        if (!userData || (!userData.email && !userData.mobile)) {
            showToast("Invalid username or password. Please try again.", "error");
            return false;
        }


        const idleMinutes = config.idleMinutes ?? DEFAULT_IDLE_MINUTES;
        const absoluteHours = config.absoluteHours ?? DEFAULT_ABSOLUTE_HOURS;

        const meta = {
            idleExpiresAt: Date.now() + idleMinutes * 60 * 1000,
            absoluteExpiresAt: Date.now() + absoluteHours * 3600 * 1000,
        };

        setUser(userData);
        setSessionMeta(meta);

        localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(createStoredObject(userData, meta)));
        showToast(`Welcome back, ${userData.name || userData.email}! 🎉`, "success");

        return true;
    };

    // Logout
    const logout = (expired = false) => {
        setUser(null);
        setSessionMeta(null);
        localStorage.removeItem(LOGGED_USER_KEY);

        showToast(expired ? "Session expired. Logged out." : "You have been logged out.", "info");
        // ⚠️ Do NOT navigate here, let the calling component handle redirect
    };

    // Check at any time
    const isSessionActive = () => {
        if (!sessionMeta) return false;
        return !isExpired(sessionMeta);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                extendIdleTimeout,
                isSessionActive,
                sessionMeta,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

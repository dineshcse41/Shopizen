import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { useToast } from "./ToastContext";

export const AuthContext = createContext();

const LOGGED_USER_KEY = "loggedInUser_v2"; // session key

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [sessionMeta, setSessionMeta] = useState(null);
    const { showToast } = useToast();
    const activityEventsRef = useRef(null);
    const checkIntervalRef = useRef(null);

    const DEFAULT_IDLE_MINUTES = 15;
    const DEFAULT_ABSOLUTE_HOURS = 8;

    const createStoredObject = (userData, meta) => ({ user: userData, meta });

    const isExpired = (meta) => {
        if (!meta) return true;
        const now = Date.now();
        return now >= (meta.idleExpiresAt || 0) || now >= (meta.absoluteExpiresAt || 0);
    };

    // --- Load session on startup ---
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
            } catch {
                localStorage.removeItem(LOGGED_USER_KEY);
            }
        }
    }, []);

    // --- Activity listeners & session check ---
    useEffect(() => {
        if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
        if (activityEventsRef.current) {
            activityEventsRef.current.removeListeners();
            activityEventsRef.current = null;
        }

        if (user && sessionMeta) {
            // Periodic expiry check
            checkIntervalRef.current = setInterval(() => {
                if (isExpired(sessionMeta)) {
                    showToast("Session expired. Please log in again.", "info");
                    logout(true);
                }
            }, 10000);

            // Activity events
            const events = ["mousemove", "keydown", "touchstart", "click"];
            const handleActivity = () => extendIdleTimeout();
            events.forEach((ev) => window.addEventListener(ev, handleActivity));
            activityEventsRef.current = {
                removeListeners: () => events.forEach((ev) => window.removeEventListener(ev, handleActivity)),
            };
        }

        return () => {
            if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
            if (activityEventsRef.current) activityEventsRef.current.removeListeners();
        };
    }, [user, sessionMeta]);

    // --- Extend idle timeout ---
    const extendIdleTimeout = (idleMinutes = DEFAULT_IDLE_MINUTES) => {
        setSessionMeta((prev) => {
            if (!prev) return prev;
            const newMeta = { ...prev, idleExpiresAt: Date.now() + idleMinutes * 60 * 1000 };
            localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(createStoredObject(user, newMeta)));
            return newMeta;
        });
    };

    // --- Merge guest cart/wishlist into user ---
    const mergeData = (userKey) => {
        // Cart
        const guestCart = JSON.parse(localStorage.getItem("cart_guest") || "[]");
        const userCartKey = `cart_${userKey}`;
        const existingCart = JSON.parse(localStorage.getItem(userCartKey) || "[]");
        const mergedCart = [...existingCart];
        guestCart.forEach(item => {
            if (!existingCart.find(i => i.id === item.id)) mergedCart.push(item);
        });
        localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
        localStorage.removeItem("cart_guest");

        // Wishlist
        const guestWishlist = JSON.parse(localStorage.getItem("wishlist_guest") || "[]");
        const userWishlistKey = `wishlist_${userKey}`;
        const existingWishlist = JSON.parse(localStorage.getItem(userWishlistKey) || "[]");
        const mergedWishlist = [...existingWishlist];
        guestWishlist.forEach(item => {
            if (!existingWishlist.find(i => i.id === item.id)) mergedWishlist.push(item);
        });
        localStorage.setItem(userWishlistKey, JSON.stringify(mergedWishlist));
        localStorage.removeItem("wishlist_guest");
    };

    // --- Login ---
    const login = (userData, config = {}) => {
        if (!userData || (!userData.email && !userData.mobile && !userData.username)) {
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

        // ✅ Use unique database ID first, fallback to email/mobile/username
        const userKey = userData.id || userData.email || userData.mobile || userData.username;
        mergeData(userKey);

        showToast(`Welcome back, ${userData.name || userData.email || userData.username}! 🎉`, "success");
        return true;
    };


    // --- Logout ---
    const logout = (expired = false) => {
        const userKey = user?.email || user?.mobile || user?.username || user?.id;
        setUser(null);
        setSessionMeta(null);
        localStorage.removeItem(LOGGED_USER_KEY);
      
        showToast(expired ? "Session expired. Logged out." : "You have been logged out.", "info");
    };

    const isSessionActive = () => {
        if (!sessionMeta) return false;
        return !isExpired(sessionMeta);
    };

    return (
        <AuthContext.Provider
            value={{ user, login, logout, extendIdleTimeout, isSessionActive, sessionMeta }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);

    // Load wishlist when user logs in
    useEffect(() => {
        if (user) {
            const storedWishlist = localStorage.getItem(`wishlist_${user.email || user.mobile || user.id}`);
            setWishlist(storedWishlist ? JSON.parse(storedWishlist) : []);
        } else {
            setWishlist([]);
        }
    }, [user]);

    // Save wishlist whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem(`wishlist_${user.email || user.mobile || user.id}`, JSON.stringify(wishlist));
        }
    }, [wishlist, user]);

    const addToWishlist = (product) => {
        if (!user) {
            window.location.href = "/login-email";
            return;
        }

        setWishlist((prev) => {
            if (!prev.find((item) => item.id === product.id)) {
                return [...prev, product];
            }
            return prev;
        });
    };

    const removeFromWishlist = (id) => {
        setWishlist((prev) => prev.filter((item) => item.id !== id));
    };

    const toggleWishlist = (product) => {
        if (!user) {
            window.location.href = "/login-email";
            return;
        }

        setWishlist((prevWishlist) => {
            const isAlreadyInWishlist = prevWishlist.some(item => item.id === product.id);
            return isAlreadyInWishlist
                ? prevWishlist.filter(item => item.id !== product.id)
                : [...prevWishlist, product];
        });
    };

    return (
        <WishlistContext.Provider
            value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

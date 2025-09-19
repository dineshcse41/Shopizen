import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext"; // import AuthContext

export const WishlistContext = createContext(); //Provides a global store for wishlist data.

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const { user } = useContext(AuthContext); // get user from AuthContext

    // Load wishlist from localStorage when user logs in
    useEffect(() => {
        if (user) {
            const storedWishlist = localStorage.getItem(`wishlist_${user.id}`);
            if (storedWishlist) {
                setWishlist(JSON.parse(storedWishlist));
            }
        }
    }, [user]);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist));
        }
    }, [wishlist, user]);

    const addToWishlist = (product) => {
        if (!user) {
            // if no user logged in → redirect to Signin page
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

            if (isAlreadyInWishlist) {
                return prevWishlist.filter(item => item.id !== product.id);
            } else {
                return [...prevWishlist, product];
            }
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

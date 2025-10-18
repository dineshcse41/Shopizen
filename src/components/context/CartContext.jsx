import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);

    // --- Helper: Get unique storage key per user or guest ---
    const getCartKey = () =>
        user ? `cart_${user.email || user.mobile || user.id}` : "cart_guest";

    const [cart, setCart] = useState([]);

    // --- Load correct cart when user changes ---
    useEffect(() => {
        const key = getCartKey();
        const savedCart = localStorage.getItem(key);
        setCart(savedCart ? JSON.parse(savedCart) : []);
    }, [user]);

    // --- Save cart changes to correct user key ---
    useEffect(() => {
        localStorage.setItem(getCartKey(), JSON.stringify(cart));
    }, [cart, user]);

    // --- Clear cart when user logs out ---
    useEffect(() => {
        if (!user) setCart([]);
    }, [user]);

    // --- Add product to cart (independent by size/color) ---
    const addToCart = (product) => {
        const selectedSize = product.selectedSize || "Free Size";
        const selectedColor = product.selectedColor || "Default";

        setCart((prev) => {
            const existingItem = prev.find(
                (item) =>
                    item.id === product.id &&
                    item.selectedSize === selectedSize &&
                    item.selectedColor === selectedColor
            );

            if (existingItem) {
                // Increase only if it's the same variant
                return prev.map((item) =>
                    item.id === product.id &&
                        item.selectedSize === selectedSize &&
                        item.selectedColor === selectedColor
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            // New unique variant
            return [
                ...prev,
                {
                    ...product,
                    selectedSize,
                    selectedColor,
                    quantity: 1,
                },
            ];
        });
    };

    // --- Update product variant size ---
    const updateProductSize = (id, oldSize, newSize) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id && item.selectedSize === oldSize
                    ? { ...item, selectedSize: newSize }
                    : item
            )
        );
    };

    // --- Quantity +/-, remove, clear ---
    const removeFromCart = (id, size, color) =>
        setCart((prev) =>
            prev.filter(
                (item) =>
                    !(
                        item.id === id &&
                        item.selectedSize === (size || "Free Size") &&
                        item.selectedColor === (color || "Default")
                    )
            )
        );

    const increaseQuantity = (id, size, color) =>
        setCart((prev) =>
            prev.map((item) =>
                item.id === id &&
                    item.selectedSize === (size || "Free Size") &&
                    item.selectedColor === (color || "Default")
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );

    const decreaseQuantity = (id, size, color) =>
        setCart((prev) =>
            prev.map((item) =>
                item.id === id &&
                    item.selectedSize === (size || "Free Size") &&
                    item.selectedColor === (color || "Default") &&
                    item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
                updateProductSize,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

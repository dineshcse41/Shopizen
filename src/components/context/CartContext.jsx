import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
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

  // --- Helper: Calculate price per size & discount ---
  const getVariantPrice = (product, size) => {
    const basePrice = product.priceBySize?.[size] ?? product.price ?? 0;
    const discount = product.discount ?? 0;
    return basePrice - (basePrice * discount) / 100;
  };

  // --- Add product to cart ---
  const addToCart = (product) => {
    const selectedSize = product.selectedSize || "Free Size";
    const selectedColor = product.selectedColor || "Default";
    const price = getVariantPrice(product, selectedSize);

    setCart((prev) => {
      const existingItem = prev.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + 1, price }
            : item
        );
      }

      // New variant
      return [
        ...prev,
        {
          ...product,
          selectedSize,
          selectedColor,
          quantity: 1,
          price, // store calculated price per variant
        },
      ];
    });
  };

  // --- Update product variant size ---
  const updateProductSize = (id, oldSize, newSize, color = "Default") => {
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.id === id &&
          item.selectedSize === oldSize &&
          item.selectedColor === color
        ) {
          const newPrice = getVariantPrice(item, newSize);
          return { ...item, selectedSize: newSize, price: newPrice };
        }
        return item;
      })
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

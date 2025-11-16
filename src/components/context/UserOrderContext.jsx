// src/components/context/UserOrderContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import ordersData from "../../data/orders/orders.json";
import { AuthContext } from "./AuthContext";

const UserOrderContext = createContext();

export const UserOrderProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    const storedOrders =
      JSON.parse(localStorage.getItem("user_orders")) || ordersData;
    setUserOrders(storedOrders);
  }, []);

  const addOrder = (order) => {
    if (!user) return;
    const newOrder = { ...order, userId: user.id };
    const updatedOrders = [newOrder, ...userOrders];
    setUserOrders(updatedOrders);
    localStorage.setItem("user_orders", JSON.stringify(updatedOrders));
  };

  const currentUserOrders = user
    ? userOrders.filter((order) => String(order.userId) === String(user.id))
    : [];

  return (
    <UserOrderContext.Provider
      value={{ userOrders, currentUserOrders, addOrder, setUserOrders }}
    >
      {children}
    </UserOrderContext.Provider>
  );
};

// ✅ Custom hook for easy access
export const useUserOrders = () => useContext(UserOrderContext);

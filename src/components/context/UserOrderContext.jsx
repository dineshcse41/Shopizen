import React, { createContext, useContext, useEffect, useState } from "react";
import userOrdersData from "../../data/orders/order_items.json";

const UserOrderContext = createContext();

export const UserOrderProvider = ({ children }) => {
    const [userOrders, setUserOrders] = useState([]);

    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem("user_orders")) || userOrdersData;
        setUserOrders(savedOrders);
    }, []);

    useEffect(() => {
        localStorage.setItem("user_orders", JSON.stringify(userOrders));
    }, [userOrders]);

    const addOrder = (order) => setUserOrders(prev => [order, ...prev]);

    return (
        <UserOrderContext.Provider value={{ userOrders, addOrder }}>
            {children}
        </UserOrderContext.Provider>
    );
};

export const useUserOrders = () => useContext(UserOrderContext);

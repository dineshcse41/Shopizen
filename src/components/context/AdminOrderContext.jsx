import React, { createContext, useContext, useEffect, useState } from "react";
import adminOrdersData from "../../data/orders/orders.json";

const AdminOrderContext = createContext();

export const AdminOrderProvider = ({ children }) => {
    const [adminOrders, setAdminOrders] = useState([]);

    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem("admin_orders")) || adminOrdersData;
        setAdminOrders(savedOrders);
    }, []);

    useEffect(() => {
        localStorage.setItem("admin_orders", JSON.stringify(adminOrders));
    }, [adminOrders]);

    const addOrder = (order) => setAdminOrders(prev => [order, ...prev]);

    return (
        <AdminOrderContext.Provider value={{ adminOrders, addOrder }}>
            {children}
        </AdminOrderContext.Provider>
    );
};

export const useAdminOrders = () => useContext(AdminOrderContext);

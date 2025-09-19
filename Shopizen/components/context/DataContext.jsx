import React, { createContext, useContext, useEffect, useState } from "react";
import demoData from "../../data/demoData.json";
import { v4 as uuidv4 } from "uuid";  // ✅ import uuid

const DataContext = createContext();
export const useData = () => useContext(DataContext);

const LS_KEY = "admin_demo_data_v1";

export function DataProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);

    // load from localStorage or demoData
    useEffect(() => {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
            try {
                const obj = JSON.parse(raw);
                setProducts(obj.products || []);
                setOrders(obj.orders || []);
                setUsers(obj.users || []);
                return;
            } catch { }
        }
        setProducts(demoData.products || []);
        setOrders(demoData.orders || []);
        setUsers(demoData.users || []);
    }, []);

    // persist on change
    useEffect(() => {
        const payload = { products, orders, users };
        localStorage.setItem(LS_KEY, JSON.stringify(payload));
    }, [products, orders, users]);

    // ✅ Products API with UUID
    const addProduct = (p) => setProducts(prev => [{ ...p, id: uuidv4() }, ...prev]);
    const updateProduct = (id, patch) => setProducts(prev => prev.map(x => x.id === id ? { ...x, ...patch } : x));
    const deleteProduct = (id) => setProducts(prev => prev.filter(x => x.id !== id));

    // Orders API
    const updateOrderStatus = (id, status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

    // Users API
    const blockUser = (id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, blocked: true } : u));
    const unblockUser = (id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, blocked: false } : u));
    const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));

    // import JSON (admin paste)
    const importJSON = (obj) => {
        if (obj.products) setProducts(obj.products);
        if (obj.orders) setOrders(obj.orders);
        if (obj.users) setUsers(obj.users);
    };

    return (
        <DataContext.Provider value={{
            products, addProduct, updateProduct, deleteProduct,
            orders, updateOrderStatus,
            users, blockUser, unblockUser, deleteUser,
            importJSON
        }}>
            {children}
        </DataContext.Provider>
    );
}

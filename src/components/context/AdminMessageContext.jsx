import React, { createContext, useContext, useEffect, useState } from "react";
import messagesData from "../../data/notifications/messages.json";

const AdminMessageContext = createContext();

export const AdminMessageProvider = ({ children }) => {
    const [adminMessages, setAdminMessages] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("admin_messages")) || messagesData;
        setAdminMessages(saved);
    }, []);

    useEffect(() => {
        localStorage.setItem("admin_messages", JSON.stringify(adminMessages));
    }, [adminMessages]);

    const addMessage = (msg) => setAdminMessages(prev => [msg, ...prev]);

    return (
        <AdminMessageContext.Provider value={{ adminMessages, addMessage }}>
            {children}
        </AdminMessageContext.Provider>
    );
};

export const useAdminMessages = () => useContext(AdminMessageContext);


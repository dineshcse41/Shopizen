import React, { createContext, useContext, useEffect, useState } from "react";
import messagesData from "../../data/notifications/messages.json";

const UserMessageContext = createContext();

export const UserMessageProvider = ({ children }) => {
    const [userMessages, setUserMessages] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("user_messages")) || messagesData;
        setUserMessages(saved);
    }, []);

    useEffect(() => {
        localStorage.setItem("user_messages", JSON.stringify(userMessages));
    }, [userMessages]);

    const addMessage = (msg) => setUserMessages(prev => [msg, ...prev]);

    return (
        <UserMessageContext.Provider value={{ userMessages, addMessage }}>
            {children}
        </UserMessageContext.Provider>
    );
};

export const useUserMessages = () => useContext(UserMessageContext);

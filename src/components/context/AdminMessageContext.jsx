import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import messagesData from "../../data/notifications/messages.json";

const AdminMessageContext = createContext();

export const AdminMessageProvider = ({ children }) => {
  const [adminMessages, setAdminMessages] = useState([]);

 /*  useEffect(() => {
    const savedMessages =
      JSON.parse(localStorage.getItem("admin_messages")) || messagesData;
    setAdminMessages(savedMessages);
  }, []);
 */

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("admin_messages"));
    if (savedMessages && savedMessages.length > 0) {
      setAdminMessages(savedMessages);
    } else {
      setAdminMessages(messagesData); // fallback to JSON data
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("admin_messages", JSON.stringify(adminMessages));
  }, [adminMessages]);

  const addMessage = (from, message) => {
    const newMsg = {
      id: Date.now(),
      from,
      message,
      date: new Date().toISOString(),
      isRead: false,
    };
    setAdminMessages((prev) => [newMsg, ...prev]);
  };

  const markAsRead = (id) => {
    setAdminMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
  };

  const markAllAsRead = () => {
    setAdminMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
  };

  const unreadCount = useMemo(
    () => adminMessages.filter((m) => !m.isRead).length,
    [adminMessages]
  );

  return (
    <AdminMessageContext.Provider
      value={{
        adminMessages,
        addMessage,
        markAsRead,
        markAllAsRead,
        unreadCount,
      }}
    >
      {children}
    </AdminMessageContext.Provider>
  );
};

export const useAdminMessages = () => useContext(AdminMessageContext);

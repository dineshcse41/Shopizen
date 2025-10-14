// src/pages/user/account/Contact.jsx
import React, { useState, useEffect, useRef } from "react";
import "./Contact.css";
import messagesData from "../../../data/common/contact.json";
import usersData from "../../../data/users/users.json";
// import { useAuth } from "../../../components/context/AuthContext"; // ✅ Uncomment when using real auth context
// import axios from "axios"; // ✅ Uncomment when backend (Django API) is connected

const UserChat = ({ currentUserId }) => {
    // ✅ Current logged-in user (from dummy JSON for now)
    const currentUser = usersData.find((u) => u.id === currentUserId);

    // ✅ Chat messages state
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [typing, setTyping] = useState(false);
    const [isAdminTyping, setIsAdminTyping] = useState(false);
    const chatBodyRef = useRef();

    // ✅ Fetch messages (dummy JSON for now)
    useEffect(() => {
        // 🔹 Using dummy JSON
        const filteredMessages = messagesData.filter(
            (m) => m.user === currentUser.name
        );
        setMessages(filteredMessages);

        // 🔹 API fetch (for Django backend)
        /*
        axios.get(`http://127.0.0.1:8000/api/chat/${currentUser.id}/`)
            .then(res => setMessages(res.data))
            .catch(err => console.error("Error fetching messages:", err));
        */
    }, [currentUser]);

    // ✅ Auto scroll to bottom when new messages appear
    useEffect(() => {
        chatBodyRef.current?.scrollTo(0, chatBodyRef.current.scrollHeight);
    }, [messages]);

    // ✅ Send message handler
    const handleSend = () => {
        if (!newMessage.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            user: currentUser.name,
            sender: "user",
            text: newMessage,
            timestamp: new Date().toLocaleString(),
            status: "Sent", // ✅ New field
            seen: false, // ✅ New field
        };

        setMessages([...messages, userMessage]);
        setNewMessage("");
        setTyping(false);

        // 🔹 Simulate saving to Django API (future)
        /*
        axios.post("http://127.0.0.1:8000/api/chat/send/", userMessage)
            .then(res => console.log("Message sent:", res.data))
            .catch(err => console.error("Error sending message:", err));
        */

        // 🔹 Simulate admin typing and reply
        setIsAdminTyping(true);
        setTimeout(() => {
            const adminReply = {
                id: messages.length + 2,
                user: currentUser.name,
                sender: "admin",
                text: "Thank you for reaching out! A support agent will assist you shortly.",
                timestamp: new Date().toLocaleString(),
                status: "Delivered",
                seen: true,
            };
            setMessages((prev) => [...prev, adminReply]);
            setIsAdminTyping(false);
        }, 1500);
    };

    // ✅ Typing status handler
    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        setTyping(e.target.value.length > 0);
    };

    return (
        <div className="user-chat-container d-flex justify-content-center align-items-center mt-3">
            <div className="chat-box shadow rounded flex-grow-1" style={{ maxWidth: "650px" }}>
                {/* Header */}
                <div className="chat-header bg-primary text-white p-3 rounded-top d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <img
                            src={`https://i.pravatar.cc/50?img=${currentUser.id}`}
                            alt={currentUser.name}
                            className="rounded-circle me-2"
                            width="45"
                            height="45"
                        />
                        <div>
                            <h5 className="mb-0">{currentUser.name}</h5>
                            <small className="text-light">
                                Customer ID: {currentUser.id}
                            </small>
                        </div>
                    </div>
                    <div className="text-end">
                        <small className="text-light">Support Chat</small>
                    </div>
                </div>

                {/* Chat Body */}
                <div
                    className="chat-body flex-grow-1 p-3 bg-light"
                    style={{ height: "420px", overflowY: "auto" }}
                    ref={chatBodyRef}
                >
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`d-flex mb-3 ${msg.sender === "user"
                                ? "justify-content-end"
                                : "justify-content-start"
                                }`}
                        >
                            <div
                                className={`message p-2 rounded shadow-sm ${msg.sender === "user"
                                    ? "bg-primary text-white"
                                    : "bg-white text-dark"
                                    }`}
                                style={{ maxWidth: "70%" }}
                            >
                                <p className="mb-1">{msg.text}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                                        {msg.timestamp}
                                    </small>
                                    <small
                                        className={`ms-2 ${msg.sender === "user"
                                            ? "text-light"
                                            : "text-secondary"
                                            }`}
                                        style={{ fontSize: "0.7rem" }}
                                    >
                                        {msg.status}
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicators */}
                    {typing && (
                        <div className="text-end text-muted">
                            <small>You are typing...</small>
                        </div>
                    )}
                    {isAdminTyping && (
                        <div className="text-start text-muted">
                            <small>Admin is typing...</small>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="chat-footer d-flex p-2 border-top bg-white">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={handleTyping}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button className="btn btn-primary px-4" onClick={handleSend}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserChat;

import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import messagesData from "../../../data/common/contact.json";
import usersData from "../../data/user/users.json";

const AdminChat = () => {
    const users = usersData.filter(u => u.role === "user");

    const [selectedUser, setSelectedUser] = useState(users[0]);
    const [messages, setMessages] = useState(messagesData);
    const [newMessage, setNewMessage] = useState("");
    const [typing, setTyping] = useState(false);

    const chatBodyRef = useRef();

    // Scroll to bottom on new message
    useEffect(() => {
        chatBodyRef.current?.scrollTo(0, chatBodyRef.current.scrollHeight);
    }, [messages, selectedUser]);

    const handleSend = () => {
        if (!newMessage.trim()) return;

        const msg = {
            id: messages.length + 1,
            user: selectedUser.name,
            sender: "admin",
            text: newMessage,
            timestamp: new Date().toLocaleString(),
        };

        setMessages([...messages, msg]);
        setNewMessage("");
        setTyping(false);
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        setTyping(e.target.value.length > 0);
    };

    // Filter messages for selected user
    const userMessages = messages
        .filter(msg => msg.user === selectedUser.name)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Sidebar with latest message on top
    const sortedUsers = [...users].sort((a, b) => {
        const lastA = messages.filter(m => m.user === a.name).slice(-1)[0];
        const lastB = messages.filter(m => m.user === b.name).slice(-1)[0];
        return new Date(lastB?.timestamp) - new Date(lastA?.timestamp);
    });

    return (
        <div className="admin-chat-container d-flex shadow rounded">
            {/* Sidebar */}
            <div className="chat-users bg-light border-end">
                <h5 className="p-3 border-bottom">Chats</h5>
                {sortedUsers.map(user => {
                    const lastMsg = messages.filter(m => m.user === user.name).slice(-1)[0];
                    return (
                        <div
                            key={user.id}
                            className={`chat-user-item p-3 d-flex align-items-center ${selectedUser.id === user.id ? "active" : ""}`}
                            onClick={() => setSelectedUser(user)}
                        >
                            <img
                                src={`https://i.pravatar.cc/50?img=${user.id}`}
                                alt={user.name}
                                className="profile rounded-circle me-2"

                            />
                            <div className="d-flex flex-column">
                                <strong>{user.name}</strong>
                                <small className="text-muted">{lastMsg?.text.slice(0, 30)}{lastMsg?.text.length > 30 ? "..." : ""}</small>
                            </div>
                            <span className={`online-indicator ms-auto ${Math.random() > 0.5 ? "online" : "offline"}`}></span>
                        </div>
                    );
                })}
            </div>

            {/* Chat Panel */}
            <div className="chat-panel flex-grow-1 d-flex flex-column">
                <div className="chat-header bg-dark text-white p-3">
                    <h6 className="mb-0">Chat with {selectedUser.name}</h6>
                </div>

                <div className="chat-body flex-grow-1 p-3" ref={chatBodyRef}>
                    {userMessages.map(msg => (
                        <div
                            key={msg.id}
                            className={`d-flex mb-3 ${msg.sender === "admin" ? "justify-content-end" : "justify-content-start"}`}
                        >
                            <div className={`message p-2 rounded ${msg.sender === "admin" ? "bg-primary text-white" : "bg-light text-dark"}`}>
                                <p className="mb-1">{msg.text}</p>
                                <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                                    {msg.timestamp}
                                </small>
                            </div>
                        </div>
                    ))}
                    {typing && <div className="typing-indicator">Admin is typing...</div>}
                </div>

                <div className="chat-footer d-flex p-2 border-top">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Type your reply..."
                        value={newMessage}
                        onChange={handleTyping}
                        onKeyPress={e => e.key === "Enter" && handleSend()}
                    />
                    <button className="btn btn-dark" onClick={handleSend}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default AdminChat;

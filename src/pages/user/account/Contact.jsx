import React, { useState, useEffect, useRef } from "react";
import "./Contact.css";
import messagesData from "../../../data/common/contact.json";
import usersData from "../../../data/users/users.json";

/**
 * Enhanced UserChat:
 * - localStorage per-user message persistence
 * - realistic admin typing/delivered/read flow
 * - quick replies, email/tel contact, open-chat focus + pulse
 */

const STORAGE_KEY = "shopizen_user_messages_v1";

const nowStr = () => new Date().toLocaleString();

const loadStored = (userName) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed[userName] || null;
  } catch {
    return null;
  }
};

const saveStored = (userName, messages) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[userName] = messages;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {}
};

const generateId = () => Date.now() + Math.floor(Math.random() * 999);

const UserChat = ({ currentUserId }) => {
  const currentUser = usersData.find((u) => u.id === Number(currentUserId));

  if (!currentUser) {
    return (
      <div
        className="text-center p-4"
        style={{ height: "235px", backgroundColor: "#c5e3bf" }}
      >
        <h5>User not found!</h5>
        <p>Please check your account or try again later.</p>
      </div>
    );
  }

  const chatBodyRef = useRef();
  const inputRef = useRef();
  const openChatBtnRef = useRef();

  // messages state: load from localStorage or from messagesData fallback
  const [messages, setMessages] = useState(() => {
    const stored = loadStored(currentUser.name);
    if (stored) return stored;
    // fallback: filter file-based seed data
    const filtered = messagesData.filter((m) => m.user === currentUser.name);
    return filtered.length ? filtered : [];
  });

  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false); // user typing indicator
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // persist on messages change
  useEffect(() => {
    saveStored(currentUser.name, messages);
    // auto-scroll
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, currentUser.name]);

  // detect admin delivered -> mark read after a short time (simulate)
  useEffect(() => {
    // when admin sends message with status Delivered, simulate read after 2.2s
    const t = messages.find(
      (m) => m.sender === "admin" && m.status === "Delivered" && !m.readTimerSet
    );
    if (t) {
      // mark a flag to avoid repeated timers
      setMessages((prev) =>
        prev.map((m) => (m.id === t.id ? { ...m, readTimerSet: true } : m))
      );
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === t.id ? { ...m, status: "Read" } : m))
        );
      }, 2200);
      setUnreadCount((u) => u + 1);
    }
  }, [messages]);

  // mark messages read when user focuses chat
  const markAllRead = () => {
    setMessages((prev) =>
      prev.map((m) => (m.sender === "admin" ? { ...m, status: "Read" } : m))
    );
    setUnreadCount(0);
  };

  const sendUserMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = {
      id: generateId(),
      user: currentUser.name,
      sender: "user",
      text: text.trim(),
      timestamp: nowStr(),
      status: "Sent",
    };
    setMessages((prev) => [...prev, userMsg]);

    // simulate network: Sent -> Delivered after short delay
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMsg.id ? { ...m, status: "Delivered" } : m
        )
      );
    }, 500);

    // simulate admin typing + reply flow (realistic delays based on message length)
    const replyDelay = 1000 + Math.min(3000, text.length * 40);
    setIsAdminTyping(true);
    setTimeout(() => {
      // build contextual admin reply (very simple heuristics)
      const lowercase = text.toLowerCase();
      let replyText =
        "Thanks! We received your message. A support agent will get back to you shortly.";
      if (lowercase.includes("order") || lowercase.includes("refund")) {
        replyText =
          "We’ve located your order — please share the order ID or allow us a few minutes to fetch the details.";
      } else if (lowercase.includes("cancel")) {
        replyText =
          "If you want to cancel, please confirm and we will initiate cancellation right away.";
      } else if (lowercase.includes("payment") || lowercase.includes("card")) {
        replyText =
          "For payment issues, please avoid sharing card details. We will guide you to secure channels.";
      }

      const adminMsg = {
        id: generateId(),
        user: currentUser.name,
        sender: "admin",
        text: replyText,
        timestamp: nowStr(),
        status: "Delivered",
      };

      setMessages((prev) => [...prev, adminMsg]);
      setIsAdminTyping(false);
    }, replyDelay);
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendUserMessage(newMessage);
    setNewMessage("");
    setTyping(false);
    // focus back
    inputRef.current?.focus();
  };

  // Enter press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Open chat focus + pulse highlight
  const openChat = () => {
    // make sure chat container is visible and focused
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
    inputRef.current?.focus();
    // pulse effect on chat box
    const box = chatBodyRef.current?.closest(".user-chat-box");
    if (box) {
      box.classList.remove("user-pulse");
      // force reflow to restart animation
      // eslint-disable-next-line no-unused-expressions
      void box.offsetWidth;
      box.classList.add("user-pulse");
      setTimeout(() => box.classList.remove("user-pulse"), 900);
    }
    markAllRead();
  };

  // quick replies (common e-comm flows)
  const quickReply = (text) => {
    sendUserMessage(text);
  };

  // typing debounce
  useEffect(() => {
    if (!newMessage) {
      setTyping(false);
      return;
    }
    setTyping(true);
    const t = setTimeout(() => setTyping(false), 1000);
    return () => clearTimeout(t);
  }, [newMessage]);

  return (
    <div className="user-chat-container ">
      <div className="user-chat-box shadow rounded">
        {/* Header */}
        <div className="user-chat-header d-flex justify-content-between align-items-center">
          <div className="user-info d-flex align-items-center">
            <img
              src={`https://i.pravatar.cc/60?img=${currentUser.id}`}
              alt={currentUser.name}
              className="user-avatar"
            />
            <div className="user-meta ms-2">
              <h5>{currentUser.name}</h5>
              <small>Customer ID: {currentUser.id}</small>
            </div>
          </div>
          <div className="text-end">
            <small>Customer Support</small>
            <div
              className="d-block"
              style={{ fontSize: "0.8rem", color: "#e8f0ff" }}
            >
              <div>{currentUser.email}</div>
              <div>{currentUser.mobile || "+91-9876543210"}</div>
            </div>
          </div>
        </div>

        {/* Contact + quick actions */}
        <div className="user-contact-info d-flex justify-content-between align-items-center">
         {/*  <div>
            <span>
              <strong>Email:</strong> support@shopizen.com
            </span>
            <span style={{ marginLeft: 14 }}>
              <strong>Phone:</strong> +91 98765 43210
            </span>
          </div> */}

          <div className="d-flex align-items-center gap-2">
            <a
              className="btn btn-sm btn-outline-primary"
              href={`mailto:support@shopizen.com?subject=${encodeURIComponent(
                `Help - ${currentUser.name}`
              )}&body=${encodeURIComponent(
                `Hello Shopizen Support,

I need help regarding my order.
Order ID: _______

Thank you,
${currentUser.name}`
              )}`}
            >
              Email Support
            </a>
            <a
              className="btn btn-sm btn-outline-success"
              href="tel:+91 9876543210"
            >
              Call Support
            </a>
            <button
              ref={openChatBtnRef}
              className="btn btn-sm btn-info text-white"
              onClick={openChat}
              title="Open chat"
            >
              Open Chat{" "}
              {unreadCount > 0 && (
                <span className="badge bg-danger ms-2">{unreadCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Quick replies */}
        <div className="user-quick-actions p-2 border-bottom">
          <button
            className="btn btn-sm btn-light me-2"
            onClick={() => quickReply("Where is my order?")}
          >
            Where is my order?
          </button>
          <button
            className="btn btn-sm btn-light me-2"
            onClick={() => quickReply("I want to cancel my order")}
          >
            Cancel order
          </button>
          <button
            className="btn btn-sm btn-light me-2"
            onClick={() => quickReply("I need a refund")}
          >
            Refund
          </button>
          <button
            className="btn btn-sm btn-light"
            onClick={() => quickReply("I have an issue with payment")}
          >
            Payment issue
          </button>
        </div>

        {/* Chat body */}
        <div
          className="user-chat-body p-3"
          ref={chatBodyRef}
          style={{ height: 360 }}
          onClick={markAllRead}
        >
          {messages.length === 0 && (
            <div className="text-center" style={{ color: "#64748b" }}>
              No messages yet — start a conversation or use Quick Replies above.
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`user-message-wrapper d-flex mb-3 ${
                msg.sender === "user"
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              <div
                className={`user-message ${
                  msg.sender === "user" ? "user" : "admin"
                }`}
                style={{ maxWidth: "78%" }}
              >
                <div className="user-message-text">{msg.text}</div>
                <div className="user-msg-meta">
                  <small>{msg.timestamp}</small>
                  <small>{msg.status}</small>
                </div>
              </div>
            </div>
          ))}

          {/* typing indicators */}
          <div className="mt-1">
            {typing && (
              <div className="user-typing-indicator text-end">
                You are typing...
              </div>
            )}
            {isAdminTyping && (
              <div className="user-typing-indicator">Support is typing...</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="user-chat-footer">
          <textarea
            ref={inputRef}
            className="form-control"
            placeholder="Type your message here."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{ resize: "none" }}
          />
          <button className="btn btn-primary" onClick={handleSend}>
            Send
          </button>
        </div>

        {/* small company hours / signature */}
        <div
          className="p-2 small text-muted border-top"
          style={{ fontSize: "0.8rem" }}
        >
          Support hours: Mon–Sat 9:00–21:00 IST · Avg response in chat: ~2–5
          mins · Please avoid sharing payment details in chat.
        </div>
      </div>
    </div>
  );
};

export default UserChat;

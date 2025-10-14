import React, { useState, useContext } from "react";
import {
    FaSun,
    FaMoon,
    FaBell,
    FaBoxOpen,
    FaEnvelope,
    FaUserCircle,
    FaBars,
} from "react-icons/fa";
import { useAdminNotifications } from "../context/AdminNotificationContext.jsx";
import { useAdminOrders } from "../context/AdminOrderContext.jsx";
import { useAdminMessages } from "../context/AdminMessageContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { useDarkMode } from "../context/DarkModeContext.jsx";

// Utility function to truncate long messages
const truncate = (msg, len = 50) => (msg.length > len ? msg.slice(0, len) + "..." : msg);

const Header = ({ toggleSidebar }) => {
    const { user, logout } = useContext(AuthContext);
    const { darkMode, toggleDarkMode } = useDarkMode();

    // Admin contexts
    const { adminNotifs, unreadCount, markAsRead } = useAdminNotifications();
    const { adminOrders } = useAdminOrders();
    const { adminMessages } = useAdminMessages();

    const [expandedIds, setExpandedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleExpand = (id) => {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // Filtered lists based on search
    const filteredOrders = adminOrders.filter((o) =>
        o.id.toString().includes(searchTerm)
    );
    const filteredMessages = adminMessages.filter(
        (m) =>
            m.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <header
            className={`d-flex flex-wrap justify-content-between align-items-center px-3 py-2 shadow-sm ${darkMode ? "bg-dark text-light" : "bg-white text-dark"
                }`}
        >
            {/* Left: Sidebar toggle & Logo */}
            <div className="d-flex align-items-center mb-2 mb-lg-0">
                <button className="btn btn-outline-secondary me-2 d-lg-none" onClick={toggleSidebar}>
                    <FaBars />
                </button>
                <img src={logo} alt="Logo" className="img-fluid" style={{ height: "40px" }} />
            </div>

            {/* Center: Search Bar */}
            <div className="flex-grow-1 d-flex justify-content-center ms-2 mb-2 mb-lg-0">
                <div className="input-group w-75 w-lg-75">
                    <input
                        type="search"
                        className="form-control"
                        placeholder="Search orders, messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-warning">
                        <i className="bi bi-search"></i>
                    </button>
                </div>
            </div>

            {/* Right: Dark Mode, Admin Dropdowns, Profile */}
            <div className="d-flex align-items-center gap-2">
                {/* Dark Mode */}
                <button className="btn btn-outline-secondary" onClick={toggleDarkMode}>
                    {darkMode ? <FaSun /> : <FaMoon />}
                </button>

                {/* Notifications */}
                <Dropdown
                    icon={<FaBell />}
                    badge={unreadCount}
                    title="Notifications"
                    items={adminNotifs}
                    expandedIds={expandedIds}
                    toggleExpand={toggleExpand}
                    markRead={markAsRead}
                    type="notifications"
                />

                {/* Orders */}
                <Dropdown
                    icon={<FaBoxOpen />}
                    badge={filteredOrders.length}
                    title="Orders"
                    items={filteredOrders}
                    type="orders"
                />

                {/* Messages */}
                <Dropdown
                    icon={<FaEnvelope />}
                    badge={filteredMessages.length}
                    title="Messages"
                    items={filteredMessages}
                    truncateLength={40}
                    type="messages"
                />

                {/* Profile */}
                <div className="dropdown">
                    <button
                        className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center p-1"
                        data-bs-toggle="dropdown"
                    >
                        <FaUserCircle size={20} className="me-1" /> {user?.name || "Admin"}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end ">
                        <li>
                            <Link className="dropdown-item" to="/profile">
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item" to="/settings">
                                Settings
                            </Link>
                        </li>
                        <li>
                            <button className="dropdown-item" onClick={logout}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
};

// ----------------- Reusable Dropdown Component -----------------
const Dropdown = ({
    icon,
    badge,
    title,
    items,
    expandedIds = [],
    toggleExpand,
    markRead,
    type,
    truncateLength = 50,
}) => (
    <div className="dropdown">
        <button className="btn btn-outline-secondary position-relative" data-bs-toggle="dropdown">
            {icon}
            {badge > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {badge}
                </span>
            )}
        </button>
        <ul
            className="dropdown-menu dropdown-menu-end p-2 shadow"
            style={{ minWidth: "300px", maxHeight: "60vh", overflowY: "auto" }}
        >
            <li className="dropdown-item text-muted small">
                <strong>{title}</strong>
            </li>
            <li>
                <hr className="dropdown-divider" />
            </li>

            {items.length > 0
                ? items.map((item) => {
                    if (type === "notifications") {
                        return (
                            <li
                                key={item.id}
                                className={`dropdown-item small d-flex justify-content-between align-items-start ${!item.isRead ? "bg-light fw-bold" : ""
                                    }`}
                                onClick={() => markRead(item.id)}
                                style={{ cursor: "pointer", whiteSpace: "normal" }}
                            >
                                <div style={{ flex: 1 }}>
                                    {expandedIds.includes(item.id)
                                        ? item.message
                                        : truncate(item.message, truncateLength)}
                                    {item.message.length > truncateLength && (
                                        <button
                                            className="btn btn-link btn-sm p-0 ms-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleExpand(item.id);
                                            }}
                                        >
                                            {expandedIds.includes(item.id) ? "Show less" : "Show more"}
                                        </button>
                                    )}
                                    <br />
                                    <small className="text-muted">
                                        {new Date(item.timestamp || item.date).toLocaleString()}
                                    </small>
                                </div>
                                {!item.isRead && <span className="badge bg-primary ms-2">New</span>}
                            </li>
                        );
                    } else if (type === "orders") {
                        return (
                            <li key={item.id} className="dropdown-item small">
                                Order #{item.id} - {item.status} <br />
                                <small className="text-muted">{new Date(item.date).toLocaleString()}</small>
                            </li>
                        );
                    } else if (type === "messages") {
                        return (
                            <li key={item.id} className="dropdown-item small">
                                {item.from}: {truncate(item.message, truncateLength)} <br />
                                <small className="text-muted">{new Date(item.date).toLocaleString()}</small>
                            </li>
                        );
                    }
                    return null;
                })
                : (
                    <li className="dropdown-item small text-muted">
                        No {title.toLowerCase()}
                    </li>
                )}
        </ul>
    </div>
);

export default Header;

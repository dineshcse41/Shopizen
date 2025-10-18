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
/* import { truncate } from "../utils/truncate.js"; */ // optional utility

const Header = ({ toggleSidebar }) => {
    const { user, logout } = useContext(AuthContext);
    const { darkMode, toggleDarkMode } = useDarkMode();
    const { adminNotifs, unreadCount, markAsRead } = useAdminNotifications();
    const { adminOrders } = useAdminOrders();
    const { adminMessages } = useAdminMessages();

    const [expandedIds, setExpandedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [hamburgerOpen, setHamburgerOpen] = useState(false);

    const toggleExpand = (id) => {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

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
            className={`d-flex align-items-center justify-content-between flex-nowrap px-2 py-2 shadow-sm ${darkMode ? "bg-dark text-light" : "bg-white text-dark"
                }`}
        >
            {/* Left: Sidebar toggle & Logo */}
            <div className="d-flex align-items-center gap-2">
                <button
                    className="btn btn-outline-secondary d-lg-none btn-sm"
                    onClick={toggleSidebar}
                >
                    <FaBars />
                </button>
                <img src={logo} alt="Logo" style={{ height: "35px" }} />
            </div>

            {/* Center: Search Bar (always visible) */}
            <div className="flex-grow-1 mx-2">
                <input
                    type="search"
                    className="form-control form-control-sm w-50"
                    placeholder="Search orders, messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Right: Hamburger for mobile, icons for desktop */}
            <div className="d-flex align-items-center gap-1">
                {/* Desktop icons (hidden on mobile) */}
                <div className="d-none d-lg-flex align-items-center gap-1">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={toggleDarkMode}
                    >
                        {darkMode ? <FaSun /> : <FaMoon />}
                    </button>
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
                    <Dropdown
                        icon={<FaBoxOpen />}
                        badge={filteredOrders.length}
                        title="Orders"
                        items={filteredOrders}
                        type="orders"
                    />
                    <Dropdown
                        icon={<FaEnvelope />}
                        badge={filteredMessages.length}
                        title="Messages"
                        items={filteredMessages}
                        truncateLength={40}
                        type="messages"
                    />
                    <div className="dropdown">
                        <button
                            className="btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center"
                            data-bs-toggle="dropdown"
                        >
                            <FaUserCircle size={18} className="me-1" /> {user?.name || "Admin"}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
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

                {/* Mobile Hamburger */}
                <div className="d-lg-none dropdown">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setHamburgerOpen(!hamburgerOpen)}
                    >
                        MENU
                    </button>
                    {hamburgerOpen && (
                        <div
                            className={`position-absolute top-100 end-0 bg-white border shadow p-2`}
                            style={{ minWidth: "200px", zIndex: 1050 }}
                        >
                            <button
                                className="btn btn-outline-secondary btn-sm w-100 mb-1"
                                onClick={toggleDarkMode}
                            >
                                {darkMode ? "Light Mode" : "Dark Mode"}
                            </button>
                            <Dropdown
                                icon={<FaBell />}
                                badge={unreadCount}
                                title="Notifications"
                                items={adminNotifs}
                                expandedIds={expandedIds}
                                toggleExpand={toggleExpand}
                                markRead={markAsRead}
                                type="notifications"
                                showLabel={true}
                            />
                            <Dropdown
                                icon={<FaBoxOpen />}
                                badge={filteredOrders.length}
                                title="Orders"
                                items={filteredOrders}
                                type="orders"
                                showLabel={true}
                            />
                            <Dropdown
                                icon={<FaEnvelope />}
                                badge={filteredMessages.length}
                                title="Messages"
                                items={filteredMessages}
                                truncateLength={40}
                                type="messages"
                                showLabel={true}
                            />
                            <div className="dropdown-divider"></div>
                            <Link className="dropdown-item" to="/profile">
                                <i className="bi bi-person"></i> Profile
                            </Link>
                            <Link className="dropdown-item" to="/settings">
                                <i className="bi bi-gear"></i> Settings
                            </Link>
                            <button className="dropdown-item" onClick={logout}>
                                <i class="bi bi-box-arrow-right"></i> Logout
                            </button>
                        </div>
                    )}
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
    showLabel = false, // new prop
}) => (
    <div className="dropdown mb-1">
        <button
            className="btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-between"
            data-bs-toggle="dropdown"
        >
            <div className="d-flex align-items-center gap-2">
                {icon}
                {showLabel && <span>{title}</span>}
            </div>
            {badge > 0 && (
                <span className="badge bg-danger rounded-pill">{badge}</span>
            )}
        </button>

        <ul
            className="dropdown-menu dropdown-menu-end p-2 shadow"
            style={{ minWidth: "250px", maxHeight: "50vh", overflowY: "auto" }}
        >
            <li className="dropdown-item text-muted small"><strong>{title}</strong></li>
            <li><hr className="dropdown-divider" /></li>

            {items.length > 0
                ? items.map((item) => {
                    if (type === "notifications") {
                        return (
                            <li key={item.id} className={`dropdown-item small d-flex justify-content-between align-items-start ${!item.isRead ? "bg-light fw-bold" : ""}`}
                                onClick={() => markRead && markRead(item.id)}
                                style={{ cursor: "pointer", whiteSpace: "normal" }}>
                                <div style={{ flex: 1 }}>
                                    {item.message.length > truncateLength ? item.message.slice(0, truncateLength) + "..." : item.message}
                                    <br />
                                    <small className="text-muted">{new Date(item.timestamp || item.date).toLocaleString()}</small>
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
                                {item.from}: {item.message.length > truncateLength ? item.message.slice(0, truncateLength) + "..." : item.message} <br />
                                <small className="text-muted">{new Date(item.date).toLocaleString()}</small>
                            </li>
                        );
                    }
                    return null;
                })
                : <li className="dropdown-item small text-muted">No {title.toLowerCase()}</li>
            }
        </ul>
    </div>
);



export default Header;

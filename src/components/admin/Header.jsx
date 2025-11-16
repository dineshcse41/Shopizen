import React, { useState, useContext } from "react";
import {
  FaSun,
  FaMoon,
  FaBell,
  FaBoxOpen,
  FaEnvelope,
  FaUserCircle,
  FaBars,
  FaSearch,
} from "react-icons/fa";
import { useAdminNotifications } from "../context/AdminNotificationContext.jsx";
import { useAdminOrderNotifications } from "../context/AdminOrderContext.jsx";
import { useAdminMessages } from "../context/AdminMessageContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { useDarkMode } from "../context/DarkModeContext.jsx";
import adminRoles from "../../data/admin/roles.json";

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext) || {};
  const { theme, toggleDarkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Fixed state

  const {
    adminNotifications,
    markAsRead: markNotifAsRead,
    markAllAsRead,
    unreadCount: notifCount,
  } = useAdminNotifications() || {};

  const { adminOrders, markOrderAsRead, markAllOrdersAsRead } =
    useAdminOrderNotifications() || {};

  const {
    adminMessages,
    markAsRead: markMsgAsRead,
    markAllAsRead: markAllMsgs,
    unreadCount: msgCount,
  } = useAdminMessages() || {};

  const filteredOrders = adminOrders.filter((o) =>
    (o.id || o.orderId || "")
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredMessages = adminMessages.filter(
    (m) =>
      (m.from || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.message || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAdminRole =
    user && adminRoles.some((roleObj) => roleObj.role === user.role);
  if (!user || !isAdminRole) return null;

  return (
    <header
      className={`d-flex align-items-center justify-content-between flex-nowrap px-3 py-2 shadow-sm ${
        theme === "dark" ? "header-dark" : "header-light"
      }`}
    >
      {/* Left: Sidebar + Logo */}
      <div className="d-flex align-items-center gap-2">
        <button
          className={`btn btn-outline-secondary d-lg-none btn-sm ${
            theme === "dark" ? "btn-outline-light" : "btn-outline-dark"
          }`}
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>
        <img src={logo} alt="Logo" style={{ height: "35px" }} />
      </div>

      {/* Center: Search */}
      {/* <div className="d-flex align-items-center flex-grow-1 justify-content-center">
        <input
          type="search"
          className={`form-control form-control-sm w-50 d-none d-md-inline-block ${
            theme === "dark" ? "bg-secondary text-light border-0" : ""
          }`}
          placeholder="Search orders, messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn btn-outline-secondary btn-sm d-inline-block d-md-none ms-2"
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
        >
          <FaSearch />
        </button>
      </div> */}

      {/* Mobile search input */}
    {/*   {mobileSearchOpen && (
        <div className="d-md-none position-absolute top-100 start-0 w-100 p-2 bg-white shadow">
          <input
            type="search"
            className="form-control form-control-sm w-100"
            placeholder="Search orders, messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )} */}

      {/* Right: Desktop Icons */}
      <div className="d-none d-md-flex align-items-center gap-1">
        <button
          className={`btn btn-sm ${
            theme === "dark" ? "btn-outline-light" : "btn-outline-dark"
          }`}
          onClick={toggleDarkMode}
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>

        <Dropdown
          icon={<FaBell />}
          badge={notifCount}
          title="Notifications"
          items={adminNotifications}
          type="notifications"
          markRead={markNotifAsRead}
          markAll={markAllAsRead}
        />

        <Dropdown
          icon={<FaBoxOpen />}
          badge={filteredOrders.length}
          title="Orders"
          items={filteredOrders}
          type="orders"
          markRead={markOrderAsRead}
          markAll={markAllOrdersAsRead}
        />

        <Dropdown
          icon={<FaEnvelope />}
          badge={msgCount}
          title="Messages"
          items={filteredMessages}
          type="messages"
          markRead={markMsgAsRead}
          markAll={markAllMsgs}
          truncateLength={40}
        />

        {/* User Dropdown (Desktop) */}
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center"
            data-bs-toggle="dropdown"
          >
            <FaUserCircle size={18} className="me-1" /> {user?.name || "Admin"}
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <Link className="dropdown-item" to="/admin/profile">
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

      {/* Mobile Menu */}
      <div className="d-lg-none">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          MENU
        </button>
        {mobileMenuOpen && (
          <div
            className="position-absolute top-100 end-0 bg-white border shadow p-2"
            style={{ minWidth: "200px", zIndex: 1050 }}
          >
            <button
              className="btn btn-outline-secondary btn-sm w-100 mb-1"
              onClick={toggleDarkMode}
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>

            <Dropdown
              icon={<FaBell />}
              badge={notifCount}
              title="Notifications"
              items={adminNotifications}
              type="notifications"
              markRead={markNotifAsRead}
              markAll={markAllAsRead}
              showLabel={true} // optional for mobile
            />
            <Dropdown
              icon={<FaBoxOpen />}
              badge={filteredOrders.length}
              title="Orders"
              items={filteredOrders}
              type="orders"
              markRead={markOrderAsRead}
              markAll={markAllOrdersAsRead}
              showLabel={true}
            />
            <Dropdown
              icon={<FaEnvelope />}
              badge={filteredMessages.length}
              title="Messages"
              items={filteredMessages}
              truncateLength={40}
              type="messages"
              markRead={markMsgAsRead}
              markAll={markAllMsgs}
              showLabel={true}
            />

            <div className="dropdown-divider"></div>
            <Link className="dropdown-item" to="/admin/profile">
              Profile
            </Link>
            <Link className="dropdown-item" to="/settings">
              Settings
            </Link>
            <button className="dropdown-item" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

// Dropdown component remains unchanged
const Dropdown = ({
  icon,
  badge = 0,
  title,
  items = [],
  markRead,
  markAll,
  type,
  truncateLength = 50,
  showLabel = false, // for mobile labels
}) => (
  <div className="dropdown mb-1">
    <button
      className="btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-between"
      data-bs-toggle="dropdown"
    >
      <div className="d-flex align-items-center gap-2">
        {icon} {showLabel && <span className="ms-2">{title}</span>}
      </div>
      {badge > 0 && (
        <span className="badge bg-danger rounded-pill">{badge}</span>
      )}
    </button>

    <ul
      className="dropdown-menu dropdown-menu-end p-2 shadow"
      style={{ minWidth: "270px", maxHeight: "55vh", overflowY: "auto" }}
    >
      <li className="dropdown-item text-muted small d-flex justify-content-between align-items-center">
        <strong>{title}</strong>
        {markAll && (
          <button
            className="btn btn-link btn-sm text-decoration-none text-primary p-0"
            onClick={(e) => {
              e.stopPropagation();
              markAll();
            }}
          >
            Mark all as read
          </button>
        )}
      </li>
      <li>
        <hr className="dropdown-divider" />
      </li>

      {items.length === 0 ? (
        <li className="dropdown-item small text-muted">
          No {title.toLowerCase()}
        </li>
      ) : (
        items.map((item) => {
          const isUnread =
            item.isRead === false || item.status?.toLowerCase() === "unseen";
          const key = item.id || item.notificationId || item.orderId;

          const content =
            type === "messages" ? (
              <>
                <strong>{item.from}:</strong>{" "}
                {(item.message || "").slice(0, truncateLength)}
                <br />
                <small className="text-muted">
                  {item.date ? new Date(item.date).toLocaleString() : ""}
                </small>
              </>
            ) : type === "orders" ? (
              <>
                <strong>Order #{item.orderId || item.id}</strong> –{" "}
                {item.status || "Processing"}
                <br />
                <small className="text-muted">
                  {item.date ? new Date(item.date).toLocaleString() : "N/A"}
                </small>
              </>
            ) : (
              <>
                <strong>{item.title}</strong>
                <br />
                {(item.message || "").slice(0, truncateLength)}
                <br />
                <small className="text-muted">
                  {item.timestamp
                    ? new Date(item.timestamp).toLocaleString()
                    : ""}
                </small>
              </>
            );

          return (
            <li
              key={key}
              className={`dropdown-item small text-wrap ${
                isUnread ? "bg-light fw-bold" : ""
              }`}
              onClick={() => markRead && markRead(key)}
              style={{ cursor: "pointer", whiteSpace: "normal" }}
            >
              {content}
              {isUnread && <span className="badge bg-primary ms-2">New</span>}
            </li>
          );
        })
      )}
    </ul>
  </div>
);

export default Header;

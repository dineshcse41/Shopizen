// src/pages/account/Dashboard.jsx
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import "./Dashboard.css";

import { AuthContext } from "../../../components/context/AuthContext";
import { WishlistContext } from "../../../components/context/WishlistContext";
import { useUserOrders } from "../../../components/context/UserOrderContext";
import { useUserNotifications } from "../../../components/context/UserNotificationContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { wishlist } = useContext(WishlistContext);
  const { currentUserOrders } = useUserOrders();
  const { unreadCount } = useUserNotifications();

  const [openDropdown, setOpenDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ for mobile

  const toggleDropdown = (name) =>
    setOpenDropdown(openDropdown === name ? null : name);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev); // ✅

  const recentOrders = currentUserOrders.slice(0, 3);
  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const ordersCount = currentUserOrders?.length || 0;
  const wishlistCount = wishlist?.length || 0;
  const walletAmount = user?.wallet ?? 0;
  const notificationCount = unreadCount ?? 0;

  return (
    <div className="account-dashboard container-fluid p-4">
      {/* ===== Mobile Toggle Button ===== */}
      <button
        className="sidebar-toggle-btn d-lg-none btn btn-outline-primary mb-3"
        onClick={toggleSidebar}
      >
        <i className="bi bi-list fs-4"></i>
      </button>

      <div className="row">
        {/* Sidebar */}
        <div
          className={`col-lg-3 mb-4 sidebar-wrapper ${
            sidebarOpen ? "open" : ""
          }`}
        >
          <div className="sidebar card p-3">
            <h5 className="fw-bold mb-3 d-flex justify-content-between align-items-center">
              My Account
              <button
                className="d-lg-none border-0 bg-transparent fs-5"
                onClick={toggleSidebar}
              >
                <i className="bi bi-x"></i>
              </button>
            </h5>
            <ul className="list-unstyled account-menu">
              <li>
                <Link to="/account/profile" onClick={() => setSidebarOpen(false)}>
                  <i className="bi bi-person"></i> Profile
                </Link>
              </li>
              <li>
                <Link to="/account/orders" onClick={() => setSidebarOpen(false)}>
                  <i className="bi bi-box-seam"></i> My Orders
                </Link>
              </li>
              <li>
                <Link to="/account/wishlist" onClick={() => setSidebarOpen(false)}>
                  <i className="bi bi-heart"></i> Wishlist
                </Link>
              </li>
              <li>
                <Link to="/account/wallet" onClick={() => setSidebarOpen(false)}>
                  <i className="bi bi-wallet2"></i> Wallet
                </Link>
              </li>
              <li>
                <Link
                  to="/account/notifications"
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className="bi bi-bell"></i> Notifications
                </Link>
              </li>

              {/* Settings dropdown */}
              <li className="mx-3 settings-dropdown">
                <button
                  className="dropdown-toggle-btn w-100 text-start border-0 bg-transparent p-0"
                  onClick={() => toggleDropdown("settings")}
                >
                  <i className="bi bi-gear"></i> Settings{" "}
                  <i
                    className={`bi ms-2 ${
                      openDropdown === "settings"
                        ? "bi-chevron-up"
                        : "bi-chevron-down"
                    }`}
                  ></i>
                </button>
                {openDropdown === "settings" && (
                  <ul className="list-unstyled ms-4 mt-2 dropdown-inner">
                    <li>
                      <Link
                        to="/account/settings/notifications"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <i className="bi bi-bell"></i> Notification Settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/account/settings/privacy"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <i className="bi bi-shield-lock"></i> Privacy Settings
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <Link to="/account/contact" onClick={() => setSidebarOpen(false)}>
                  <i className="bi bi-chat-dots"></i> Contact Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="col-lg-9">
          <div className="welcome-banner p-4 mb-4 rounded shadow-sm bg-light d-flex justify-content-between align-items-center">
            <div>
              <h4 className="fw-bold">Hi, {user?.name || "Guest"} 👋</h4>
              <p className="text-muted mb-0">
                Welcome back to your Shopizen Account Dashboard
              </p>
            </div>
            <div>
              <img
                src={
                  user?.profilePicture ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="user avatar"
                className="rounded-circle"
                width="70"
              />
            </div>
          </div>

          {/* Summary Cards */}
          <Row className="g-4">
            {[
              {
                icon: "bi-box-seam",
                title: "Orders",
                count: ordersCount,
                link: "/account/orders",
                color: "primary",
              },
              {
                icon: "bi-heart",
                title: "Wishlist",
                count: wishlistCount,
                link: "/account/wishlist",
                color: "danger",
              },
              {
                icon: "bi-wallet2",
                title: "Wallet",
                count: `₹${walletAmount}`,
                link: "/account/wallet",
                color: "success",
              },
              {
                icon: "bi-bell",
                title: "Notifications",
                count: notificationCount,
                link: "/account/notifications",
                color: "warning",
              },
            ].map((card, idx) => (
              <Col key={idx} xs={12} sm={6} md={3}>
                <Card className={`text-center shadow-sm border-0`}>
                  <Card.Body>
                    <i className={`bi ${card.icon} text-${card.color} fs-3`}></i>
                    <h6 className="mt-2">{card.title}</h6>
                    <h5 className="fw-bold">{card.count}</h5>
                    <Link
                      to={card.link}
                      className="stretched-link small"
                    >{`View ${card.title}`}</Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Recent Orders */}
          <div className="recent-orders mt-5">
            <h5 className="fw-bold mb-3">Recent Orders</h5>
            {recentOrders.length > 0 ? (
              <div className="list-group shadow-sm">
                {recentOrders.map((order) => (
                  <Link
                    key={order.orderId}
                    to={`/account/orders/${order.orderId}`}
                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>Order #{order.orderId}</strong> – {order.status}
                    </div>
                    <small className="text-muted">
                      {formatDate(order.orderDate)}
                    </small>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted">No recent orders.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    FiMenu,
    FiX,
    FiHome,
    FiBox,
    FiPlusSquare,
    FiGrid,
    FiTag,
    FiShoppingCart,
    FiUsers,
    FiStar,
    FiBell,
    FiMail,
    FiRefreshCw,
    FiBarChart2,
    FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css"; // 👈 custom styling

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false); // mobile toggle
    const [isExpanded, setIsExpanded] = useState(false); // desktop hover
    const { logout } = useAuth();
    const navigate = useNavigate();

    const links = [
        { to: "/admin/dashboard", label: "Dashboard", icon: <FiHome /> },
        { to: "/admin/products", label: "Products", icon: <FiBox /> },
        { to: "/admin/add-product", label: "Add Product", icon: <FiPlusSquare /> },
        { to: "/admin/categories", label: "Categories", icon: <FiGrid /> },
        { to: "/admin/brands", label: "Brands", icon: <FiTag /> },
        { to: "/admin/orders", label: "Orders", icon: <FiShoppingCart /> },
        { to: "/admin/users", label: "Users", icon: <FiUsers /> },
        { to: "/admin/reviews", label: "Reviews", icon: <FiStar /> },
        { to: "/admin/notifications", label: "Notifications", icon: <FiBell /> },
        { to: "/admin/contacts", label: "Contacts", icon: <FiMail /> },
        { to: "/admin/refunds", label: "Refunds", icon: <FiRefreshCw /> },
        { to: "/admin/sales", label: "Sales Report", icon: <FiBarChart2 /> },
    ];
    const handleLogout = () => {
        logout();
        navigate("/admin/login"); // 👈 redirect back to login
    };

    return (
        <>
            {/* Mobile toggle button */}
            <button
                className="btn btn-dark d-lg-none position-fixed top-0 start-0 m-2 z-1000"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`sidebar shadow-lg ${isOpen ? "show" : ""}`}
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
                style={{ width: isExpanded ? "240px" : "70px" }}
            >
                {/* Logo */}
                <div className="sidebar-header d-flex align-items-center p-3 border-bottom">
                    <span className="logo-icon">⚡</span>
                    {isExpanded && <span className="logo-text ms-2">Admin Panel</span>}
                </div>

                {/* Links */}
                <nav className="flex-grow-1 overflow-auto">
                    <ul className="list-unstyled m-0 p-2">
                        {links.map((link) => (
                            <li key={link.to}>
                                <NavLink
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `sidebar-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 ${isActive
                                            ? "active-link"
                                            : "text-light hover-link"
                                        }`
                                    }
                                    onClick={() => setIsOpen(false)} // close on mobile
                                >
                                    <span className="fs-5">{link.icon}</span>
                                    {isExpanded && <span className="fw-semibold">{link.label}</span>}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-2 border-top">
                    <button
                        onClick={handleLogout}
                        className="btn btn-outline-danger w-100 d-flex align-items-center gap-2"
                    >
                        <FiLogOut size={18} />
                        {isExpanded && <span>Logout</span>}
                    </button>
                </div>

            </aside>
        </>
    );
};

export default Sidebar;

import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
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
import "./Sidebar.css";

const Sidebar = ({ isOpen, setIsOpen }) => {
    const [isExpanded, setIsExpanded] = useState(false); // Desktop hover expand
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const links = [
        { to: "/admin/dashboard", label: "Dashboard", icon: <FiHome /> },
        { to: "/admin/products", label: "Products", icon: <FiBox /> },
        { to: "/admin/products/add", label: "Add Product", icon: <FiPlusSquare /> },
        { to: "/admin/products/view/:id", label: "View Product", icon: <FiPlusSquare /> },
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
        navigate("/admin/login");
    };

    // Detect screen size changes
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 992);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <aside
            className={`sidebar m-0 shadow-lg ${isOpen ? "show" : ""}`}
            style={{
                width: isMobile ? (isOpen ? "240px" : "70px") : isExpanded ? "240px" : "70px",
                transition: "width 0.3s",
            }}
            onMouseEnter={() => !isMobile && setIsExpanded(true)}
            onMouseLeave={() => !isMobile && setIsExpanded(false)}
        >
            {/* Logo */}
            <div className="sidebar-header p-3 border-bottom d-flex align-items-center">
                <span className="logo-icon">⚡</span>
                {(isOpen || isExpanded) && <span className="ms-2 fw-bold">Admin Panel</span>}
            </div>

            {/* Navigation */}
            <nav className="flex-grow-1">
                <ul className="list-unstyled m-0 p-2">
                    {links.map(link => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                /* className={({ isActive }) =>
                                    `sidebar-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 ${isActive ? "active-link" : "hover-link"}`
                                } */
                                className={({ isActive }) =>
                                    `sidebar-link d-flex align-items-center gap-2 px-2 py-2 rounded-3 ${isActive ? "active-link" : "hover-link"}`
                                }

                                onClick={() => isMobile && setIsOpen(false)}
                            >
                                <span className="fs-4">{link.icon}</span>
                                {(isOpen || isExpanded) && <span>{link.label}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout */}
            <div className="p-2 border-top">
                <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger w-100 d-flex align-items-center gap-2"
                >
                    <FiLogOut size={18} />
                    {(isOpen || isExpanded) && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

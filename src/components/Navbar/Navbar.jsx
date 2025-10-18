import React, { useState, useContext, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import productsData from "../../data/products/products.json";
import { useUserNotifications } from "../context/UserNotificationContext";  // ✅ FIXED
import { useComparison } from "../context/ComparisonContext";
import { CartContext } from "../context/CartContext";
import logo from "../../assets/logo.jpg";
import Fuse from "fuse.js";
import "./Navbar.css";

// Utility: normalize text (lowercase + remove punctuation)
const normalize = (text) =>
    text.toLowerCase().replace(/[^\w\s]/gi, "");

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("All");
    const { user, logout } = useContext(AuthContext);
    const { notifications, markAsRead } = useUserNotifications();
    const { comparisonList } = useComparison();
    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const debounceRef = useRef(null);

    const [showAll, setShowAll] = useState(false);
    const [expandedIds, setExpandedIds] = useState([]);

    const cartContext = useContext(CartContext);
    const { cart = [] } = cartContext || {};


    // Calculate total items in cart
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Fuse.js setup
    const fuse = useMemo(() => {
        return new Fuse(productsData, {
            keys: ["name", "category"],
            includeScore: true,
            threshold: 0.4, // adjust for fuzzy strictness
            ignoreLocation: true,
            isCaseSensitive: false,
        });
    }, []);

    // Handle input changes with debounce
    const handleChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            if (!value.trim()) {
                setSuggestions([]);
                return;
            }

            const normalizedQuery = normalize(value);

            // Fuse search
            const results = fuse.search(normalizedQuery);

            // Filter by category if not "All"
            const filteredResults = category === "All"
                ? results
                : results.filter(r => r.item.category === category);

            // Show top 5 matches
            setSuggestions(filteredResults.slice(0, 5).map(r => r.item));
        }, 300); // 300ms debounce
    };

    // Handle select product
    const handleSelect = (product) => {
        navigate(`/product/${product.id}`);
        setSearchQuery("");
        setSuggestions([]);
    };

    // Handle form submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Navigate to a products page with query & category filters
        navigate(`/products?query=${normalize(searchQuery.trim())}&category=${category}`);
        setSuggestions([]);
    };


    ////////////////////////////////////////////

    const allCategories = useMemo(() => {
        const categories = [...new Set(productsData.map((p) => p.category))];
        return ["All", ...categories];
    }, []);

    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return allCategories;
        const lowerQuery = searchQuery.toLowerCase();
        return allCategories.filter(
            (cat) => cat.toLowerCase().includes(lowerQuery) || cat === "All"
        );
    }, [searchQuery, allCategories]);

    /*    const handleSearch = (e) => {
           e.preventDefault();
           navigate(`/products?query=${searchQuery}&category=${category}`);
       }; */

    const truncateMessage = (msg, maxLen = 60) =>
        msg.length > maxLen ? msg.slice(0, maxLen) + "..." : msg;

    const toggleExpand = (id) => {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const visibleNotifications = showAll ? notifications : notifications.slice(0, 2);

    return (
        <>
            <nav className="navbar navbar-expand-md bg-primary px-2 py-2">
                <div className="d-flex align-items-center justify-content-between w-100">
                    {/* Logo */}
                    <div>
                        <Link to="/" className="navbar-brand">
                            <img src={logo} alt="Logo" className="img-fluid logo-img" />
                        </Link>
                    </div>
                    {/* 🔎 Mobile Search Bar */}
                    <form
                        className="mobile-search d-flex d-md-none flex-grow-1 ms-2 me-2 position-relative"
                        onSubmit={handleSearchSubmit}
                        style={{ width: "100%" }}
                        autoComplete="off"
                    >
                        <div className="input-group">
                            <select
                                id="mobile-category"
                                className="form-select p-1"
                                style={{ maxWidth: "100px" }}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {["All", ...Array.from(new Set(productsData.map(p => p.category)))].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="Search products..."
                                className="form-control"
                                value={searchQuery}
                                onChange={handleChange}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                            />

                            <button className="btn btn-warning" type="submit">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>

                        {/* Suggestions for Mobile */}
                        {showDropdown && suggestions.length > 0 && (
                            <ul
                                className="dropdown-menu show w-100 mt-1 shadow"
                                style={{ maxHeight: "250px", overflowY: "auto" }}
                            >
                                {suggestions.map((p) => (
                                    <li
                                        key={p.id}
                                        className="dropdown-item"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleSelect(p)}
                                    >
                                        <strong>{p.name}</strong> <small className="text-muted">({p.category})</small>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </form>


                    {/* 🔎 Desktop Search Bar */}
                    <form
                        className="d-none d-md-flex flex-grow-1 ms-4 position-relative"
                        onSubmit={handleSearchSubmit}
                        style={{ maxWidth: "600px" }}
                        autoComplete="off"
                    >
                        <div className="input-group p-1">
                            <select
                                id="category-select"
                                name="category"
                                className="form-select p-1"
                                style={{ maxWidth: "150px" }}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {["All", ...Array.from(new Set(productsData.map(p => p.category)))].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <input
                                type="text"
                                id="search-query"
                                name="searchQuery"
                                placeholder="Search..."
                                className="form-control"
                                value={searchQuery}
                                onChange={handleChange}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                            />

                            <button className="btn btn-warning" type="submit">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>

                        {/* Live Suggestions Dropdown */}
                        {showDropdown && suggestions.length > 0 && (
                            <ul
                                className="dropdown-menu show w-100 mt-1 shadow"
                                style={{ maxHeight: "300px", overflowY: "auto" }}
                            >
                                {suggestions.map((p) => (
                                    <li
                                        key={p.id}
                                        className="dropdown-item"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleSelect(p)}
                                    >
                                        <strong>{p.name}</strong> <small className="text-muted">({p.category})</small>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </form>

                    {/* Right Section */}
                    <div className="d-flex align-items-center ms-auto gap-3 text-white">
                        {/* Notifications */}
                        <div className="dropdown me-3">
                            <button
                                className="btn btn-outline-light btn-m position-relative"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="bi bi-bell"></i>
                                {notifications.some((n) => !n.isRead) && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {notifications.filter((n) => !n.isRead).length}
                                    </span>
                                )}
                            </button>

                            <ul
                                className="dropdown-menu dropdown-menu-end p-2 shadow"
                                style={{
                                    minWidth: "300px",
                                    maxHeight: "60vh",
                                    overflowY: "auto",
                                }}
                            >
                                <li className="dropdown-item text-muted small">
                                    <strong>Notifications</strong>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>

                                {notifications.length > 0 ? (
                                    <>
                                        {visibleNotifications.map((n) => {
                                            const isExpanded = expandedIds.includes(n.id);
                                            return (
                                                <li
                                                    key={n.id}
                                                    className={`dropdown-item small d-flex justify-content-between align-items-start ${!n.isRead ? "bg-light fw-bold" : ""
                                                        }`}
                                                    onClick={() => markAsRead(n.id)}
                                                    style={{ cursor: "pointer", whiteSpace: "normal" }}
                                                >
                                                    <div style={{ flex: 1 }}>
                                                        {isExpanded ? n.message : truncateMessage(n.message)}

                                                        {n.message.length > 60 && (
                                                            <button
                                                                className="btn btn-link btn-sm p-0 ms-1"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleExpand(n.id);
                                                                }}
                                                            >
                                                                {isExpanded ? "Show less" : "Show more"}
                                                            </button>
                                                        )}
                                                        <br />
                                                        <small className="text-muted">
                                                            {new Date(n.timestamp).toLocaleString()}
                                                        </small>
                                                    </div>
                                                    {!n.isRead && (
                                                        <span className="badge bg-primary ms-2">New</span>
                                                    )}
                                                </li>
                                            );
                                        })}

                                        {notifications.length > 2 && (
                                            <li className="dropdown-item text-center">
                                                <button
                                                    className="btn btn-sm btn-outline-secondary w-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowAll((prev) => !prev);
                                                    }}
                                                >
                                                    {showAll
                                                        ? "Show less notifications"
                                                        : "Show more notifications"}
                                                </button>
                                            </li>
                                        )}
                                    </>
                                ) : (
                                    <li className="dropdown-item small text-muted">
                                        No notifications
                                    </li>
                                )}

                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <Link
                                        to="/orders"
                                        className="dropdown-item text-center text-primary small"
                                    >
                                        View All Orders
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/*  Mobile Dropdown (hidden on md and above) */}
                        <div className="dropdown d-md-none">
                            <button
                                className="btn btn-light btn-sm dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Menu
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                {user ? (
                                    <>
                                        <li className="dropdown-item text-muted">
                                            Welcome, {user.name || user.email}
                                        </li>
                                        <li>
                                            <button className="dropdown-item" onClick={logout}>
                                                Logout
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <li>
                                        <Link to="/login-email" className="dropdown-item">
                                            Login
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <Link className="dropdown-item" to="/profile">
                                        <i className="bi bi-person"></i> Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/wishlist">
                                        <i className="bi bi-heart"></i> Wishlist
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/orders">
                                        <i className="bi bi-box-seam"></i> My Orders
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/user/wallet">
                                        <i className="bi bi-wallet"></i> Wallet
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/compare">
                                        <i className="bi bi-bar-chart"></i> Compare ({comparisonList.length})
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/contact">
                                        <i className="bi bi-person-lines-fill"></i> Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/settings">
                                        <i className="bi bi-gear"></i> Settings
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/cart">
                                        <i className="bi bi-cart"></i> Cart
                                    </Link>
                                </li>

                            </ul>
                        </div>

                        {/*  Desktop Section (hidden on small screens) */}
                        <div className="d-none d-md-flex align-items-center gap-4">
                            <div className="sign text-center">
                                {user ? (
                                    <>
                                        <span className="text-white me-2">
                                            Welcome, {user.name
                                                ? user.name
                                                : user.email
                                                    ? user.email
                                                    : `user-${user.mobile.slice(-4)}`}
                                        </span>

                                        <button
                                            className="btn btn-sm btn-outline-light"
                                            onClick={logout}
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/login-email" className="btn btn-light btn-sm">
                                        Login
                                    </Link>
                                )}
                            </div>

                            {/* Account Dropdown */}
                            <div className="dropdown">
                                <div
                                    className="d-flex align-items-center gap-1 dropdown-toggle"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <span>Account</span>
                                </div>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <Link className="dropdown-item" to="/profile">
                                            <i className="bi bi-person"></i> Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/wishlist">
                                            <i className="bi bi-heart"></i> Wishlist
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/orders">
                                            <i className="bi bi-box-seam"></i> My Orders
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/user/wallet">
                                            <i className="bi bi-wallet"></i> Wallet
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/compare">
                                            <i className="bi bi-bar-chart"></i>Compare
                                            <span>Compare ({comparisonList.length})</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/contact">
                                            <i className="bi bi-person-lines-fill"></i> Contact
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/settings">
                                            <i className="bi bi-gear"></i> Settings
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Cart */}
                            <Link to="/cart" className="text-white text-decoration-none position-relative me-3">
                                <i className="bi bi-cart fs-5 "></i>
                                {user && totalItems > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                           
                        </div>

                    </div>
                </div>
            </nav>

            {/* Collapsible Bottom Section in a new row */}
            <div className="w-100">
                <div className="second d-flex justify-content-start align-items-center w-100 flex-wrap bg-secondary text-white py-1">

                    {/* Left Icon & All */}
                    <div
                        className="second-1 d-flex align-items-center gap-1"
                        onClick={() => setIsOpen(!isOpen)}
                        style={{ cursor: "pointer" }}
                    >
                        <i className="bi bi-list fs-5"></i>
                        <span className="fw-bold">All</span>
                    </div>

                    {/* Menu Links (desktop, half width) */}
                    <ul className="horizontal-menu navbar-nav d-none d-md-flex flex-row gap-3 mb-0 ms-3 flex-grow-1 mx-3"
                    >
                        <li className="nav-item"><Link to="/" className="nav-link text-white text-decoration-none">Home</Link></li>
                        <li className="nav-item"><Link to="/products" className="nav-link text-white text-decoration-none">Shop</Link></li>
                        <li className="nav-item"><Link to="/deals" className="nav-link text-white text-decoration-none">Today's Deal</Link></li>
                        <li className="nav-item"><Link to="/about" className="nav-link text-white text-decoration-none">About us</Link></li>
                        <li className="nav-item"><Link to="/contact" className="nav-link text-white text-decoration-none">Contact</Link></li>
                    </ul>

                    {/* Menu Links (mobile toggle) */}
                    {isOpen && (
                        <ul className="mobile-menu list-unstyled w-100 d-md-none mt-2">
                            <li><Link to="/" className="d-block py-2 text-white text-decoration-none">Home</Link></li>
                            <li><Link to="/products" className="d-block py-2 text-white text-decoration-none">Shop</Link></li>
                            <li><Link to="/deals" className="d-block py-2 text-white text-decoration-none">Today's Deal</Link></li>
                            <li><Link to="/about" className="d-block py-2 text-white text-decoration-none">About us</Link></li>
                            <li><Link to="/contact" className="d-block py-2 text-white text-decoration-none">Contact</Link></li>
                        </ul>
                    )}

                    {/* Right Text */}
                    <div className="second-3 ms-auto me-2">
                        <span className="fw-bold">Mid Season Sale</span>
                    </div>

                </div>

            </div>
        </>
    );
}

export default Navbar;
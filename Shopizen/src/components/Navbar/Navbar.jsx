import React, { useState, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "../context/AuthContext";
import productsData from "../../../data/product_sample_data.json"; // ✅ load JSON

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All"); 
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  // ✅ Extract unique categories from product JSON
  const allCategories = useMemo(() => {
    const categories = [...new Set(productsData.map((p) => p.category))];
    return ["All", ...categories];
  }, []);

  //  Filter categories based on search input
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return allCategories; // Reset when empty
    const lowerQuery = searchQuery.toLowerCase();
    return allCategories.filter(
      (cat) => cat.toLowerCase().includes(lowerQuery) || cat === "All"
    );
  }, [searchQuery, allCategories]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?query=${searchQuery}&category=${category}`);
  };

  return (
    <>
      <nav className="navbar navbar-expand-md bg-primary px-2 py-2 ">
        <div className="d-flex align-items-center justify-content-between w-100">
          {/* Logo */}
          <div>
            <Link to="/" className="navbar-brand">
              <img
                src="../src/assets/logo.jpg"
                alt="Logo"
                className="img-fluid logo-img"
              />
            </Link>
          </div>

          {/* 🔎 Desktop Search Bar */}
          <form
            className="d-none d-md-flex flex-grow-1 ms-4 "
            onSubmit={handleSearch}
            style={{ maxWidth: "600px" }}  // Reduce overall width
          >
            <div className="input-group p-1">
              {/* Category Dropdown */}
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ maxWidth: "100px" }}  // Smaller dropdown
              >
                {filteredCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Search..."
                className="form-control"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ maxWidth: "800px" }} // ✅ Reduce input width
              />

              {/* Search Button */}
              <button className="btn btn-warning" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>


          {/* 🔎 Mobile Search Bar */}
          <form
            className="d-md-none w-100 mt-2"
            onSubmit={handleSearch}
          >
            <div className="input-group p-2"> {/* ✅ Added padding for mobile too */}
              {/* Category Dropdown */}
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ maxWidth: "35%" }}
              >
                {filteredCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Search..."
                className="form-control"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Search Button */}
              <button className="btn btn-warning" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>




          {/* Right Section */}
          <div className="d-flex align-items-center ms-auto gap-3 text-white">

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

            {/* ✅ Desktop Section (hidden on small screens) */}
            <div className="d-none d-md-flex align-items-center gap-4">
              <div className="sign text-center">
                {user ? (
                  <>
                    <span className="text-white me-2">
                      Welcome, {user.name || user.email}
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
                    <Link className="dropdown-item" to="/settings">
                      <i className="bi bi-gear"></i> Settings
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Cart */}
              <Link to="/cart" className="text-white text-decoration-none">
                <div className="d-flex align-items-center gap-1">
                  <i className="bi bi-cart"></i>
                  <span>Cart</span>
                </div>
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

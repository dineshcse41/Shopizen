// src/pages/admin/auth/AdminLogin.jsx
import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../user/auth/auth.css";
import { AuthContext } from "../../../components/context/AuthContext.jsx";
import { useToast } from "../../../components/context/ToastContext.jsx";
import adminData from "../../../data/admin/admin.json";
import rolesPermissions from "../../../data/admin/roles.json";

function AdminLogin() {
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // 📝 Pre-fill email if remembered
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("adminEmail");
    if (rememberedEmail)
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
        remember: true,
      }));
  }, []);

  // 🔁 Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🧠 Password format validation
  const isPasswordValid = (pwd) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{1,15}$/;
    return re.test(pwd);
  };

  // 🎯 Determine redirect path based on role permissions
  const getRedirectPath = (role) => {
    const roleData = rolesPermissions.find((r) => r.role === role);
    if (!roleData) return "/admin/dashboard";

    const perms = roleData.permissions;
    if (perms.includes("all")) return "/admin/dashboard";
    if (perms.includes("manageProducts")) return "/admin/products";
    if (perms.includes("manageOrders")) return "/admin/orders";
    if (perms.includes("viewUsers")) return "/admin/users";

    return "/admin/dashboard"; // fallback
  };

  // 🚀 Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });

    const { email, password, remember } = formData;
    const foundUser = adminData.find((u) => u.email === email);

    if (!foundUser) {
      setErrors((prev) => ({ ...prev, email: "Admin email not found." }));
      showToast("Admin email not found!", "error");
      return;
    }

    if (!isPasswordValid(password)) {
      setErrors((prev) => ({ ...prev, password: "Invalid password format." }));
      showToast("Invalid password format.", "error");
      return;
    }

    if (foundUser.password !== password) {
      setErrors((prev) => ({ ...prev, password: "Incorrect password." }));
      showToast("Invalid credentials!", "error");
      return;
    }

    // ✅ Successful login
    login(foundUser);
    showToast("Admin Login Successful 🎉", "success");

    if (remember) localStorage.setItem("adminEmail", email);
    else localStorage.removeItem("adminEmail");

    const redirectPath = getRedirectPath(foundUser.role);
    navigate(redirectPath);
  };

  return (
    <div className="auth-container">
      <header className="site-header">
        <h1>Shopizen Admin</h1>
      </header>

      <div className="wrapper">
        <form className="form-container" onSubmit={handleLogin}>
          <h2>ADMIN LOGIN</h2>

          {/* Email */}
          <label htmlFor="email">Admin Email</label>
          <div className="input-box">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your admin email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <i className="bi bi-person-fill"></i>
          </div>
          {errors.email && <p className="error-text">{errors.email}</p>}

          {/* Password */}
          <label htmlFor="password">Password</label>
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              maxLength="15"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <i
              className={`bi ${
                showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword((prev) => !prev)}
            ></i>
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}

          {/* Remember + Forgot Password */}
          <div className="remember-forgot">
            <label>
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              Remember me
            </label>
            <Link to="/admin/reset-password" className="forgot-password mt-2">
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button className="btn" type="submit">
            Login
          </button>

          {/* Register */}
          <div className="register-link">
            <p>
              New Admin? <Link to="/admin/register">Register Here</Link>
            </p>
          </div>
        </form>
      </div>

      <footer className="footer-bottom">
        <p>&copy; 2025 Shopizen</p>
      </footer>
    </div>
  );
}

export default AdminLogin;

import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Authentication/auth.css";
import { AuthContext } from "../../components/context/AuthContext";
import { useToast } from "../../components/context/ToastContext";
import adminData from "../../data/admin.json"; //  admin credentials

function AdminLogin() {
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // password validation
  const isPasswordValid = (pwd) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{1,15}$/;
    return re.test(pwd);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    const { email, password } = formData;

    // ✅ check if email exists in admin.json
    const foundUser = adminData.find((u) => u.email === email);

    if (!foundUser) {
      setEmailError("This email is not registered as admin.");
      showToast("Admin email not found!", "error");
      return;
    }

    // ✅ password validation
    if (!isPasswordValid(password)) {
      setPasswordError("Please enter a valid password.");
      showToast("Invalid password format.", "error");
      return;
    }

    // ✅ final check
    if (foundUser.password === password) {
      login(foundUser);
      showToast("Admin Login Successful 🎉", "success");
      navigate("/admin/dashboard");
    } else {
      setPasswordError("Incorrect password.");
      showToast("Invalid credentials!", "error");
    }
  };

  return (
    <div className="auth-container">
      <header className="site-header"><h1>Shopizen Admin</h1></header>
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
              autoComplete="username"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <i className="bi bi-person-fill"></i>
          </div>
          {emailError && <p style={{ color: "blue", fontSize: "12px" }}>{emailError}</p>}

          {/* Password */}
          <label htmlFor="password">Password</label>
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your Password"
              maxLength="15"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <i
              className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`}
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
          {passwordError && (
            <p style={{ color: "blue", fontSize: "12px" }}>{passwordError}</p>
          )}

          <button className="btn" type="submit">
            Login
          </button>

          <div className="register-link">
            <p>
              Not an Admin? <Link to="/login-email">Go to User Login</Link>
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

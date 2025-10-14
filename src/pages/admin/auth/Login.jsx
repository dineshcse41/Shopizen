import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../user/auth/auth.css";
import { AuthContext } from "../../../components/context/AuthContext.jsx";
import { useToast } from "../../../components/context/ToastContext.jsx";
import adminData from "../../../data/admin/admin.json";

function AdminLogin() {
    const { login } = useContext(AuthContext);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // 🔁 Handle input changes
    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // 🧠 Password format validation
    const isPasswordValid = (pwd) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{1,15}$/;
        return re.test(pwd);
    };

    // 🚀 Login handler
    const handleLogin = (e) => {
        e.preventDefault();
        setEmailError("");
        setPasswordError("");

        const { email, password } = formData;
        const foundUser = adminData.find((u) => u.email === email);

        if (!foundUser) {
            setEmailError("This email is not registered as admin.");
            showToast("Admin email not found!", "error");
            return;
        }

        if (!isPasswordValid(password)) {
            setPasswordError("Please enter a valid password.");
            showToast("Invalid password format.", "error");
            return;
        }

        if (foundUser.password === password) {
            login(foundUser);
            showToast("Admin Login Successful 🎉", "success");

            if (formData.remember) {
                localStorage.setItem("adminEmail", email);
            } else {
                localStorage.removeItem("adminEmail");
            }

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
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <i className="bi bi-person-fill"></i>
                    </div>
                    {emailError && <p className="error-text">{emailError}</p>}

                    {/* Password */}
                    <label htmlFor="password">Password</label>
                    <div className="input-box">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Enter your Password"
                            maxLength="15"
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
                    {passwordError && <p className="error-text">{passwordError}</p>}

                    {/* Remember Me + Forgot Password */}
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

                    {/* Register Link */}
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

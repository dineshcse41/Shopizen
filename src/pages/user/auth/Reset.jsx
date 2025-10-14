import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../../components/context/ToastContext";
import usersData from "../../../data/users/users.json"; // Dummy local JSON data
import "../auth/auth.css";

// import axios from "axios"; // Uncomment when switching to API
// const API_BASE = "http://127.0.0.1:8000/api"; // Django backend URL

function Reset() {
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // validate inputs
    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Please enter a valid email.";

        if (!formData.password) newErrors.password = "Password is required.";
        else if (formData.password.length < 6)
            newErrors.password = "Password must be at least 6 characters.";

        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            showToast("Please fix the highlighted errors.", "error");
            return false;
        }

        return true;
    };

    // handle form submission
    const handleReset = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            // ✅ Using Local Dummy JSON Data (Current)
            const user = usersData.users.find((u) => u.email === formData.email);

            if (!user) {
                setErrors({ email: "Email not found." });
                showToast("Email not registered!", "error");
                setLoading(false);
                return;
            }

            // simulate password update
            user.password = formData.password;
            showToast("Password reset successfully!", "success");
            setLoading(false);
            navigate("/login-email");

            /* 
            ✅ Uncomment this section when switching to Django API
            --------------------------------------------------------
            try {
                const res = await axios.put(`${API_BASE}/users/reset-password/`, {
                    email: formData.email,
                    password: formData.password,
                });
                showToast("Password reset successfully!", "success");
                navigate("/login-email");
            } catch (error) {
                console.error("Error resetting password:", error);
                showToast("Something went wrong. Try again!", "error");
            } finally {
                setLoading(false);
            }
            --------------------------------------------------------
            */
        } catch (error) {
            console.error("Error:", error);
            showToast("Something went wrong. Try again!", "error");
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ email: "", password: "", confirmPassword: "" });
        setErrors({});
    };

    return (
        <div className="auth-container">
            <header className="site-header">
                <h1>Shopizen</h1>
            </header>

            <div className="wrapper">
                <form className="form-container" onSubmit={handleReset}>
                    <h2>Reset Password</h2>

                    {/* Email */}
                    <label htmlFor="email">Email</label>
                    <div className="input-box">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            autoComplete="username"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <i className="bi bi-person-fill"></i>
                    </div>
                    {errors.email && <p className="error">{errors.email}</p>}

                    {/* Password */}
                    <label htmlFor="password">New Password</label>
                    <div className="input-box">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Enter your new password"
                            maxLength="15"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <i
                            className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`}
                            style={{
                                cursor: "pointer",
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                            }}
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                    </div>
                    {errors.password && <p className="error">{errors.password}</p>}

                    {/* Confirm Password */}
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-box">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Re-enter your new password"
                            maxLength="15"
                            autoComplete="current-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <i
                            className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`}
                            style={{
                                cursor: "pointer",
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                            }}
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                    </div>
                    {errors.confirmPassword && (
                        <p className="error">{errors.confirmPassword}</p>
                    )}

                    <div className="buttons">
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? "Submitting..." : "Reset Password"}
                        </button>
                        <button
                            type="button"
                            className="btn"
                            onClick={resetForm}
                            style={{ marginLeft: "10px" }}
                        >
                            Clear
                        </button>
                    </div>

                    <div className="register-link">
                        <p>
                            <Link to="/login-email">Back to Login</Link>
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

export default Reset;

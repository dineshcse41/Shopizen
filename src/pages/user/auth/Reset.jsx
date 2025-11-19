import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../../components/context/ToastContext";
import usersData from "../../../data/users/users.json"; // Array of users
import "../auth/auth.css";

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
    const [emailVerified, setEmailVerified] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Please enter a valid email.";

        if (!formData.password) newErrors.password = "Password is required.";
        else if (formData.password.length < 6)
            newErrors.password = "Password must be at least 8 characters.";

        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            showToast("Please fix the highlighted errors.", "error");
            return false;
        }
        return true;
    };

    const handleReset = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            // ✅ Correct: usersData is an array
            const user = usersData.find((u) => u.email === formData.email);

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
        } catch (error) {
            console.error("Error:", error);
            showToast("Something went wrong. Try again!", "error");
            setLoading(false);
        }
    };

    const handleKeyDownEmail = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const email = formData.email.trim();
            const userExists = usersData.find((u) => u.email === email);

            if (userExists) {
                setEmailVerified(true);
                setErrors({ email: "" });
                document.getElementById("password")?.focus();
            } else {
                setEmailVerified(false);
                setErrors({ email: "Email not registered." });
                showToast("This email is not registered!", "error");
            }
        }
    };

    const handleKeyDownPassword = (e) => {
        if (e.key === "Enter") handleReset(e);
    };

    const resetForm = () => {
        setFormData({ email: "", password: "", confirmPassword: "" });
        setErrors({});
        setEmailVerified(false);
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
                            onKeyDown={handleKeyDownEmail}
                            required
                        />
                        <i className="bi bi-person-fill"></i>
                    </div>
                    {errors.email && <p className="error" style={{ color: "blue", fontSize: "12px" }}>{errors.email}</p>}

                    {/* Passwords shown only if email verified */}
                    {emailVerified && (
                        <>
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
                                    onKeyDown={handleKeyDownPassword}
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
                            {errors.password && <p className="error" style={{ color: "blue", fontSize: "12px" }}>{errors.password}</p>}

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
                                    onKeyDown={handleKeyDownPassword}
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
                            {errors.confirmPassword && <p className="error" style={{ color: "blue", fontSize: "12px" }}>{errors.confirmPassword}</p>}

                            <div className="buttons mt-3">
                                <button type="submit" className="btn" disabled={loading}>
                                    {loading ? "Submitting..." : "Reset Password"}
                                </button>
                            </div>
                        </>
                    )}

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

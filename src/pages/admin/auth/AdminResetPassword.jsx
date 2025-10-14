import React, { useState } from "react";
import adminsData from "../../../data/admin/admin.json"; // Dummy JSON
import { useNavigate, Link } from "react-router-dom";
import "../../../pages/user/auth/auth.css";

const AdminResetPassword = () => {
    const [email, setEmail] = useState("");
    const [securityCode, setSecurityCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // 🔁 Toggle password visibility
    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    // 🔐 Handle password reset
    const handleReset = async (e) => {
        e.preventDefault();

        try {
            // -------------------
            // DUMMY JSON (CURRENT)
            // -------------------
            const admin = adminsData.find(
                (user) => user.email === email && user.securityCode === securityCode
            );

            if (!admin) {
                setMessage("❌ Invalid email or security code");
                return;
            }

            // Update password (localStorage for demo)
            const updatedAdmins = adminsData.map((user) =>
                user.email === email ? { ...user, password: newPassword } : user
            );
            localStorage.setItem("adminData", JSON.stringify(updatedAdmins));

            setMessage("✅ Password reset successful! Redirecting to login...");
            setTimeout(() => navigate("/admin/login"), 2000);

            // -------------------
            // REAL API (LATER) - Django + PostgreSQL
            // -------------------
            /*
            const response = await fetch("http://127.0.0.1:8000/api/admin/reset-password/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, securityCode, newPassword }),
            });

            if (!response.ok) {
                throw new Error("Password reset failed");
            }

            const data = await response.json();
            console.log("Password reset via API:", data);

            setMessage("✅ Password reset successful via API! Redirecting to login...");
            setTimeout(() => navigate("/admin/login"), 2000);
            */

        } catch (err) {
            console.error(err);
            setMessage("❌ Password reset failed. Try again!");
        }
    };

    return (
        <div className="auth-container">
            <header className="site-header">
                <h1>Shopizen</h1>
            </header>

            <div className="wrapper">
                <form onSubmit={handleReset} className="form-container">
                    <h3 className="text-center mb-3">Reset Password</h3>

                    {/* Email Input */}
                    <label className="form-label" htmlFor="email">
                        Admin Email
                    </label>
                    <div className="input-box">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your admin email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <i className="bi bi-person-fill"></i>
                    </div>

                    {/* Security Code Input */}
                    <label className="form-label">Security Code</label>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Enter your security code"
                            value={securityCode}
                            onChange={(e) => setSecurityCode(e.target.value)}
                            required
                        />
                        <i className="bi bi-shield-lock-fill"></i>
                    </div>

                    {/* Password Input */}
                    <label className="form-label" htmlFor="password">
                        New Password
                    </label>
                    <div className="input-box" style={{ position: "relative" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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
                            onClick={togglePassword}
                        ></i>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mt-3">
                        Reset Password
                    </button>

                    <div className="register-link mt-3 text-center">
                        <p>
                            <Link to="/admin/login">Back to Login</Link>
                        </p>
                    </div>
                </form>

                {message && <p className="text-center mt-3">{message}</p>}
            </div>
        </div>
    );
};

export default AdminResetPassword;

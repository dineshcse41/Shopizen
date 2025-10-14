import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../../components/context/ToastContext";
import usersData from "../../../data/users/users.json"; // ✅ Dummy JSON for now
// import axios from "axios"; // ✅ Uncomment when switching to backend
import "../auth/auth.css";

function Register() {
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        password: "",
        confirmPassword: "",
        remember: false,
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // basic validations
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) newErrors.name = "Name is required.";
        if (!formData.mobile) newErrors.mobile = "Mobile number is required.";
        else if (!/^[6-9]\d{9}$/.test(formData.mobile))
            newErrors.mobile = "Enter a valid 10-digit mobile number.";

        if (!formData.email) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Please enter a valid email.";

        if (!formData.password) newErrors.password = "Password is required.";
        else if (formData.password.length < 6)
            newErrors.password = "Password must be at least 6 characters.";

        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match.";

        if (!formData.remember)
            newErrors.remember = "You must agree to the Terms & Conditions.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            showToast("Please fix the highlighted errors.", "error");
            return false;
        }

        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            // ✅ CURRENT: Using dummy JSON
            const existingUser = usersData.users.find(
                (u) => u.email === formData.email
            );

            if (existingUser) {
                setErrors({ email: "Email already exists. Please log in." });
                showToast("Email already exists. Please log in.", "error");
                setLoading(false);
                return;
            }

            const newUser = {
                id: usersData.users.length + 1,
                name: formData.name,
                mobile: formData.mobile,
                email: formData.email,
                password: formData.password,
            };

            // ✅ Simulated save (local dummy push)
            usersData.users.push(newUser);

            showToast("Account created successfully!", "success");
            setLoading(false);
            navigate("/login-email");

            /* 
            ✅ LATER: Django API integration (Uncomment when backend ready)
            ---------------------------------------------------------------
            import axios from "axios";

            const API_BASE = "http://127.0.0.1:8000/api/users/";

            const res = await axios.post(API_BASE, {
                name: formData.name,
                mobile: formData.mobile,
                email: formData.email,
                password: formData.password,
            });

            if (res.status === 201) {
                showToast("Account created successfully!", "success");
                navigate("/login-email");
            } else {
                showToast("Failed to register user.", "error");
            }
            setLoading(false);
            ---------------------------------------------------------------
            */
        } catch (err) {
            console.error("Error:", err);
            showToast("Something went wrong. Try again!", "error");
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <header className="site-header">
                <h1>Shopizen</h1>
            </header>

            <div className="wrapper">
                <form className="form-container" onSubmit={handleRegister}>
                    <h2>Create Account</h2>

                    {/* Name */}
                    <label htmlFor="name">Full Name</label>
                    <div className="input-box">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <i className="bi bi-person-fill"></i>
                    </div>
                    {errors.name && <p className="error">{errors.name}</p>}

                    {/* Mobile */}
                    <label htmlFor="mobile">Mobile Number</label>
                    <div className="input-box">
                        <input
                            type="tel"
                            id="mobile"
                            name="mobile"
                            placeholder="Enter your mobile number"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                        />
                        <i className="bi bi-telephone-fill"></i>
                    </div>
                    {errors.mobile && <p className="error">{errors.mobile}</p>}

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
                        <i className="bi bi-envelope-fill"></i>
                    </div>
                    {errors.email && <p className="error">{errors.email}</p>}

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
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Re-enter your Password"
                            maxLength="15"
                            autoComplete="current-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <i
                            className={`bi ${showConfirmPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`}
                            style={{
                                cursor: "pointer",
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                            }}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        ></i>
                    </div>
                    {errors.confirmPassword && (
                        <p className="error">{errors.confirmPassword}</p>
                    )}

                    {/* Terms & Conditions */}
                    <div className="privacy">
                        <input
                            id="remember"
                            name="remember"
                            type="checkbox"
                            checked={formData.remember}
                            onChange={handleChange}
                        />
                        I agree to the <Link to="">Terms & Conditions</Link> and Privacy Policy
                    </div>
                    {errors.remember && <p className="error">{errors.remember}</p>}

                    <br />
                    <button className="btn" type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Create Account"}
                    </button>

                    <div className="login-link">
                        <p className="account">
                            Have an account? <Link to="/login-email">Login</Link>
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

export default Register;


import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../auth/auth.css";
import { useAuth } from "../../../components/context/AuthContext";
import { CartContext } from "../../../components/context/CartContext";
import { useToast } from "../../../components/context/ToastContext";
import usersData from "../../../data/users/users.json"; // Dummy JSON

function Login() {
    const { login } = useAuth();
    const { addToCart } = useContext(CartContext);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({ email: "", password: "", remember: false });
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allUsers] = useState(usersData); // Default to dummy JSON
    const [emailVerified, setEmailVerified] = useState(false); // New state

    const registeredEmails = allUsers.map((u) => u.email);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const isPasswordValid = (pwd) => pwd && pwd.length >= 6;

    const handleLogin = async (e) => {
        e.preventDefault();
        setPasswordError("");
        setLoading(true);

        const { email, password } = formData;

        const userFound = allUsers.find((u) => u.email === email && u.password === password);

        if (userFound) {
            login(userFound, { idleMinutes: 20, absoluteHours: 8 });
            showToast("Login successful! 🎉", "success");

            const { from, intent, product } = location.state || {};
            if (intent === "buyNow" && product) {
                navigate("/checkout", {
                    state: { buyNowProduct: { ...product, quantity: product.quantity || 1 } },
                });
                setLoading(false);
                return;
            }
            navigate(from || "/");
        } else {
            setPasswordError("Incorrect password.");
            showToast("Invalid credentials! Try again.", "error");
        }

        setLoading(false);
    };

    const togglePassword = () => setShowPassword(!showPassword);

    const handleKeyDownEmail = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const email = formData.email.trim();
            if (registeredEmails.includes(email)) {
                setEmailVerified(true);
                setEmailError("");
                document.getElementById("password")?.focus();
            } else {
                setEmailVerified(false);
                setEmailError("This email is not registered. Please register.");
                showToast("This email is not registered!", "error");
            }
        }
    };

    const handleKeyDownPassword = (e) => {
        if (e.key === "Enter") {
            handleLogin(e);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const newUser = { id: user.uid, name: user.displayName, email: user.email, photo: user.photoURL, provider: "google" };
            login(newUser);
            showToast("Google Login Successful! 🎉", "success");
            navigate("/");
        } catch (err) {
            console.error(err);
            showToast("Google login failed. Try again.", "error");
        }
    };

    return (
        <div className="auth-container">
            <header className="site-header"><h1>Shopizen</h1></header>
            <div className="wrapper">
                <form className="form-container" onSubmit={handleLogin}>
                    <h2>LOG IN</h2>

                    <label htmlFor="email">User Email</label>
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
                    {emailError && <p style={{ color: "blue", fontSize: "12px" }}>{emailError}</p>}

                    {emailVerified && (
                        <>
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
                                    onKeyDown={handleKeyDownPassword}
                                    required
                                />
                                <i
                                    className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`}
                                    style={{ cursor: "pointer" }}
                                    onClick={togglePassword}
                                ></i>
                            </div>
                            {passwordError && <p style={{ color: "blue", fontSize: "12px" }}>{passwordError}</p>}
                        </>
                    )}

                    <div className="remember-forgot">
                        <label>
                            <input
                                id="remember"
                                name="remember"
                                type="checkbox"
                                checked={formData.remember}
                                onChange={handleChange}
                            /> Remember me
                        </label>
                        <Link to="/Reset" className="forgot-password mt-2">Forgot Password?</Link>
                    </div>

                    {emailVerified && (
                        <button className="btn" type="submit" disabled={loading}>
                            {loading ? "Logging In..." : "Login"}
                        </button>
                    )}

                    <div className="register-link">
                        <p>Don't Have An Account? <Link to="/Register">Register</Link></p>
                    </div>

                    <div className="d-flex align-items-center my-3">
                        <div className="flex-grow-1"><hr className="m-0" /></div>
                        <span className="px-2 text-muted">Or</span>
                        <div className="flex-grow-1"><hr className="m-0" /></div>
                    </div>

                    <div className="alt-login d-flex justify-content-between gap-2">
                        <button
                            type="button"
                            className="btn w-100 text-wrap"
                            onClick={handleGoogleLogin}
                            style={{ whiteSpace: "normal" }}
                        >
                            <i className="bi bi-google me-2"></i>
                            Google
                        </button>

                        <Link to="/login-mobile" className="w-100 d-block">
                            <button
                                type="button"
                                className="btn w-100 text-wrap"
                                style={{ whiteSpace: "normal" }}
                            >
                                Login OTP
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
            <footer className="footer-bottom">
                <p>&copy; 2025 Shopizen</p>
            </footer>
        </div>
    );
}

export default Login;

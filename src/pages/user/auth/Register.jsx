import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../../../components/context/ToastContext";
import { useAuth } from "../../../components/context/AuthContext.jsx";
import "../auth/auth.css";

function Register() {
    const { showToast } = useToast();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
      //username: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      password: "",
      confirmPassword: "",
      remember: false,
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Password criteria state
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        upper: false,
        lower: false,
        digit: false,
        special: false,
    });

    // Live input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (name === "password") validatePassword(value);
    };

    // Live password validation
    const validatePassword = (pwd) => {
        setPasswordCriteria({
            length: pwd.length >= 6 && pwd.length <= 15,
            upper: /[A-Z]/.test(pwd),
            lower: /[a-z]/.test(pwd),
            digit: /\d/.test(pwd),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
        });
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};
        const { length, upper, lower, digit, special } = passwordCriteria;

        //if (!formData.username) newErrors.name = "Name is required.";
        if (!formData.first_name) newErrors.first_name = "First name is required.";
if (!formData.last_name) newErrors.last_name = "Last name is required.";

        if (!formData.phone_number) newErrors.phone_number = "Mobile number is required.";
        else if (!/^[6-9]\d{9}$/.test(formData.phone_number))
            newErrors.phone_number = "Enter a valid 10-digit mobile number.";
 
        if (!formData.email) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Enter a valid email.";

        if (!formData.password) newErrors.password = "Password is required.";
        else if (!(length && upper && lower && digit && special))
            newErrors.password = "Password does not meet required criteria.";

        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match.";

        if (!formData.remember)
            newErrors.remember = "You must agree to Terms & Conditions.";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            showToast("Please fix the highlighted errors.", "error");
            return false;
        }

        return true;
    };

    // Enter key submission
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleRegister(e);
        }
    };

    // Register user with backend
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            const API_BASE = "http://127.0.0.1:8000/authentication/api/register/";

            const res = await axios.post(API_BASE, {
              first_name: formData.first_name,
              last_name: formData.last_name,
              //full_name: formData.username,
              phone_number: formData.phone_number,
              email: formData.email,
              password: formData.password,
              confirm_password: formData.confirmPassword
});
            if (res.status === 201) {
                // Backend returns created user object
                const newUser = res.data;

                // Auto login using AuthContext
                login(newUser);

                showToast("Account created successfully!", "success");
                navigate("/login-email"); // Redirect to login
            }
        } catch (err) {
            if (err.response) {
                const backendMsg = err.response.data?.detail || "Registration failed.";
                showToast(backendMsg, "error");
            } else {
                showToast("Something went wrong. Try again!", "error");
            }
            console.error("Registration Error:", err);
        } finally {
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
           {/*  <label htmlFor="username">Full Name</label>
            <div className="input-box">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your full name"
                value={formData.username}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                required
              />
              <i className="bi bi-person-fill"></i>
            </div>
            {errors.username && (
              <p className="error" style={{ color: "blue", fontSize: "12px" }}>
                {errors.username}
              </p>
            )}
 */}

            {/* First Name */}
<label htmlFor="first_name">First Name</label>
<div className="input-box">
  <input
    type="text"
    id="first_name"
    name="first_name"
    placeholder="Enter your first name"
    value={formData.first_name}
    onChange={handleChange}
    onKeyDown={handleKeyDown}
    required
  />
  <i className="bi bi-person-fill"></i>
</div>
{errors.first_name && (
  <p className="error" style={{ color: "blue", fontSize: "12px" }}>
    {errors.first_name}
  </p>
)}

{/* Last Name */}
<label htmlFor="last_name">Last Name</label>
<div className="input-box">
  <input
    type="text"
    id="last_name"
    name="last_name"
    placeholder="Enter your last name"
    value={formData.last_name}
    onChange={handleChange}
    onKeyDown={handleKeyDown}
    required
  />
  <i className="bi bi-person-fill"></i>
</div>
{errors.last_name && (
  <p className="error" style={{ color: "blue", fontSize: "12px" }}>
    {errors.last_name}
  </p>
)}


              {/* Mobile
              <label htmlFor="mobile">Mobile Number</label>
              <div className="input-box">
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  placeholder="Enter your mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  required
                />
                <i className="bi bi-telephone-fill"></i>
              </div>
              {errors.mobile && (
                <p className="error" style={{ color: "blue", fontSize: "12px" }}>
                  {errors.mobile}
                </p>
              )} */}
              {/* Mobile */}
              <label htmlFor="mobile">Mobile Number</label>
              <div className="input-box">
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  placeholder="Enter your mobile number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  required
                  />
                <i className="bi bi-telephone-fill"></i>
              </div>
              {errors.mobile && (
                <p className="error" style={{ color: "blue", fontSize: "12px" }}>
                  {errors.mobile}
                </p>
              )}



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
                onKeyDown={handleKeyDown}
                required
              />
              <i className="bi bi-envelope-fill"></i>
            </div>
            {errors.email && (
              <p className="error" style={{ color: "blue", fontSize: "12px" }}>
                {errors.email}
              </p>
            )}

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
                onKeyDown={handleKeyDown}
                required
              />
              <i
                className={`bi ${
                  showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"
                }`}
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

            {errors.password && (
              <p className="error" style={{ color: "blue", fontSize: "12px" }}>
                {errors.password}
              </p>
            )}

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
                onKeyDown={handleKeyDown}
                required
              />
              <i
                className={`bi ${
                  showConfirmPassword ? "bi-eye-fill" : "bi-eye-slash-fill"
                }`}
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
              <p className="error" style={{ color: "blue", fontSize: "12px" }}>
                {errors.confirmPassword}
              </p>
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
              I agree to the <Link to="">Terms & Conditions</Link> and Privacy
              Policy
            </div>
            {errors.remember && (
              <p className="error" style={{ color: "blue", fontSize: "12px" }}>
                {errors.remember}
              </p>
            )}

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

import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import useFormSubmit from '../../components/useFormSubmit';
import { useToast } from "../../components/context/ToastContext";

function Register() {
  const {
    formData,
    showPassword,
    showConfirmPassword,
    togglePassword,
    toggleConfirmPassword,
    handleChange,
    handleSubmit,
    loading } = useFormSubmit({}, "http://localhost:5173/data/user.json");

  const [errors, setErrors] = useState({});
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Validate inputs before submission
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required.";
    }

    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.remember) {
      newErrors.remember = "You must agree to the Terms & Conditions.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      showToast("Please fix the highlighted errors.", "error");
    }

    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Check if email already exists
      const res = await fetch("http://localhost:5000/users");
      const users = await res.json();

      if (users.find(u => u.email === formData.email)) {
        setErrors({ email: "Email already exists. Please log in." });
        showToast("Email already exists. Please log in.", "error");
        return;
      }

      // Create new user object
      const newUser = {
        id: users.length + 1,
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        password: formData.password
      };

      // Save to JSON Server (this writes to user.json)
      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      showToast("Account created successfully!", "success");
      navigate("/login-email"); // redirect after registration
    } catch (error) {
      console.error("Error:", error);
      showToast("Something went wrong. Try again!", "error");
    }
  };

  return (
    <div className='auth-container'>
      {/* Header */}
      <header className="site-header">
        <h1>Shopizen</h1>
      </header>

      {/* Register Form */}
      <div className="wrapper">
        <form className="form-container" onSubmit={onSubmit}>
          <h2>Create Account</h2>

          {/* Name */}
          <label htmlFor="name">Full Name</label>
          <div className="input-box">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name || ""}
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
              value={formData.mobile || ""}
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
              value={formData.email || ""}
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
              value={formData.password || ""}
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
              onClick={togglePassword}
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
              placeholder="Re-enter your Password"
              maxLength="15"
              autoComplete="current-password"
              value={formData.confirmPassword || ""}
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
              onClick={toggleConfirmPassword}
            ></i>
          </div>
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

          {/* Terms & Conditions */}
          <div className="privacy">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={formData.remember || false}
              onChange={handleChange}
            />
            I agree to the <Link to="">Terms & Conditions</Link> and Privacy Policy
          </div>
          {errors.remember && <p className="error">{errors.remember}</p>}

          {/* Create Account */}
          <br />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Create Account"}
          </button>

          {/* Login */}
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

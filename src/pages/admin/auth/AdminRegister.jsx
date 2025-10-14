import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../../components/context/ToastContext";
import useFormSubmit from "../../../components/common/useFormSubmit";
import "../../../pages/user/auth/auth.css";

function AdminRegister() {
    const {
        formData,
        showPassword,
        showConfirmPassword,
        togglePassword,
        toggleConfirmPassword,
        handleChange,
    } = useFormSubmit({}, "http://localhost:5173/data/admin/admin.json"); // Dummy JSON

    const [errors, setErrors] = useState({});
    const { showToast } = useToast();
    const navigate = useNavigate();

    const validateForm = () => {
        let newErrors = {};

        if (!formData.fullName) newErrors.fullName = "Full name is required.";
        if (!formData.email) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Invalid email format.";
        if (!formData.password || formData.password.length < 6)
            newErrors.password = "Password must be at least 6 characters.";
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match.";

        if (!formData.designation) newErrors.designation = "Enter your designation.";
        if (!formData.department) newErrors.department = "Enter your department.";
        if (!formData.employeeId) newErrors.employeeId = "Employee ID is required.";
        if (!formData.securityCode) newErrors.securityCode = "Security code required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showToast("Please fix errors before submitting.", "error");
            return;
        }

        const newAdmin = {
            id: Date.now(),
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            designation: formData.designation,
            department: formData.department,
            employeeId: formData.employeeId,
            securityCode: formData.securityCode,
        };

        try {
            // -------------------
            // DUMMY JSON SAVE (CURRENT)
            // -------------------
            console.log("Registered Admin (Dummy):", newAdmin);
            showToast("Admin registered successfully!", "success");
            navigate("/admin/login");

            // -------------------
            // REAL API SAVE (LATER)
            // -------------------
            /*
            const response = await fetch("http://127.0.0.1:8000/api/admin/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newAdmin),
            });

            if (!response.ok) {
                throw new Error("API registration failed");
            }

            const data = await response.json();
            console.log("Registered Admin (API):", data);
            showToast("Admin registered successfully via API!", "success");
            navigate("/admin/login");
            */

        } catch (err) {
            console.error(err);
            showToast("Registration failed. Try again!", "error");
        }
    };

    return (
        <div className="auth-container">
            <header className="site-header">
                <h1>Shopizen Admin</h1>
            </header>

            <div className="wrapper">
                <form className="form-container" onSubmit={handleRegister}>
                    <h2>Admin Registration</h2>

                    {/* Name */}
                    <label>Full Name</label>
                    <div className="input-box">
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter full name"
                            value={formData.fullName || ""}
                            onChange={handleChange}
                            required
                        />
                        <i className="bi bi-person-fill"></i>
                    </div>
                    {errors.fullName && <p className="error">{errors.fullName}</p>}

                    {/* Email */}
                    <label>Email</label>
                    <div className="input-box">
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email || ""}
                            onChange={handleChange}
                            required
                        />
                        <i className="bi bi-envelope-fill"></i>
                    </div>
                    {errors.email && <p className="error">{errors.email}</p>}

                    {/* Designation */}
                    <label>Designation</label>
                    <div className="input-box">
                        <input
                            type="text"
                            name="designation"
                            placeholder="e.g. Manager, Supervisor"
                            value={formData.designation || ""}
                            onChange={handleChange}
                            required
                        />
                        <i className="bi bi-briefcase-fill"></i>
                    </div>
                    {errors.designation && <p className="error">{errors.designation}</p>}

                    {/* Department */}
                    <label>Department</label>
                    <div className="input-box">
                        <input
                            type="text"
                            name="department"
                            placeholder="e.g. Operations, IT, HR"
                            value={formData.department || ""}
                            onChange={handleChange}
                            required
                        />
                        <i className="bi bi-building"></i>
                    </div>
                    {errors.department && <p className="error">{errors.department}</p>}

                    {/* Employee ID */}
                    <label>Employee ID</label>
                    <div className="input-box">
                        <input
                            type="text"
                            name="employeeId"
                            placeholder="Enter your employee ID"
                            value={formData.employeeId || ""}
                            onChange={handleChange}
                            required
                        />
                        <i className="bi bi-card-list"></i>
                    </div>
                    {errors.employeeId && <p className="error">{errors.employeeId}</p>}

                    {/* Security Code */}
                    <label>Security Code</label>
                    <div className="input-box">
                        <input
                            type="password"
                            name="securityCode"
                            placeholder="Enter your professional registration code"
                            value={formData.securityCode || ""}
                            onChange={handleChange}
                            required
                        />
                        <i className="bi bi-shield-lock-fill"></i>
                    </div>
                    {errors.securityCode && <p className="error">{errors.securityCode}</p>}

                    {/* Password */}
                    <label>Password</label>
                    <div className="input-box">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Create a password"
                            value={formData.password || ""}
                            onChange={handleChange}
                            required
                        />
                        <i
                            className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`}
                            onClick={togglePassword}
                            style={{ cursor: "pointer" }}
                        ></i>
                    </div>
                    {errors.password && <p className="error">{errors.password}</p>}

                    {/* Confirm Password */}
                    <label>Confirm Password</label>
                    <div className="input-box">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword || ""}
                            onChange={handleChange}
                            required
                        />
                        <i
                            className={`bi ${showConfirmPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`}
                            onClick={toggleConfirmPassword}
                            style={{ cursor: "pointer" }}
                        ></i>
                    </div>
                    {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

                    <button className="btn" type="submit">
                        Register
                    </button>

                    <div className="register-link">
                        <p>
                            Already an Admin? <Link to="/admin/login">Login</Link>
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

export default AdminRegister;

import React from 'react'
import { Link } from 'react-router-dom';
import './auth.css'
import useFormSubmit from '../../src/components/useFormSubmit';


function Reset() {
  const { formData, showPassword, togglePassword, handleChange,
    handleSubmit, loading, error, response } = useFormSubmit({}, "http://localhost:5173/data/user.json");
  
  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      remember: false
    });
  };

  return (
    <div className='auth-container'>
      {/* Header */}
      <header  className="site-header" >
        <h1>Shopizen</h1>
      </header>

      <div  className="wrapper">
        <form className="form-container" 
        onSubmit={handleSubmit}>

          <h2>Reset Password</h2>

          {/* Email */}
          <label htmlFor="email">Username</label>
          <div className="input-box">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="username"
              value={formData.email || ""}
              onChange={handleChange}
              required />
            <i className="bi bi-person-fill"></i>
          </div>

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
              required />
            <i className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`}
              style={{
                cursor: "pointer",
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
              onClick={togglePassword}></i>
          </div>

          {/* Confrim Password */}
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Enter your Password"
              maxLength="15"
              autoComplete="current-password"
              value={formData.confirmpassword || ""}
              onChange={handleChange}
              required />
            <i className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`}
              style={{
                cursor: "pointer",
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
              onClick={togglePassword}></i>
          </div>

          {/* Reset */}
          <button
            className="btn"
            type="button"
            onClick={resetForm} // clears form state
          >
            Reset
          </button>


          <div  className="register-link">
            <p><Link to="/login-email">Back to Login</Link></p>
          </div>
        </form>
      </div>

      <footer  className="footer-bottom">
        <p>&copy; 2025 Shopizen</p>
      </footer>
    </div>
  )
}

export default Reset
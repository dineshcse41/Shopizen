import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../auth/auth.css";
import { useAuth } from "../../../components/context/AuthContext";
import { CartContext } from "../../../components/context/CartContext";
import { useToast } from "../../../components/context/ToastContext";
//import usersData from "../../../data/users/users.json"; // Dummy JSON
import axios from "axios";

function Login() {
  const { login } = useAuth();
  const { addToCart } = useContext(CartContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Change formData key to 'identifier' instead of 'email' for clarity
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    remember: false,
  });

 /*  const [formData, setFormData] = useState({ email: "", password: "", remember: false });
   */
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  //const [allUsers] = useState(usersData); // Default to dummy JSON
  //const [emailVerified, setEmailVerified] = useState(false); // New state

  //const registeredEmails = allUsers.map((u) => u.email);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const isPasswordValid = (pwd) => pwd && pwd.length >= 6;

  /*  const handleLogin = async (e) => {
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
 */

  //backend integaration


//   const handleLogin = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setPasswordError("");

//   try {
//     const API_BASE = "http://127.0.0.1:8000/authentication/api/login/";
//     const res = await axios.post(API_BASE, {
//       username: formData.identifier,
//       password: formData.password,
//     });

//     const { access, refresh, user } = res.data;

//     // localStorage.setItem("access_token", access);
//     // localStorage.setItem("refresh_token", refresh);

//     // login(user, { idleMinutes: 20, absoluteHours: 8 });

//     showToast("Login successful! 🎉", "success");
//     navigate("/");
//   } catch (err) {
//     console.error(err.response || err);
//     setPasswordError("Incorrect email or password.");
//     showToast("Invalid credentials! Try again.", "error");
//   } finally {
//     setLoading(false);
//   }
// };

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setPasswordError("");

  try {
    const API_BASE = "http://127.0.0.1:8000/authentication/api/login/";
    // send "username" (which may be username OR email) so backend tries both
    const res = await axios.post(API_BASE, {
      email: formData.identifier,  // or use "identifier" if you prefer, backend accepts both
      password: formData.password,
    });

    const { access, refresh, user } = res.data;

    // Save tokens (you can choose storage strategy)
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    // Update your auth context (login should expect user object)
    if (typeof login === "function") login(user)

    showToast("Login successful! 🎉", "success");
    navigate("/");
  } catch (err) {
    console.error("Login error:", err.response ? err.response.data : err.message);
    const serverMessage = err?.response?.data?.error || "Invalid credentials! Try again.";
    setPasswordError(serverMessage);
    showToast(serverMessage, "error");
  } finally {
    setLoading(false);
  }
};

  const togglePassword = () => setShowPassword(!showPassword);



  const handleKeyDownPassword = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const newUser = {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        provider: "google",
      };
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
      <header className="site-header">
        <h1>Shopizen</h1>
      </header>
      <div className="wrapper">
        <form className="form-container" onSubmit={handleLogin}>
          <h2>LOG IN</h2>

          <label htmlFor="email">User Email</label>
          <div className="input-box">
             
            <input
  type="text"
  id="identifier"
  name="identifier"
  placeholder="Enter your email or username"
  autoComplete="username"
  value={formData.identifier}
  onChange={handleChange}
  required
/>
            <i className="bi bi-person-fill"></i>
          </div>
          {emailError && (
            <p style={{ color: "blue", fontSize: "12px" }}>{emailError}</p>
          )}

          {/*  {emailVerified && (
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
                    )} */}

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
              className={`bi ${
                showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"
              }`}
              style={{ cursor: "pointer" }}
              onClick={togglePassword}
            ></i>
          </div>

          <div className="remember-forgot">
            <label>
              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={formData.remember}
                onChange={handleChange}
              />{" "}
              Remember me
            </label>
            <Link to="/Reset" className="forgot-password mt-2">
              Forgot Password?
            </Link>
          </div>

          {/*  {emailVerified && (
              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Logging In..." : "Login"}
              </button>
            )} */}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Login"}
          </button>

          <div className="register-link">
            <p>
              Don't Have An Account? <Link to="/Register">Register</Link>
            </p>
          </div>

          <div className="d-flex align-items-center my-3">
            <div className="flex-grow-1">
              <hr className="m-0" />
            </div>
            <span className="px-2 text-muted">Or</span>
            <div className="flex-grow-1">
              <hr className="m-0" />
            </div>
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

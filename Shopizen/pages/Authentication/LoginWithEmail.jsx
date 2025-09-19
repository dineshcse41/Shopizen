import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './auth.css';
import useFormSubmit from '../../components/useFormSubmit';
import { AuthContext } from '../../components/context/AuthContext';
import { CartContext } from '../../components/context/CartContext';
import { useToast } from "../../components/context/ToastContext";


function Login() {
    const { login } = useContext(AuthContext); //  global auth
    const { addToCart } = useContext(CartContext); // to honor addToCart intent after login
    const { showToast } = useToast();
    const { formData, showPassword, togglePassword, handleChange, loading } =
        useFormSubmit({}, 'http://localhost:5173/data/user.json');

    const [registeredEmails, setRegisteredEmails] = useState([]);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [firstEmailInvalid, setFirstEmailInvalid] = useState(false);
    const [firstPasswordInvalid, setFirstPasswordInvalid] = useState(false);
    const [emailValid, setEmailValid] = useState(false);

    const navigate = useNavigate();
    const location = useLocation(); // get previous location + intent from ProductDetail

    // Fetch registered emails
    useEffect(() => {
        fetch('../data/user.json')
            .then((res) => res.json())
            .then((data) => {
                const emails = data.users.map((u) => u.email);
                setRegisteredEmails(emails);
            })
            .catch((err) => console.error('Error loading user.json:', err));
    }, []);

    // Password validation
    const isPasswordValid = (pwd) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{1,15}$/;
        return re.test(pwd);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');

        // Email validation
        if (!registeredEmails.includes(formData.email)) {
            if (!firstEmailInvalid) {
                setEmailError('This email is not registered. Please register.');
                setFirstEmailInvalid(true);
            }
            setEmailValid(false);
            //  error toast
            showToast("This email is not registered!", "error");
            return;
        } else {
            setEmailValid(true);
            setFirstEmailInvalid(false);
        }

        // Password validation
        if (!isPasswordValid(formData.password || '')) {
            if (!firstPasswordInvalid) {
                setPasswordError('Please enter a valid password.');
                setFirstPasswordInvalid(true);
            }
            //  error toast
            showToast("Invalid password format.", "error");
            return;
        } else {
            setFirstPasswordInvalid(false);
        }

        try {
            const res = await fetch('../data/user.json');
            const data = await res.json();

            const userFound = data.users.find(
                (u) => u.email === formData.email && u.password === formData.password
            );

            if (userFound) {
                login(userFound);
                // success toast
                showToast("Login successful! 🎉", "success");

                const { from, intent, product } = location.state || {};
                if (intent === "buyNow" && product) {
                    navigate("/checkout", {
                        state: {
                            buyNowProduct: {
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                summary: product.description,
                                quantity: product.quantity || 1,
                                image: product.image,
                            },
                        },
                    });
                    return;
                }

                navigate(from || "/");
            } else {
                //  error toast
                showToast("Invalid credentials! Try again.", "error");
            }
        } catch (err) {
            console.error(err);
            //  error toast
            showToast("Error logging in. Try again later.", "error");
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

            let existingUsers = JSON.parse(localStorage.getItem("googleUsers")) || [];
            if (!existingUsers.some((u) => u.email === newUser.email)) {
                existingUsers.push(newUser);
                localStorage.setItem("googleUsers", JSON.stringify(existingUsers));
            }

            // success toast
            showToast("Google Login Successful! 🎉", "success");
            navigate("/");
        } catch (err) {
            console.error("Google Login Error:", err);
            //  error toast
            showToast("Google login failed. Try again.", "error");
        }
    };


    return (
        <div className='auth-container'>
            <header className="site-header"><h1>Shopizen</h1></header>
            <div className="wrapper">
                <form className="form-container" onSubmit={handleLogin}>
                    <h2>LOG IN</h2>

                    {/* Email */}
                    <label htmlFor="email">User Email</label>
                    <div className="input-box">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            autoComplete="username"
                            value={formData.email || ''}
                            onChange={(e) => {
                                handleChange(e);
                                if (registeredEmails.includes(e.target.value)) {
                                    setEmailError('');
                                    setFirstEmailInvalid(false);
                                    setEmailValid(true);
                                } else {
                                    setEmailValid(false);
                                }
                            }}
                            required
                        />
                        <i className="bi bi-person-fill"></i>
                    </div>
                    {emailError && <p style={{ color: 'blue', fontSize: '12px' }}>{emailError}</p>}

                    {/* Password (only after a valid/known email) */}
                    {emailValid && (
                        <>
                            <label htmlFor="password">Password</label>
                            <div className="input-box">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    placeholder="Enter your Password"
                                    maxLength="15"
                                    autoComplete="current-password"
                                    value={formData.password || ''}
                                    onChange={(e) => {
                                        handleChange(e);
                                        if (isPasswordValid(e.target.value)) {
                                            setPasswordError('');
                                            setFirstPasswordInvalid(false);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleLogin(e);
                                    }}
                                    required
                                />
                                <i
                                    className={`bi ${showPassword ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={togglePassword}
                                ></i>
                            </div>
                            {passwordError && (
                                <p style={{ color: 'blue', fontSize: '12px' }}>{passwordError}</p>
                            )}
                        </>
                    )}

                    {emailValid && (
                        <>
                            <div className="remember-forgot">
                                <label>
                                    <input
                                        id="remember"
                                        name="remember"
                                        type="checkbox"
                                        value={formData.remember || ''}
                                        onChange={handleChange}
                                    />
                                    Remember me
                                </label>
                                <Link to="/Reset">Forgot Password?</Link>
                            </div>

                            <button className="btn" type="submit" disabled={loading}>
                                {loading ? 'Logging In...' : 'Login'}
                            </button>
                        </>
                    )}

                    <div className="register-link">
                        <p>
                            Don't Have An Account? <Link to="/Register">Register</Link>
                        </p>
                    </div>

                      {/* Alternative Login */}
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
                        {/* Google Button */}
                        <div className="flex-fill">
                            <button
                                type="button"
                                className="btn w-100 "

                                 onClick={handleGoogleLogin}
                            >
                                <i className="bi bi-google me-2"></i>Google
                            </button>
                        </div>

                        {/* Mobile Login Button */}
                        <div className="flex-fill">
                            <Link to="/login-mobile" className="w-100 d-block">
                                <button type="button" className="btn w-100">
                                    Login with Mobile
                                </button>
                            </Link>
                        </div>
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
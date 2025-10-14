import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../../components/context/AuthContext';
import { useToast } from "../../../components/context/ToastContext";
import usersData from "../../../data/users/users.json"; // Dummy JSON

// Uncomment when API is ready
// import axios from "axios";
// const API_URL = "http://127.0.0.1:8000/api/users/"; // Django endpoint

function MobileLogin() {
    const [countryCode, setCountryCode] = useState("+91");
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [step, setStep] = useState("mobile");
    const [errorMessage, setErrorMessage] = useState("");
    const [otpError, setOtpError] = useState("");
    const [registeredNumbers, setRegisteredNumbers] = useState([]);
    const [showResend, setShowResend] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [firstAttemptInvalid, setFirstAttemptInvalid] = useState(false);

    const { showToast } = useToast();
    const navigate = useNavigate();
    const { login } = useAuth();

    // Load registered numbers from dummy JSON or API
    useEffect(() => {
        // Dummy JSON
        setRegisteredNumbers(usersData.map(u => u.mobile));

        // API fetch (commented for now)
        // const fetchUsers = async () => {
        //     try {
        //         const response = await axios.get(API_URL);
        //         setRegisteredNumbers(response.data.map(u => u.mobile));
        //     } catch (err) {
        //         console.error("Failed to fetch users from API:", err);
        //         setRegisteredNumbers(usersData.map(u => u.mobile)); // fallback
        //     }
        // };
        // fetchUsers();
    }, []);

    useEffect(() => {
        let interval = null;
        if (showResend && resendTimer > 0 && step === "otp") {
            interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
        } else if (resendTimer === 0) {
            setIsResendDisabled(false);
        }
        return () => clearInterval(interval);
    }, [showResend, resendTimer, step]);

    const handleSendOtp = () => {
        setErrorMessage(""); setOtpError("");

        if (mobile.length < 5) {
            setErrorMessage("Please enter a valid mobile number.");
            showToast("Please enter a valid mobile number.", "error");
            return;
        }

        if (!registeredNumbers.includes(mobile)) {
            if (!firstAttemptInvalid) setFirstAttemptInvalid(true);
            setErrorMessage("This mobile number is not registered. Please register.");
            showToast("This mobile number is not registered!", "error");
            return;
        }

        setFirstAttemptInvalid(false);
        setErrorMessage("");

        const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otpValue);
        setStep("otp");
        setShowResend(true);
        setResendTimer(30);
        setIsResendDisabled(true);

        showToast(`Your OTP is: ${otpValue}`, "info");
    };

    const handleVerifyOtp = () => {
        if (otp === generatedOtp) {
            const mobileUser = {
                name: `User-${mobile.slice(-4)}`,
                email: `${mobile}@mobile.fake`,
                mobile: `${countryCode}${mobile}`,
                method: "mobile",
            };

            login(mobileUser, { idleMinutes: 20, absoluteHours: 8 });

            setShowResend(false);
            setOtpError("");
            showToast("Mobile login successful! 🎉", "success");
            navigate("/");
        } else {
            setOtpError("Invalid OTP. Try again.");
            setIsResendDisabled(false);
            showToast("Invalid OTP. Try again.", "error");
        }
    };

    const handleResendOtp = () => {
        const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otpValue);
        setOtp("");
        setOtpError("");
        setResendTimer(30);
        setIsResendDisabled(true);
        setShowResend(true);

        showToast(`New OTP is: ${otpValue}`, "info");
    };

    return (
        <div className="auth-container">
            <header className="site-header"><h1>Shopizen</h1></header>

            <div className="wrapper">
                <form className="form-container" onSubmit={e => e.preventDefault()}>
                    <h2>{step === "mobile" ? "LOGIN WITH MOBILE" : "ENTER OTP"}</h2>

                    {step === "mobile" ? (
                        <>
                            <label htmlFor="mobile">Mobile Number</label>
                            <div className="input-box"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    border: "2px solid rgba(3,3,3,0.2)",
                                    borderRadius: "40px",
                                    padding: "5px 10px",
                                    background: "transparent"
                                }}>
                                <select id="countryCode"
                                    name="countryCode" value={countryCode}
                                    onChange={e => setCountryCode(e.target.value)}
                                    style={{
                                        border: "none", background: "transparent", fontSize: "14px",
                                        paddingRight: "5px",
                                        outline: "none",
                                        cursor: "pointer"
                                    }}>

                                    <option value="+91">+91</option>
                                    <option value="+1">+1</option>
                                    <option value="+44">+44</option>
                                    <option value="+61">+61</option>
                                    <option value="+971">+971</option>
                                </select>
                                <span style={{ margin: "0 5px", color: "#333" }}>|</span>
                                <input
                                    type="tel"
                                    id="mobile"
                                    name="mobile"
                                    placeholder="Enter mobile number"
                                    value={mobile}
                                    onChange={e => {
                                        setMobile(e.target.value);
                                        setErrorMessage("");
                                        setFirstAttemptInvalid(false);
                                    }}
                                    onKeyDown={e => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleSendOtp();
                                        }
                                    }}
                                    style={{ flex: 1, border: "none", outline: "none", fontSize: "14px", background: "transparent" }}
                                />
                            </div>

                            {errorMessage && <p style={{ color: "blue", fontSize: "12px", marginTop: "5px" }}>{errorMessage}</p>}

                            <button className="btn" type="button" onClick={handleSendOtp}>Send OTP</button>

                            <div className="register-link">
                                <p className="account">
                                    Prefer login with email? <Link to="/login-email">Login with Email</Link>
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <label htmlFor="otp">Enter OTP</label>
                            <div className="input-box">
                                <input
                                    type="text"
                                    id="otp"
                                    name="otp"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleVerifyOtp();
                                        }
                                    }}
                                />
                            </div>

                            {otpError && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{otpError}</p>}

                            <button className="btn" type="button" onClick={handleVerifyOtp}>Verify OTP</button>

                            {showResend && (
                                <button
                                    type="button"
                                    className="btn"
                                    style={{ marginTop: "10px", backgroundColor: "#f0ad4e" }}
                                    onClick={handleResendOtp}
                                    disabled={isResendDisabled}
                                >
                                    {isResendDisabled ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                                </button>
                            )}
                        </>
                    )}
                </form>
            </div>

            <footer className="footer-bottom">
                <p>&copy; 2025 Shopizen</p>
            </footer>
        </div>
    );
}

export default MobileLogin;


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../components/context/AuthContext';
import { useToast } from "../../components/context/ToastContext";
import "./auth.css";

function MobileLogin() {
    const [countryCode, setCountryCode] = useState("+91");
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [step, setStep] = useState("mobile");
    const [errorMessage, setErrorMessage] = useState(""); // mobile error
    const [otpError, setOtpError] = useState(""); // OTP error
    const [registeredNumbers, setRegisteredNumbers] = useState([]);
    const [showResend, setShowResend] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [firstAttemptInvalid, setFirstAttemptInvalid] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth(); // ✅ global auth

    // Fetch user data once
    useEffect(() => {
        fetch("../data/user.json")
            .then(res => res.json())
            .then(data => setRegisteredNumbers(data.users.map(u => u.mobile)))
            .catch(err => console.error("Error loading user.json:", err));
    }, []);

    // Timer countdown for Resend OTP
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
        setErrorMessage("");
        setOtpError("");

        if (mobile.length < 5) {
            setErrorMessage("Please enter a valid mobile number.");
            showToast("Please enter a valid mobile number.", "error");
            return;
        }

        if (!registeredNumbers.includes(mobile)) {
            if (!firstAttemptInvalid) {
                setErrorMessage("This mobile number is not registered. Please register.");
                setFirstAttemptInvalid(true);
            }
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

        // info toast (instead of alert)
        showToast(`Your OTP is: ${otpValue}`, "info");
    };

    const handleVerifyOtp = () => {
        if (otp === generatedOtp) {
            login({
                mobile: `${countryCode}${mobile}`,
                method: "mobile",
                timestamp: new Date().toISOString()
            });

            setShowResend(false);
            setOtpError("");
            //  success toast
            showToast("Mobile login successful! 🎉", "success");
            navigate("/");
        } else {
            setOtpError("Invalid OTP. Try again.");
            setIsResendDisabled(false);
            //  error toast
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

        //  info toast
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
                                        border: "none", background:
                                            "transparent", fontSize: "14px",
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
                                        setErrorMessage(""); // hide error immediately
                                        setFirstAttemptInvalid(false); // reset invalid flag
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


/* 
Change your handleSendOtp and handleVerifyOtp to call backend API instead of local generatedOtp.
For India, MSG91 or Fast2SMS are cheaper OTP services.

const handleSendOtp = async () => {
  if (mobile.length < 5) {
    setErrorMessage("Please enter a valid mobile number.");
    showToast("Please enter a valid mobile number.", "error");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: `${countryCode}${mobile}` }),
    });
    const data = await res.json();

    if (data.success) {
      setStep("otp");
      setShowResend(true);
      setResendTimer(30);
      setIsResendDisabled(true);
      showToast("OTP sent to your mobile 📲", "success");
    } else {
      showToast(data.message, "error");
    }
  } catch (err) {
    showToast("Failed to send OTP", "error");
  }
};

const handleVerifyOtp = async () => {
  try {
    const res = await fetch("http://localhost:5000/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: `${countryCode}${mobile}`, otp }),
    });
    const data = await res.json();

    if (data.success) {
      login({ mobile: `${countryCode}${mobile}`, method: "mobile" });
      showToast("Mobile login successful! 🎉", "success");
      navigate("/");
    } else {
      setOtpError("Invalid OTP. Try again.");
      setIsResendDisabled(false);
      showToast("Invalid OTP", "error");
    }
  } catch (err) {
    showToast("Verification failed", "error");
  }
};


 */
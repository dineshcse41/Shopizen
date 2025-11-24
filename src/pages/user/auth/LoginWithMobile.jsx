import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../../components/context/AuthContext';
import { useToast } from "../../../components/context/ToastContext";
import axios from "axios";

const SEND_OTP_API = "http://127.0.0.1:8000/authentication/sendotp/";
const VERIFY_OTP_API = "http://127.0.0.1:8000/authentication/verifyotp/";

function MobileLogin() {
    const [countryCode, setCountryCode] = useState("+91");
    const [phone_number, setPhone_number] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState("phone_number");
    const [errorMessage, setErrorMessage] = useState("");
    const [otpError, setOtpError] = useState("");
    const [showResend, setShowResend] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const { showToast } = useToast();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        let interval = null;
        if (showResend && resendTimer > 0 && step === "otp") {
            interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
        } else if (resendTimer === 0) {
            setIsResendDisabled(false);
        }
        return () => clearInterval(interval);
    }, [showResend, resendTimer, step]);

    // ----------------- SEND OTP -----------------
    const handleSendOtp = async () => {
        setErrorMessage("");
        setOtpError("");

        if (phone_number.length < 5) {
            showToast("Please enter a valid mobile number.", "error");
            return;
        }

        setLoading(true);

        try {
            await axios.post(SEND_OTP_API, {
                phone_number: countryCode + phone_number
            });

            showToast("OTP sent successfully!", "success");

            setStep("otp");
            setShowResend(true);
            setResendTimer(30);
            setIsResendDisabled(true);
            setSelectedUser({ phone_number: countryCode + phone_number });

        } catch (err) {
            console.error(err);
            showToast("Mobile number not registered!", "error");
        } finally {
            setLoading(false);
        }
    };

    // ----------------- VERIFY OTP -----------------
    const handleVerifyOtp = async () => {
        if (!otp) {
            setOtpError("Please enter OTP");
            return;
        }

        if (!selectedUser) {
            showToast("Phone number missing!", "error");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(VERIFY_OTP_API, {
                phone_number: selectedUser.phone_number,
                otp: otp
            });

            const data = response.data;

            login(
                {
                    id: data.user.id,
                    email: data.user.email,
                    phone_number: data.user.phone,
                    method: "phone_number",
                },
                { idleMinutes: 20, absoluteHours: 8 }
            );

            showToast("Mobile login successful! 🎉", "success");
            setShowResend(false);
            setOtpError("");
            navigate("/");

        } catch (err) {
            console.error(err);
            setOtpError("Invalid OTP");
            setIsResendDisabled(false);
            showToast("Invalid OTP! Try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    // ----------------- RESEND OTP -----------------
    const handleResendOtp = async () => {
        if (!selectedUser) return;

        setLoading(true);
        try {
            await axios.post(SEND_OTP_API, {
                phone_number: selectedUser.phone_number
            });

            showToast("OTP resent successfully!", "success");
            setOtp("");
            setOtpError("");
            setResendTimer(30);
            setIsResendDisabled(true);
            setShowResend(true);

        } catch (err) {
            console.error(err);
            showToast("Failed to resend OTP.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container ">
            <header className="site-header"><h1>Shopizen</h1></header>

            <div className="wrapper">
                <form className="form-container" onSubmit={e => e.preventDefault()}>
                    <h2>{step === "phone_number" ? "LOGIN WITH MOBILE" : "ENTER OTP"}</h2>

                    {step === "phone_number" ? (
                        <>
                            <label htmlFor="phone_number">Mobile Number</label>
                            <div className="input-box" style={{ display: "flex", alignItems: "center", border: "2px solid rgba(3,3,3,0.2)", borderRadius: "30px", padding: "6px 12px", background: "transparent", width: "100%", maxWidth: "400px", margin: "0 auto" }}>
                                <select id="countryCode" name="countryCode" value={countryCode} onChange={e => setCountryCode(e.target.value)} style={{ border: "none", background: "transparent", fontSize: "15px", paddingRight: "6px", outline: "none", cursor: "pointer", flexShrink: 0 }}>
                                    <option value="+91">+91</option>
                                    <option value="+1">+1</option>
                                    <option value="+44">+44</option>
                                    <option value="+61">+61</option>
                                    <option value="+971">+971</option>
                                </select>
                                <span style={{ margin: "0 6px", color: "#333", flexShrink: 0 }}>|</span>
                                <input
                                    type="tel"
                                    id="phone_number"
                                    name="phone_number"
                                    placeholder="Enter mobile number"
                                    value={phone_number}
                                    onChange={e => { setPhone_number(e.target.value); setErrorMessage(""); }}
                                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleSendOtp(); } }}
                                    style={{ flexGrow: 1, minWidth: 0, border: "none", outline: "none", fontSize: "16px", background: "transparent", textAlign: "left", padding: "5px" }}
                                />
                            </div>

                            {errorMessage && <p style={{ color: "blue", fontSize: "12px", marginTop: "5px" }}>{errorMessage}</p>}

                            <button className="btn mt-3" type="button" onClick={handleSendOtp} disabled={loading}>{loading ? "Sending OTP..." : "Send OTP"}</button>

                            <div className="register-link">
                                <p className="account">Prefer login with email? <Link to="/login-email">Login with Email</Link></p>
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
                                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleVerifyOtp(); } }}
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
                                    disabled={isResendDisabled || loading}
                                >
                                    {isResendDisabled ? `Resend OTP in ${resendTimer}s` : loading ? "Sending..." : "Resend OTP"}
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

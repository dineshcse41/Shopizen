import React, { useContext, useState } from "react";
import { AuthContext } from "../../../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";
import "./VerifyNow.css";

const VerifyNowPage = () => {
    const { user, setUser } = useContext(AuthContext);
    const [emailInput, setEmailInput] = useState(user?.email || "");
    const [verificationCode, setVerificationCode] = useState("");
    const [message, setMessage] = useState("");
    const [step, setStep] = useState("request"); // 'request' or 'verify'
    const navigate = useNavigate();

    // Simulate sending verification code
    const handleSendCode = (e) => {
        e.preventDefault();
        if (!emailInput) {
            setMessage("Please enter your email address.");
            return;
        }
        setMessage("Verification code sent to your email!");
        setStep("verify");
    };

    // Simulate verifying the code
    const handleVerify = (e) => {
        e.preventDefault();
        if (verificationCode === "123456") {
            // Update AuthContext user
            const updatedUser = { ...user, emailVerified: true };
            setUser(updatedUser);

            setMessage("✅ Email verified successfully!");
            setTimeout(() => navigate("/account/profile"), 2000);
        } else {
            setMessage("❌ Invalid verification code. Please try again.");
        }
    };

    return (
        <div className="verify-now-container">
            <h2>Email Verification</h2>
            <p className="text-muted">
                Please verify your email address to unlock all account features.
            </p>

            {message && (
                <Alert variant={message.includes("✅") ? "success" : "info"}>
                    {message}
                </Alert>
            )}

            {step === "request" ? (
                <Form onSubmit={handleSendCode} className="verify-form">
                    <Form.Group>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="Enter your registered email"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3">
                        Send Verification Code
                    </Button>
                </Form>
            ) : (
                <Form onSubmit={handleVerify} className="verify-form">
                    <Form.Group>
                        <Form.Label>Enter Verification Code</Form.Label>
                        <Form.Control
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="Enter the 6-digit code"
                        />
                    </Form.Group>
                    <Button variant="success" type="submit" className="mt-3">
                        Verify Email
                    </Button>
                </Form>
            )}
        </div>
    );
};

export default VerifyNowPage;

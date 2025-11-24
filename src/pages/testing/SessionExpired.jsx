// src/pages/Testing/SessionExpired.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./SessionExpired.css";

function SessionExpired() {
    const navigate = useNavigate();

    const handleLogin = () => navigate("/login-email");

    return (
        <div className="session-expired-container d-flex align-items-center justify-content-center vh-100">
            <div className="card shadow-lg text-center p-5 session-expired-card">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/1828/1828665.png"
                    alt="Session Expired"
                    className="session-icon mb-4"
                    style={{ width: 120 }}
                />
                <h2 className="mb-3 text-danger fw-bold">Session Expired</h2>
                <p className="text-muted mb-4">
                    Your session ended due to inactivity or timed out for security reasons.
                    Please sign in again to continue shopping.
                </p>
                <div className="d-flex gap-2 justify-content-center">
                    <button className="btn btn-primary btn-lg" onClick={handleLogin}>
                        Go to Login
                    </button>
                    <button
                        className="btn btn-outline-secondary btn-lg"
                        onClick={() => {
                            // clear any leftover storage just in case and navigate to home
                            localStorage.removeItem("loggedInUser_v2");
                            navigate("/");
                        }}
                    >
                        Return Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SessionExpired;

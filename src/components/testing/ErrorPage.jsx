import React from "react";
import { Link } from "react-router-dom";

import "./ErrorPage.css";

function ErrorPage({ code, title, message, image, btnHome = true, btnSupport = false }) {
    return (
        <div className="error-container d-flex align-items-center justify-content-center text-center">
            <div className="error-content">
                {image && <img src={image} alt={title} className="error-img" />}
                <h1 className="display-4 fw-bold text-danger">{code}</h1>
                <h2 className="mb-3">{title}</h2>
                <p className="text-muted">{message}</p>
                {btnHome && (
                    <Link to="/" className="btn btn-primary btn-lg mt-3 shadow-sm">
                        Back to Home
                    </Link>
                )}
                {btnSupport && (
                    <Link to="/contact" className="btn btn-dark btn-lg mt-3 ms-2">
                        Contact Support
                    </Link>
                )}
            </div>
        </div>
    );
}

export default ErrorPage;

import React from "react";

export default function MaintenancePage() {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
            <h1 className="display-4 text-danger mb-3">🚧 Site Under Maintenance 🚧</h1>
            <p className="lead mb-4">We are performing some scheduled updates. Please check back soon!</p>
            <p className="text-muted">Thank you for your patience 🙏</p>
        </div>
    );
}

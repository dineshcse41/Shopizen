import React from "react";
import './ProgressBar.css';

const ProgressBar = ({ step }) => {
    return (
        <div className="progressbar-container d-flex justify-content-center align-items-center my-2 flex-wrap">
            {/* Step 1 */}
            <div className="step-circle">
                <div className={`step rounded-circle text-white text-center ${step >= 1 ? "active" : "inactive"}`}>
                    <i className="bi bi-cart-check-fill"></i>
                </div>
                <small className="fw-semibold">Cart</small>
            </div>

            <div className={`progress-line ${step > 1 ? "filled" : ""}`}></div>

            {/* Step 2 */}
            <div className="step-circle">
                <div className={`step rounded-circle text-white text-center ${step >= 2 ? "active" : "inactive"}`}>
                    <i className="bi bi-house-door-fill"></i>
                </div>
                <small className="fw-semibold">Checkout</small>
            </div>

            <div className={`progress-line ${step > 2 ? "filled" : ""}`}></div>

            {/* Step 3 */}
            <div className="step-circle">
                <div className={`step rounded-circle text-white text-center ${step === 3 ? "active" : "inactive"}`}>
                    <i className="bi bi-check2-circle"></i>
                </div>
                <small className="fw-semibold">Confirm</small>
            </div>
        </div>
    );
};

export default ProgressBar;

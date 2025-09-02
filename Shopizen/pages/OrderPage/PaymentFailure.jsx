// PaymentFailure.jsx
import React from "react";
import { Link } from "react-router-dom";

const PaymentFailure = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="p-5 border rounded shadow text-center bg-white">
        <h2 className="text-danger">❌ Payment Failed</h2>
        <p className="mt-3">
          Oops! Your payment could not be completed. Please try again.
        </p>

        <Link to="/checkout" className="btn btn-warning mt-4">
          Try Again
        </Link>
        <Link to="/" className="btn btn-outline-secondary mt-2">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailure;

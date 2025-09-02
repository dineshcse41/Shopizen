// PaymentSuccess.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const orderData = location.state?.orderData;

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="p-5 border rounded shadow text-center bg-white">
        <h2 className="text-success">✅ Payment Successful</h2>
        <p className="mt-3">Your order has been placed successfully!</p>

        {orderData && (
          <div className="mt-4 text-start">
            <h5>Order Summary</h5>
            <p>
              <strong>Order ID:</strong> {orderData.id}
            </p>
            <p>
              <strong>Total Paid:</strong> ₹{orderData.totalPrice}
            </p>
            <p>
              <strong>Payment ID:</strong> {orderData.razorpay_payment_id}
            </p>
          </div>
        )}

        <Link to="/orders" className="btn btn-primary mt-4">
          View My Orders
        </Link>
        <Link to="/" className="btn btn-outline-secondary mt-2">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;

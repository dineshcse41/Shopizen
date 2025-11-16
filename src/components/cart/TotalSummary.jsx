import React from "react";
import { Link } from "react-router-dom";

const TotalSummary = ({ cart }) => {
  const isCartEmpty = !Array.isArray(cart) || cart.length === 0;

  // --- Total items ---
  const totalItems = cart.reduce((sum, p) => sum + p.quantity, 0);

  // --- Total price (price already per item variant) ---
  const totalPrice = cart.reduce(
    (sum, p) => sum + (p.price || 0) * p.quantity,
    0
  );

  // --- Total delivery charge ---
  const totalDelivery = cart.reduce(
    (sum, p) => sum + (p.deliveryCharge || 0) * p.quantity,
    0
  );

  const orderTotal = totalPrice + totalDelivery;

  // --- Determine currency from first item (fallback INR) ---
  const currency = cart[0]?.currency || "INR";

  // --- Helper for formatting ---
  const formatPrice = (amount) =>
    new Intl.NumberFormat(navigator.language, {
      style: "currency",
      currency: currency,
    }).format(amount);

  return (
    <div
      className="total-sec p-2 border d-flex flex-column"
      style={{ position: "sticky", top: "100px" }}
    >
      <h4 className="text-center">Product Total</h4>
      <span className="h5 m-2">Total Items: {totalItems}</span>

      <div className="d-flex justify-content-between">
        <span>Total Price: </span>
        <span>
          <strong>{formatPrice(totalPrice)}</strong>
        </span>
      </div>

      <div className="d-flex justify-content-between">
        <span>Delivery:</span>
        <span>{formatPrice(totalDelivery)}</span>
      </div>

      <hr />

      <div className="d-flex justify-content-between">
        <span>Order Price: </span>
        <span className="h5">
          <strong>{formatPrice(orderTotal)}</strong>
        </span>
      </div>

      <div className="mt-auto d-flex justify-content-center">
        {!isCartEmpty ? (
          <Link
            to="/checkout"
            state={{ itemsToCheckout: cart }}
            className="w-100"
          >
            <button className="btn btn-outline-primary rounded">
              Proceed to Checkout
            </button>
          </Link>
        ) : (
          <button className="btn btn-outline-primary rounded w-100" disabled>
            Add items to checkout
          </button>
        )}
      </div>
    </div>
  );
};

export default TotalSummary;

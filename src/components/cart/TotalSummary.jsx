import React from "react";
import { Link } from "react-router-dom";

const TotalSummary = ({ cart }) => {
    const isCartEmpty = !Array.isArray(cart) || cart.length === 0;

    // Total items
    const totalItems = cart.reduce((sum, p) => sum + p.quantity, 0);

    // Total price
    const totalPrice = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

    // Total delivery charge (fetch from product JSON, default 0)
    const totalDelivery = cart.reduce(
        (sum, p) => sum + (p.deliveryCharge || 0) * p.quantity,
        0
    );

    const orderTotal = totalPrice + totalDelivery;

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
                    <strong>₹{totalPrice}</strong>
                </span>
            </div>

            <div className="d-flex justify-content-between">
                <span>Delivery:</span>
                <span>₹{totalDelivery}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between">
                <span>Order Price: </span>
                <span className="h5">
                    <strong>₹{orderTotal}</strong>
                </span>
            </div>

            <div className="mt-auto d-flex justify-content-center">
                {!isCartEmpty ? (
                    <Link to="/checkout" state={{ itemsToCheckout: cart }} className="w-100">
                        <button className="btn btn-outline-primary rounded">Proceed to Checkout</button>
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

import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CartContext } from "../../../components/context/CartContext";
import { AuthContext } from "../../../components/context/AuthContext";
import ProgressBar from "../../../components/cart/ProgressBar";
import CheckoutForm from "../../../components/cart/CheckoutForm";
import "./order.css";

const CheckoutPage = () => {
    const { cart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const buyNowProduct = location.state?.buyNowProduct;
    const itemsToCheckout = buyNowProduct ? [buyNowProduct] : cart;
    // Total items
    const totalItems = itemsToCheckout.reduce((sum, p) => sum + p.quantity, 0);

    // Total price
    const totalPrice = itemsToCheckout.reduce((sum, p) => sum + p.price * p.quantity, 0);

    // Total delivery charge (from JSON, default 0)
    const deliveryCharge = itemsToCheckout.reduce(
        (sum, p) => sum + (p.deliveryCharge || 0) * p.quantity,
        0
    );
    const [paymentResult, setPaymentResult] = useState(null);
    const [detailsConfirmed, setDetailsConfirmed] = useState(false);


    // -----------------------------------------------
    // 🚀 DELIVERY CHARGE SECTION
    // Default: ₹0
    // Future: Uncomment API fetch when backend is ready
    // -----------------------------------------------
    /*
    useEffect(() => {
        const fetchDeliveryCharge = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/delivery-charge/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        total_price: totalPrice,
                        user_id: user?.id,
                    }),
                });
                const data = await response.json();
                setDeliveryCharge(data.delivery_charge);
            } catch (error) {
                console.error("Error fetching delivery charge:", error);
            }
        };

        if (totalPrice > 0) fetchDeliveryCharge();
    }, [totalPrice, user]);
    */

    const orderTotal = totalPrice + deliveryCharge;

    return (
        <>
            <div className="bg-white m-0">
                <div className="row align-items-center justify-content-between text-center text-md-start p-2">
                    <div className="col-12 col-md-4 mb-2">
                        <span className="h4 h-md-3 ms-md-5">
                            Secure Checkout <i className="bi bi-cart2"></i>
                        </span>
                    </div>
                    <div className="col-12 col-md-8 d-flex justify-content-center justify-content-md-end">
                        <ProgressBar step={2} />
                    </div>
                </div>
            </div>

            <div className="checkout-page d-flex flex-column flex-md-row m-1 gap-3">
                {/* LEFT SIDE FORM */}
                <div className="checkout-form flex-fill w-100 w-md-70 mx-auto">
                    <CheckoutForm
                        user={user}
                        itemsToCheckout={itemsToCheckout}
                        detailsConfirmed={detailsConfirmed}
                        setDetailsConfirmed={setDetailsConfirmed}
                        buyNowProduct={buyNowProduct}
                        clearCart={clearCart}
                        navigate={navigate}
                        setPaymentResult={setPaymentResult}
                    />
                </div>

                {/* RIGHT SIDE SUMMARY */}
                <div className="checkout-summary flex-fill mt-3 mt-md-0">
                    <div
                        className="total-sec p-3 border d-flex flex-column rounded shadow-sm"
                       
                    >
                        <h4 className="text-center">Product Total</h4>
                        <span className="h5 m-2">Total Items: {totalItems}</span>

                        <div className="d-flex justify-content-between">
                            <span>Total Price: </span>
                            <span><strong>₹{totalPrice}</strong></span>
                        </div>

                        <div className="d-flex justify-content-between">
                            <span>Delivery:</span>
                            <span>₹{deliveryCharge}</span>
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between">
                            <span>Order Price: </span>
                            <span className="h5"><strong>₹{orderTotal}</strong></span>
                        </div>

                        <div className="col-12 text-end">
                            <button
                                type="submit"
                                form="checkoutForm"
                                className="btn btn-outline-primary mt-3 w-100"
                                disabled={!detailsConfirmed || itemsToCheckout.length === 0}
                            >
                                Place Order
                            </button>
                            <Link to="/cart" className="btn btn-outline-secondary w-100 mt-2">
                                Back to Cart
                            </Link>
                        </div>
                    </div>
                </div>
                
            </div>

            {/* Payment Result Modal */}
            {paymentResult && (
                <>
                    <div
                        className="modal-backdrop fade show"
                        onClick={() => setPaymentResult(null)}
                    ></div>

                    <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content text-center p-4">
                                {paymentResult.success ? (
                                    <>
                                        <h2 className="text-success">Payment Successful!</h2>
                                        <p>Order ID: <strong>{paymentResult.order?.id}</strong></p>
                                        <p>Your order is being processed.</p>
                                        <button className="btn btn-primary mt-3" onClick={() => navigate("/orders")}>
                                            View Orders
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-danger">Payment Failed!</h2>
                                        <p>{paymentResult.error || "Please try again."}</p>
                                        <button className="btn btn-warning mt-3" onClick={() => setPaymentResult(null)}>
                                            Back to Checkout
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default CheckoutPage;

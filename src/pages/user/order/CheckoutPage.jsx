import React, { useContext, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CartContext } from "../../../components/context/CartContext";
import { AuthContext } from "../../../components/context/AuthContext";
import ProgressBar from "../../../components/cart/ProgressBar";
import CheckoutForm from "../../../components/cart/CheckoutForm"; //  fixed typo
import "./order.css";

const CheckoutPage = () => {
    const { cart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [paymentResult, setPaymentResult] = useState(null); //  store result

    const buyNowProduct = location.state?.buyNowProduct;
    const itemsToCheckout = buyNowProduct ? [buyNowProduct] : cart;

    const totalItems =
        itemsToCheckout?.reduce((sum, p) => sum + p.quantity, 0) || 0;
    const totalPrice =
        itemsToCheckout?.reduce((sum, p) => sum + p.price * p.quantity, 0) || 0;

    return (
        <>
            
            <div className="bg-white m-0">
                <div className="bg-white m-0">
                    <div className="row align-items-center justify-content-between text-center text-md-start p-2">
                        {/* Title Section */}
                        <div className="col-12 col-md-4 mb-2">
                            <span className="h4 h-md-3 ms-md-5">
                                Secure Checkout <i className="bi bi-cart2"></i>
                            </span>
                        </div>

                        {/* ProgressBar Section */}
                        <div className="col-12 col-md-8 d-flex justify-content-center justify-content-md-end">
                            <ProgressBar step={2} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="checkout-page d-flex flex-column flex-md-row m-1 gap-3">
                {/* LEFT SIDE FORM */}
                <div className="checkout-form flex-fill w-100 w-md-70 mx-auto">
                    <CheckoutForm
                        user={user}
                        itemsToCheckout={itemsToCheckout}
                        buyNowProduct={buyNowProduct}
                        clearCart={clearCart}
                        navigate={navigate}
                        setPaymentResult={setPaymentResult} //  pass setter
                    />
                </div>

                {/* RIGHT SIDE SUMMARY */}
                <div className="checkout-summary flex-fill mt-3 mt-md-0">
                    <div
                        className="total-sec p-3 border d-flex flex-column rounded shadow-sm "
                        style={{ position: "sticky", top: "100px", height: "330px" }}
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
                            <span>₹0</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                            <span>Order Price: </span>
                            <span className="h5">
                                <strong>₹{totalPrice}</strong>
                            </span>
                        </div>

                        <div className="col-12 text-end">
                            <button
                                type="submit"
                                form="checkoutForm"
                                className="btn btn-outline-primary mt-3 w-100"
                                disabled={itemsToCheckout.length === 0}
                            >
                                Place Order
                            </button>
                            <Link to="/cart" className="btn btn-outline-secondary  w-100 mt-2">
                                Back to Cart
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/*  Payment Result Modal */}
            {paymentResult && (
                <>
                    {/* Backdrop */}
                    <div
                        className="modal-backdrop fade show"
                        onClick={() => setPaymentResult(null)}
                    ></div>

                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        style={{ zIndex: 1050 }}
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content text-center p-4">
                                {paymentResult.success ? (
                                    <>
                                        <h2 className="text-success"> Payment Successful!</h2>
                                        <p>
                                            Order ID: <strong>{paymentResult.order?.id}</strong>
                                        </p>
                                        <p>
                                            Thank you for your purchase. Your order is being processed.
                                        </p>
                                        <button
                                            className="btn btn-primary mt-3"
                                            onClick={() => navigate("/orders")}
                                        >
                                            View Orders
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-danger"> Payment Failed!</h2>
                                        <p>{paymentResult.error || "Please try again."}</p>
                                        <p>Please try again or choose another payment method.</p>
                                        <button
                                            className="btn btn-warning mt-3"
                                            onClick={() => setPaymentResult(null)} // close modal
                                        >
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
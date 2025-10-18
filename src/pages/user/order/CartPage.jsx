import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../../components/context/CartContext";

import ProgressBar from "../../../components/cart/ProgressBar";
import CartItem from "../../../components/cart/CartItem";
import TotalSummary from "../../../components/cart/TotalSummary";

import "./order.css";

const CartPage = () => {
    const { cart } = useContext(CartContext);

    return (
        <>
        
            <div className="bg-white m-0">
                <div className="bg-white m-0">
                    <div className="row align-items-center justify-content-between text-center text-md-start p-2">
                        {/* Title Section */}
                        <div className="col-12 col-md-4 mb-2">
                            <span className="h4 h-md-3 ms-md-5">
                                Shopizen Cart <i className="bi bi-cart2"></i>
                            </span>
                        </div>

                        {/* ProgressBar Section */}
                        <div className="col-12 col-md-8 d-flex justify-content-center justify-content-md-end">
                            <ProgressBar step={1} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="cart-container container-fluid">
                <h3 className="p-2">Product Details</h3>

                <div className="row">
                    {/* Cart Items */}
                    <div className="col-12 col-md-9 p-2">
                        {Array.isArray(cart) && cart.length > 0 ? (
                            cart.map((p) =>
                                <CartItem key={p.id ?? p.sku ?? Math.random()} product={p} />)
                        ) : (
                            <div className="text-center my-4">
                                <p>Your cart is empty.</p>
                                <Link to="/products">
                                    <button className="btn btn-primary mt-2">
                                        Shop Now
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Total Summary */}
                    <div className="col-12 col-md-3 p-2">
                        <div className="sticky-summary">
                            <TotalSummary cart={Array.isArray(cart) ? cart : []} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartPage;

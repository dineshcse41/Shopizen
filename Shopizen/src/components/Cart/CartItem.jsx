import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Cart.css";
import { WishlistContext } from "../../components/context/WishlistContext.jsx";

const CartItem = ({ product }) => {
    const { removeFromCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);
    const { addToWishlist } = useContext(WishlistContext);
    const navigate = useNavigate();

    // ✅ Move to Wishlist
    const moveToWishlist = () => {
        addToWishlist(product);
        removeFromCart(product.id);
    };

    // ✅ Move to Checkout
    const moveToCheckout = () => {
        navigate("/checkout", { state: { product } });
        removeFromCart(product.id);
    };

    return (
        <div className="cart-item border d-flex col ">
            <div className="product-image p-3 col-3" style={{ objectfit: "contain" }}>
                <img className="w-100 h-100" src={product.image} alt={product.name} />
            </div>

            <div className="product-details col-6 p-3">
                <h5 className="product-name">{product.description}</h5>
                <span className="product-price h5"><strong>₹{product.price}</strong></span>
                {product.oldPrice && (
                    <span className="text-decoration-line-through text-muted ms-1">₹{product.oldPrice}</span>
                )}
                <br />

                {/* size dropdown */}
                <div className="dropdown">
                    <span>Size:</span>
                    <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false"></button>
                    <ul className="dropdown-menu ">
                        <li><Link className="dropdown-item" to="#">S</Link></li>
                        <li><Link className="dropdown-item" to="#">M</Link></li>
                        <li><Link className="dropdown-item" to="#">L</Link></li>
                        <li><Link className="dropdown-item" to="#">XL</Link></li>
                        <li><Link className="dropdown-item" to="#">XLL</Link></li>
                    </ul>
                </div>

                {/* quantity controls */}
                <div className="quantity d-flex align-items-center">
                    <span>Quantity: </span>
                    <button className="btn btn-outline-secondary mx-2" onClick={() => decreaseQuantity(product.id)}>-</button>
                    <span>{product.quantity}</span>
                    <button className="btn btn-outline-secondary mx-2" onClick={() => increaseQuantity(product.id)}>+</button>
                </div>

                <div className="d-flex justify-content-start m-0">
                    <div className="link-page d-flex p-3 justify-content-between gap-3">
                        <Link to={`/products/category/${product.category}`} className="text-decoration-none">
                            Similar Products
                        </Link>


                        {/* ✅ Move to Wishlist */}
                        <button className="btn btn-link text-decoration-none p-0" onClick={moveToWishlist}>
                            Move to Wishlist
                        </button>

                        {/* ✅ Move to Checkout */}
                        {/*  <button className="btn btn-link text-decoration-none p-0" onClick={moveToCheckout}>
                            Move to Checkout
                        </button> */}

                        {/* Share */}
                        <button
                            className="btn btn-link text-decoration-none p-0"
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: product.name,
                                        text: "Check out this product on Shopizen!",
                                        url: window.location.href
                                    });
                                } else {
                                    alert("Sharing not supported in this browser.");
                                }
                            }}
                        >
                            Share
                        </button>
                    </div>
                </div>
            </div>

            <div className="price text-end mt-3 ms-4 col-2 d-flex flex-column">
                <span>
                    <strong className="h5">
                        ₹{product.price * product.quantity}
                    </strong>
                </span>
                <div className="">{product.discount}% OFF</div>

                <div className="mt-auto mb-3">
                    <button
                        className="btn btn-outline-danger border"
                        onClick={() => removeFromCart(product.id)}
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>

    );
};

export default CartItem;

import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { WishlistContext } from "../context/WishlistContext.jsx";
import defaultImage from "../../assets/product-default-image.png";

const CartItem = ({ product }) => {
    const { removeFromCart, increaseQuantity, decreaseQuantity, updateProductSize } = useContext(CartContext);
    const { addToWishlist } = useContext(WishlistContext);
    const navigate = useNavigate();

    // Size state
    const [selectedSize, setSelectedSize] = useState(product.selectedSize || (product.sizes?.[0] || "Free Size"));

    // Move to Wishlist
    const moveToWishlist = () => {
        addToWishlist({ ...product, selectedSize });
        removeFromCart(product.id, selectedSize);
    };

    // Move to Checkout
    const moveToCheckout = () => {
        navigate("/checkout", { state: { itemsToCheckout: [{ ...product, selectedSize }] } });
        removeFromCart(product.id, selectedSize);
    };

    // Handle size change
    const handleSizeChange = (size) => {
        setSelectedSize(size);
        updateProductSize(product.id, product.selectedSize, size); // oldSize -> newSize
    };

    return (
        <div className="cart-item border d-flex col">
            {/* Product Image */}
            <div className="product-image p-3 col-3" style={{ objectFit: "contain" }}>
                <img
                    src={product.images?.[0] || defaultImage}
                    className="w-100 h-100"
                    alt={product.name}
                    style={{ cursor: "pointer", objectFit: "contain" }}
                    onError={(e) => (e.target.src = defaultImage)}
                />
            </div>

            {/* Product Details */}
            <div className="product-details col-6 p-3">
                <h5 className="product-name">{product.description}</h5>
                <span className="product-price h5"><strong>₹{product.price}</strong></span>
                {product.oldPrice && (
                    <span className="text-decoration-line-through text-muted ms-1">₹{product.oldPrice}</span>
                )}
                <br />

                {/* Size Selector */}
                {product.sizes?.length > 0 ? (
                    <div className="dropdown my-2">
                        <span>Size: </span>
                        <button
                            className="btn btn-outline-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {selectedSize}
                        </button>
                        <ul className="dropdown-menu">
                            {product.sizes.map((size) => (
                                <li key={size}>
                                    <button
                                        className={`dropdown-item ${selectedSize === size ? "active" : ""}`}
                                        onClick={() => handleSizeChange(size)}
                                    >
                                        {size}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="my-2">
                        <span className="badge bg-secondary">Free Size</span>
                    </div>
                )}

                {/* Quantity Controls */}
                <div className="quantity d-flex align-items-center my-2">
                    <span>Quantity: </span>
                    <button className="btn btn-outline-secondary mx-2" onClick={() => decreaseQuantity(product.id, selectedSize)}>-</button>
                    <span>{product.quantity}</span>
                    <button className="btn btn-outline-secondary mx-2" onClick={() => increaseQuantity(product.id, selectedSize)}>+</button>
                </div>

                {/* Links */}
                <div className="d-flex justify-content-start m-0">
                    <div className="link-page d-flex p-3 justify-content-between gap-3">
                        <Link to={`/products/category/${product.category}`} className="text-decoration-none">
                            Similar Products
                        </Link>

                        <button className="btn btn-link text-decoration-none p-0" onClick={moveToWishlist}>
                            Move to Wishlist
                        </button>

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

            {/* Price & Remove */}
            <div className="price text-end mt-3 ms-4 col-2 d-flex flex-column">
                <span>
                    <strong className="h5">
                        ₹{product.price * product.quantity}
                    </strong>
                </span>
                {product.discount && <div>{product.discount}% OFF</div>}

                <div className="mt-auto mb-3">
                    <button
                        className="btn btn-outline-danger border"
                        onClick={() => removeFromCart(product.id, selectedSize)}
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;

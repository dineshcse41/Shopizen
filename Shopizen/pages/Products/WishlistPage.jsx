import React, { useContext } from "react";
import { WishlistContext } from "../../src/components/context/WishlistContext";
import Navbar from "../../src/components/Navbar/Navbar";
import { Link } from "react-router-dom";
import { CartContext } from "../../src/components/context/CartContext";
import defaultImage from "../../src/assets/product-default-image.png";

const WishlistPage = () => {
     const { addToCart } = useContext(CartContext);
    const { wishlist, removeFromWishlist } = useContext(WishlistContext);

    return (
      <>
      <Navbar/>
            <div className="mt-4 ms-4">
                <h3>My Wishlist</h3>
                {wishlist.length === 0 ? (
                    <p>No items in wishlist.</p>
                ) : (
                    <div className="row">
                        {wishlist.map((product) => (
                            <div className="col-md-3" key={product.id}>
                              <div className="card h-100">
                                    {/* Discount */}
                                    <div className="discount-badge">{product.discount}% OFF</div>

                                    {/* Product Image (clickable) */}
                                    <Link to={`/product/${product.id}`}>
                                        <img
                                            src={product.image}
                                            className="card-img-top"
                                            alt={product.name}
                                            style={{ cursor: "pointer" }}
                                            onError={(e) => {
                                                e.target.src = defaultImage;
                                            }}
                                        />
                                    </Link>

                                    <div className="card-body border">
                                        <span className="brand text-end d-block">{product.brand}</span>
                                        <h5 className="card-title">{product.name}</h5>

                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="price fw-bold">₹{product.price}.00</span>
                                            <span className="text-decoration-line-through text-muted ms-1">
                                                ₹{product.oldPrice}.00
                                            </span>
                                            <div className="rating-badge ms-5">
                                                {product.rating}
                                                <i className="bi bi-star-fill"></i>
                                            </div>
                                        </div>

                                        <div className="button d-flex justify-content-between">
                                            <button
                                                className="btn btn-outline-primary text-wrap w-50 add-cart"
                                                onClick={() => addToCart(product)}
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                className="btn btn-outline-danger  ms-2  w-50 remove"
                                                onClick={() => removeFromWishlist(product.id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                              </div>
                            </div>
                        ))}
                    </div>

                    

                        
                )}
            </div>
      </>
    );
};

export default WishlistPage;

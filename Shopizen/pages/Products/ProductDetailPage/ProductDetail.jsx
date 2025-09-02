import React, { useState, useContext } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import "./ProductDetail.css";

import { CartContext } from "../../../src/components/context/CartContext";
import { WishlistContext } from "../../../src/components/context/WishlistContext";
import { AuthContext } from "../../../src/components/context/AuthContext";

import defaultImage from "../../../src/assets/product-default-image.png";

const ProductDetail = ({ products }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useContext(AuthContext); // ✅ get logged-in user
    const { addToCart } = useContext(CartContext);
    const { wishlist, toggleWishlist } = useContext(WishlistContext);
    const [quantity, setQuantity] = useState(1);


    const product = products.find((p) => p.id === parseInt(id));
    if (!product) return <h2 className="text-center mt-5">Product not found</h2>;

    const [mainImage, setMainImage] = useState(
        product.images ? product.images[0] : product.image
    );

    const [helpfulVotes, setHelpfulVotes] = useState({});

    const handleVote = (reviewId, type) => {
        setHelpfulVotes((prev) => ({
            ...prev,
            [reviewId]: type,
        }));
    };

    // ✅ Require login helper — we also pass the user's intent + product so Login can resume the action
    const requireLogin = (intent) => {
        if (!user) {
            navigate("/login-email", {
                state: { from: location.pathname, intent, product }, // 
            });
            return false;
        }
        else if (!user){
            navigate("/login-mobile", {
                state: { from: location.pathname, intent, product }, // 
            });
            return false;
        }
        else {
            return true;
        }
    };

    // ✅ Add to Cart with login check
    const handleAddToCart = () => {
        if (!requireLogin("addToCart")) return;
        addToCart(product);
    };

    // ✅ Buy Now with login check
    /*   navigate("/checkout", { state: { product } }); */
    const handleBuyNow = () => {
        if (!requireLogin("buyNow")) return;
        // ✅ Send explicit buyNowProduct with all required fields
        navigate("/checkout", {
            state: {
                buyNowProduct: {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    summary: product.description, // or summary if you have it
                    quantity: quantity,
                    image: product.image || defaultImage,
                },
            },
        });
    };

    return (
        <>
            <div className="section1 bg-primary justify-content-between d-flex ">
                <h5 className="mx-2 mt-1">Shopizen</h5>
                <div>
                    <Link to="/wishlist">
                        <button className="btn btn-outline-dark mx-2 mt-1">Wishlist</button>
                    </Link>
                </div>
            </div>

            <div className="mx-5 py-4">
                <div className="row">
                    {/* Left Side - Images */}
                    <div className="col-md-5 position-relative">
                        <div className="d-flex">
                            {/* 3 Vertical Thumbnails */}
                            <div className="d-flex flex-column me-3">
                                {product.images?.slice(0, 3).map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Thumb${idx}`}
                                        className="img-thumbnail mb-2"
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            objectFit: "cover",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => setMainImage(img)}
                                    />
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="position-relative flex-grow-1">
                                {product.discount && (
                                    <div className="discount-badge position-absolute top-0 start-0 bg-danger text-white px-2 py-1 fw-bold">
                                        {product.discount}% OFF
                                    </div>
                                )}
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="img-fluid border "
                                    style={{
                                        width: "300px",
                                        maxHeight: "100%",
                                        objectFit: "contain",
                                    }}
                                    onError={(e) => {
                                        e.target.src = defaultImage;
                                    }}
                                />
                            </div>
                        </div>

                        {/* Bottom Row - Similar Product Images */}
                        <div className="d-flex gap-2 flex-wrap mt-3 justify-content-center">
                            {product.images?.slice(3, 5).map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Similar${idx}`}
                                    className="img-thumbnail"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        objectFit: "cover",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setMainImage(img)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Product Info */}
                    <div className="col-md-7">
                        <div className="d-flex align-items-center">
                            <span className="text-muted">
                                Brand: <strong>{product.brand}</strong>
                            </span>
                            <Link to="/cart" className="fs-4 ms-auto">
                                <i className="bi bi-cart4 "></i>
                            </Link>
                        </div>

                        <h2 className="mt-2">{product.name}</h2>
                        <div className="d-flex align-items-center mb-2">
                            <div className="rating-badge me-2">
                                {product.rating} <i className="bi bi-star-fill"></i>
                            </div>
                            <small className="text-muted">
                                ({product.reviews ? product.reviews.length : 0} ratings)
                            </small>
                        </div>

                        <div className="d-flex align-items-center mb-3">
                            <h4 className="fw-bold text-success me-3">₹{product.price}</h4>
                            {product.oldPrice && (
                                <span className="text-decoration-line-through text-muted">
                                    ₹{product.oldPrice}
                                </span>
                            )}
                        </div>
                        <div className="d-flex align-items-center mb-3">
                            <label className="me-2">Quantity:</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                className="form-control"
                                style={{width: "50px"}}
                            />
                        </div>


                        <p>
                            <strong>Description:</strong> {product.description}
                        </p>

                        <div className="mb-3 d-flex">
                            <button className="btn btn-primary w-50 me-2" onClick={handleAddToCart}>
                                Add to Cart
                            </button>
                            <button className="btn btn-dark w-50" onClick={handleBuyNow}>
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <hr className="my-4" />
                <h4>Customer Reviews</h4>
                {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, idx) => (
                        <div key={idx} className="review">
                            <div className="d-flex justify-content-between">
                                <strong>{review.name}</strong>
                                <span className="date">{review.date}</span>
                            </div>
                            <div className="stars">{review.stars} ★</div>
                            <p>{review.text}</p>

                            {/* Media */}
                            <div className="review-media d-flex gap-2 flex-wrap">
                                {review.media?.map((m, i) =>
                                    m.endsWith(".mp4") ? (
                                        <video key={i} width="150" controls>
                                            <source src={m} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <img key={i} src={m} alt={`media${i}`} width="150" />
                                    )
                                )}
                            </div>

                            <div className="helpful-btns">
                                <span>Was this review helpful?</span>
                                <button
                                    className={helpfulVotes[idx] === "yes" ? "active" : ""}
                                    onClick={() => handleVote(idx, "yes")}
                                >
                                    <i
                                        className={
                                            helpfulVotes[idx] === "yes"
                                                ? "bi bi-hand-thumbs-up-fill text-primary"
                                                : "bi bi-hand-thumbs-up"
                                        }
                                    ></i>
                                </button>
                                <button
                                    className={helpfulVotes[idx] === "no" ? "active" : ""}
                                    onClick={() => handleVote(idx, "no")}
                                >
                                    <i
                                        className={
                                            helpfulVotes[idx] === "no"
                                                ? "bi bi-hand-thumbs-down-fill text-primary"
                                                : "bi bi-hand-thumbs-down"
                                        }
                                    ></i>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )}

                {/* Similar Products */}
                <hr className="my-4" />
                <h4>You Might Also Like</h4>
                <div className="similar-products d-flex gap-3 flex-wrap">
                    {products
                        .filter((p) => {
                            if (p.id === product.id) return false;
                            const sameCategory = p.category === product.category;
                            const sameBrand = p.brand === product.brand;
                            const priceDiff = Math.abs(p.price - product.price);
                            const similarPrice = priceDiff <= product.price * 0.2;
                            return [sameCategory, sameBrand, similarPrice].filter(Boolean).length >= 2;
                        })
                        .slice(0, 4)
                        .map((item, idx) => {
                            const isItemInWishlist = wishlist.some((w) => w.id === item.id);
                            return (
                                <div key={idx} className="col-md-3" style={{ width: "300px" }}>
                                    <div className="card h-100 w-100">
                                        <button
                                            className="btn position-absolute top-0 end-0 m-2 p-2"
                                            onClick={() => toggleWishlist(item)}
                                        >
                                            <i
                                                className={isItemInWishlist ? "bi bi-heart-fill" : "bi bi-heart"}
                                                style={{ color: isItemInWishlist ? "red" : "" }}
                                            ></i>
                                        </button>

                                        <a href={`/product/${item.id}`} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={Array.isArray(item.image) ? item.image[0] : item.image}
                                                alt={item.name}
                                                className="card-img-top"
                                                style={{ width: "100%", height: "250px", objectFit: "contain", cursor: "pointer" }}
                                                onError={(e) => {
                                                    e.target.src = defaultImage;
                                                }}
                                            />
                                        </a>

                                        <div className="card-body border">
                                            <span className="brand text-end d-block">{item.brand}</span>
                                            <h5 className="card-title">{item.name}</h5>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="price fw-bold">₹{item.price}.00</span>
                                                <span className="text-decoration-line-through text-muted ms-1">₹{item.oldPrice}.00</span>
                                                <div className="rating-badge ms-5">
                                                    {item.rating}
                                                    <i className="bi bi-star-fill"></i>
                                                </div>
                                            </div>
                                            <div className="button d-flex justify-content-between">
                                                <button className="btn btn-outline-primary text-wrap w-50 add-cart" onClick={() => addToCart(item)}>
                                                    Add to Cart
                                                </button>
                                                <button className="btn btn-outline-dark w-50 ms-2 buy-now">Buy Now</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
};

export default ProductDetail;
import React, { useState, useContext, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../../../components/context/CartContext";
import { WishlistContext } from "../../../components/context/WishlistContext";
import { AuthContext } from "../../../components/context/AuthContext";
import { useComparison } from "../../../components/context/ComparisonContext";
import { useToast } from "../../../components/context/ToastContext.jsx";
import defaultImage from "../../../assets/product-default-image.png";
import "./ProductDetail.css";
import ProductCard from "../../../components/ProductCard/ProductCard.jsx";
import reviewsData from "../../../data/products/reviews.json"; // <- your JSON file path

const ProductDetail = ({ products = [], setProducts }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { comparisonList, toggleCompare } = useComparison();
    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const { wishlist, toggleWishlist } = useContext(WishlistContext);
    const { showToast } = useToast();
    const [quantity, setQuantity] = useState(1);
    const [showReviews, setShowReviews] = useState(true);
    const [visibleReviews, setVisibleReviews] = useState(3);
    const [helpfulVotes, setHelpfulVotes] = useState({});
    const [newReview, setNewReview] = useState({ stars: 0, text: "", media: [] });
    const [reviews, setReviews] = useState([]);
    const toggleReviewSection = () => setShowReviews((prev) => !prev);
    const handleShowMore = () => setVisibleReviews((prev) => prev + 3);
    const product = products.find((p) => p.id.toString() === id);
    const isInWishlist = wishlist.some((item) => item.id === product.id);
    const [mainImage, setMainImage] = useState(
        product?.images ? product.images[0] : product?.image || defaultImage
    );


    // If sizes are available, user must select; otherwise, default to "Free Size"
    const [selectedSize, setSelectedSize] = useState("");

    useEffect(() => {
        if (!product.sizes || product.sizes.length === 0) {
            setSelectedSize("Free Size");
        }
    }, [product.sizes]);

    useEffect(() => {
        if (product) setMainImage(product.images?.[0] || product.image || defaultImage);

        // --- Load Reviews from JSON (currently) ---
        const filteredReviews = reviewsData.filter((r) => r.productId === product?.id);
        setReviews(filteredReviews);

        /* --- Future API Fetch (Django backend) ---
        fetch(`http://localhost:8000/api/reviews/${product.id}/`) // replace with your Django API
          .then(res => res.json())
          .then(data => setReviews(data))
          .catch(err => console.error(err));
        */
    }, [product]);

    if (!product) {
        return <h2 className="text-center mt-5">Product not found</h2>;
    }

    const isAdded = comparisonList.some((p) => p.id === product.id);

    const handleVote = (reviewId, type) => {
        setHelpfulVotes((prev) => ({
            ...prev,
            [reviewId]: type,
        }));
    };

    const requireLogin = (intent) => {
        if (!user) {
            navigate("/login-email", { state: { from: location.pathname, intent, product } });
            return false;
        }
        return true;
    };

    const handleAddToCart = () => {
        if (!requireLogin("addToCart")) return;
        addToCart({ ...product, size: selectedSize || "Default", quantity });

        if (!selectedSize) {
            showToast("Please select a size before adding to cart.", "error");
            return;
        }
        showToast(`${product.name} (${selectedSize}) added to cart!`, "success");
    };

    const handleBuyNow = () => {
        if (!requireLogin("buyNow")) return;

        if (!selectedSize) {
            showToast("Please select a size before buying.", "error");
            return;
        }

        navigate("/checkout", {
            state: { buyNowProduct: { ...product, quantity: 1, selectedSize } },
        });
    };

    const handleWishlist = () => {
        if (!user) {
            showToast("Please log in to manage wishlist.", "error");
            navigate("/login-email");
            return;
        }
        toggleWishlist(product);
        showToast(
            isInWishlist
                ? `${product.name} removed from wishlist.`
                : `${product.name} added to wishlist!`,
            "success"
        );
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!requireLogin("addReview")) return;

        const review = { name: user?.name || "Anonymous", date: new Date().toLocaleDateString(), ...newReview, reviewId: Date.now() };
        setReviews((prev) => [...prev, review]);

        const updatedProducts = products.map((p) =>
            p.id === product.id ? { ...p, reviews: [...(p.reviews || []), review] } : p
        );
        setProducts(updatedProducts);
        setNewReview({ stars: 0, text: "", media: [] });
    };

    const handleMediaUpload = (e) => {
        const files = Array.from(e.target.files);
        const urls = files.map((file) => URL.createObjectURL(file));
        setNewReview((prev) => ({ ...prev, media: [...prev.media, ...urls] }));
    };



    const totalReviews = reviews.length;
    const avgRating =
        totalReviews > 0
            ? (reviews.reduce((acc, r) => acc + r.stars, 0) / totalReviews).toFixed(1)
            : product.rating || 0;

    const ratingCount = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.stars === star).length,
    }));

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
                                        src={img || defaultImage}      // fallback here too
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
                                    src={mainImage || defaultImage}   // use defaultImage if mainImage is empty
                                    alt={product.name}
                                    className="img-fluid border"
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
                            {product.images?.slice(0, 3).map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img || defaultImage}      // fallback here too
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
                    </div>

                    {/* Right Side - Product Info */}
                    <div className="col-md-7">
                        <div className="d-flex align-items-center">
                            <span className="text-muted">
                                Brand: <strong>{product.brand}</strong>
                            </span>

                            <button
                                className="btn  fs-4 ms-auto"
                                onClick={handleWishlist}
                            >
                                <i
                                    className={isInWishlist ? "bi bi-heart-fill" : "bi bi-heart"}
                                    style={{ color: isInWishlist ? "red" : "" }}
                                ></i>
                            </button>


                        </div>

                        <h2 className="mt-2">{product.name}</h2>

                        <p>
                            <strong>Description:</strong> {product.description}
                        </p>

                        <div className="d-flex align-items-center">

                            {product.rating} <i className="bi bi-star-fill" style={{ color: "gold" }}></i>

                            <small className="text-muted p-2">
                                ({product.reviews ? product.reviews.length : 0} ratings)
                            </small>
                        </div>

                        <div className="d-flex align-items-center">
                            <h4 className="fw-bold text-success me-3">₹{product.price}</h4>
                            {product.oldPrice && (
                                <span className="text-decoration-line-through text-muted">
                                    ₹{product.oldPrice}
                                </span>
                            )}
                        </div>

                        <div className="d-flex mt-0">
                            {/* SIZE SELECTION */}
                            {product.sizes && product.sizes.length > 0 ? (
                                <div className="mb-3">
                                    <label className="form-label">Select Size:</label>
                                    <div className="d-flex flex-wrap">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                className={`btn btn-sm me-2 mb-2 ${selectedSize === size ? "btn-primary" : "btn-outline-secondary"
                                                    }`}
                                                onClick={() => setSelectedSize(size)}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-3">
                                    <span className="badge bg-secondary">Free Size</span>
                                </div>
                            )}
                            {/* Quantity */}
                            <div className="d-flex align-items-center mb-3 ms-4">
                                <label className="me-2">Quantity:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    className="form-control"
                                    style={{ width: "50px" }}
                                />
                            </div>

                        </div>

                        {/* Compare Checkbox below rating */}
                        <div className="form-check mt-2 mb-2">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`compare-${product.id}`}
                                checked={isAdded}
                                onChange={() => toggleCompare(product)}

                            />
                            < label className="form-check-label mt-0" htmlFor={`compare-${product.id}`}>
                                Compare
                            </label>
                        </div>

                        <div className="mb-3 d-flex">
                            <button className="btn btn-primary w-50" onClick={handleAddToCart}>
                                Add to Cart
                            </button>


                            <button className="btn btn-dark w-50 ms-2" onClick={handleBuyNow}>
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side - Reviews */}
                <hr className="my-4" />
                <div className="row">
                    {/* Left Side - Rating Summary */}
                    <div className="col-md-4">
                        <h4 className="d-flex justify-content-between align-items-center">
                            Ratings & Reviews
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={toggleReviewSection}
                            >
                                {showReviews ? "Hide" : "Show"}
                            </button>
                        </h4>
                        <h2 className="fw-bold">{avgRating} ★</h2>
                        <p className="text-muted">{totalReviews} Ratings & Reviews</p>

                        {/* Rating Distribution */}
                        {ratingCount.map((r) => {
                            const percent = totalReviews ? (r.count / totalReviews) * 100 : 0;
                            return (
                                <div key={r.star} className="d-flex align-items-center mb-1">
                                    <span className="me-2">{r.star} ★</span>
                                    <div className="progress flex-grow-1" style={{ height: "8px" }}>
                                        <div
                                            className="progress-bar bg-success"
                                            role="progressbar"
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                    <span className="ms-2">{r.count}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="col-md-8">
                        {showReviews && (
                            <>
                                {reviews.length > 0 ? (
                                    <>
                                        {reviews.slice(0, visibleReviews).map((review, idx) => (
                                            <div key={idx} className="review mb-3 border-bottom pb-2">
                                                <div className="d-flex justify-content-between">
                                                    <strong>{review.name}</strong>
                                                    <span className="date">{review.date}</span>
                                                </div>
                                                <div className="stars text-warning fw-bold">
                                                    {"★".repeat(review.stars)}{" "}
                                                    <span className="text-muted">
                                                        {"★".repeat(5 - review.stars)}
                                                    </span>
                                                </div>
                                                <p>{review.text}</p>

                                                {/* If review has images/videos */}
                                                {review.media?.length > 0 && (
                                                    <div className="d-flex gap-2 flex-wrap mt-2">
                                                        {review.media.map((m, i) => (
                                                            <img
                                                                key={i}
                                                                src={m}
                                                                alt="review media"
                                                                style={{
                                                                    width: "80px",
                                                                    height: "80px",
                                                                    objectFit: "cover",
                                                                    borderRadius: "4px",
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}

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
                                        ))}

                                        {/* Show More / Show Less Buttons */}
                                        <div className="text-center mb-3">
                                            {visibleReviews < reviews.length ? (
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={handleShowMore}
                                                >
                                                    Show More Reviews
                                                </button>
                                            ) : (
                                                reviews.length > 3 && (
                                                    <button
                                                        className="btn btn-outline-secondary btn-sm"
                                                        onClick={() => setVisibleReviews(3)}
                                                    >
                                                        Show Less
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <p>No reviews yet.</p>
                                )}

                                {/* Review Form */}
                                <div className="mt-4 border p-3 rounded">
                                    <h5>Write a Review</h5>
                                    <form onSubmit={handleReviewSubmit}>
                                        {/* Star Rating */}
                                        <div className="mb-2">
                                            <label>Your Rating:</label>
                                            <div>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <i
                                                        key={star}
                                                        className={`bi bi-star-fill fs-4 me-1 ${newReview.stars >= star
                                                            ? "text-warning"
                                                            : "text-muted"
                                                            }`}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() =>
                                                            setNewReview((prev) => ({
                                                                ...prev,
                                                                stars: star,
                                                            }))
                                                        }
                                                    ></i>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Text Review */}
                                        <div className="mb-2">
                                            <label>Review:</label>
                                            <textarea
                                                className="form-control"
                                                value={newReview.text}
                                                onChange={(e) =>
                                                    setNewReview((prev) => ({
                                                        ...prev,
                                                        text: e.target.value,
                                                    }))
                                                }
                                                required
                                            />
                                        </div>

                                        {/* Media Upload */}
                                        <div className="mb-2">
                                            <label>Upload Images/Videos:</label>
                                            <input type="file" multiple onChange={handleMediaUpload} />
                                        </div>

                                        <button type="submit" className="btn btn-success mt-2">
                                            Submit Review
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Similar Products */}
                <hr className="my-4" />
                <h4>You Might Also Like</h4>
                <div className="row g-3 px-2">
                    {products.filter((p) => {
                        if (p.id === product.id) return false;
                        const sameCategory = p.category === product.category;
                        const sameBrand = p.brand === product.brand;
                        const priceDiff = Math.abs(p.price - product.price);
                        const similarPrice = priceDiff <= product.price * 0.2;
                        return [sameCategory, sameBrand, similarPrice].filter(Boolean).length >= 2;
                    }).slice(0, 4).length > 0 ? (
                        products
                            .filter((p) => {
                                if (p.id === product.id) return false;
                                const sameCategory = p.category === product.category;
                                const sameBrand = p.brand === product.brand;
                                const priceDiff = Math.abs(p.price - product.price);
                                const similarPrice = priceDiff <= product.price * 0.2;
                                return [sameCategory, sameBrand, similarPrice].filter(Boolean).length >= 2;
                            })
                            .slice(0, 4)
                            .map((item, idx) => (
                                <div className="col-lg-3 col-md-4 col-6" key={idx}>
                                    <ProductCard product={item} />
                                </div>
                            ))
                    ) : (
                        <p className="text-muted ms-2">No similar products available.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductDetail;

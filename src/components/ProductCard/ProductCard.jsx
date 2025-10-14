import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../components/context/CartContext.jsx";
import { WishlistContext } from "../../components/context/WishlistContext.jsx";
import { AuthContext } from "../../components/context/AuthContext.jsx";
import { useComparison } from "../../components/context/ComparisonContext.jsx";
import { useToast } from "../../components/context/ToastContext.jsx";
import defaultImage from "../../assets/product-default-image.png";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const { wishlist, toggleWishlist } = useContext(WishlistContext);
    const { user } = useContext(AuthContext);
    const { comparisonList, toggleCompare } = useComparison();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const isInWishlist = wishlist.some((item) => item.id === product.id);
    const isAdded = comparisonList.some((p) => p.id === product.id);

    const handleAddToCart = () => {
        if (!user) {
            showToast("Please log in to add items to cart.", "error");
            navigate("/login-email");
            return;
        }
        addToCart(product);
        showToast(`${product.name} added to cart!`, "success");
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

    const handleCompare = () => {
        if (!user) {
            showToast("Please log in to compare products.", "error");
            navigate("/login-email");
            return;
        }

        if (!isAdded && comparisonList.length >= 3) {
            showToast("You can compare up to 3 products only!", "error");
            return;
        }

        toggleCompare(product);

        showToast(
            isAdded
                ? `${product.name} removed from comparison.`
                : `${product.name} added for comparison!`,
            "success"
        );
    };

    const handleBuyNow = () => {
        if (!user) {
            showToast("Please log in to proceed with purchase.", "error");
            navigate("/login-email");
            return;
        }
        navigate("/checkout", {
            state: { buyNowProduct: { ...product, quantity: 1 } },
        });
    };

    return (
        <div className="col-lg-4 col-md-6 col-6 mb-4">
            <div className="card h-100 shadow-sm border-0 d-flex flex-column position-relative">
                {/* Wishlist Button */}
                <button
                    className="btn position-absolute top-0 end-0 m-2 p-2"
                    onClick={handleWishlist}
                >
                    <i
                        className={isInWishlist ? "bi bi-heart-fill" : "bi bi-heart"}
                        style={{ color: isInWishlist ? "red" : "" }}
                    ></i>
                </button>

                {/* Discount Badge */}
              
                {product.discount && (
                    <div
                        className={`discount-badge ${product.discount > 25
                                ? "discount-high"
                                : product.discount > 10
                                ? "discount-medium"
                                : "discount-low"
                            }`}
                    >
                        {product.discount}% OFF
                    </div>
                )}

                {/* Product Image */}
                <a href={`/product/${product.id}`} target="_blank" rel="noopener noreferrer">
                    <img
                        src={
                            product.images && product.images.length > 0
                                ? product.images[0]
                                : defaultImage
                        }
                        className="card-img-top"
                        alt={product.name}
                        style={{ cursor: "pointer", objectFit: "contain"}}
                        onError={(e) => (e.target.src = defaultImage)}
                    />
                </a>

                <div className="card-body border d-flex flex-column">
                    {/* Compare Checkbox */}
                    <div className="form-check d-flex justify-content-between mt-auto mt-2">
                        <div>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`compare-${product.id}`}
                                checked={isAdded}
                                onChange={handleCompare}
                            />
                            <label
                                className="form-check-label mt-0"
                                htmlFor={`compare-${product.id}`}
                            >
                                Compare
                            </label>
                        </div>
                        <span className="brand text-end ">{product.brand}</span>
                    </div>
                    
                    <h5 className="card-title">{product.name}</h5>

                    <div className="d-flex align-items-center mb-2 flex-wrap">
                        <span className="price fw-bold">₹{product.price}.00</span>
                        {product.oldPrice && (
                            <span className="text-decoration-line-through text-muted ms-2">
                                ₹{product.oldPrice}.00
                            </span>
                        )}
                        <div
                            className={`rating-badge ms-auto ${product.rating >= 4
                                    ? "rating-high"
                                    : product.rating >= 3
                                    ? "rating-medium"
                                    : "rating-low"
                                }`}
                        >
                            {product.rating} <i className="bi bi-star-fill"></i>
                        </div>

                    </div>

                   

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-between mt-auto">
                        <button
                            className="btn btn-outline-primary w-50 me-2"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                        <button
                            className="btn btn-outline-dark w-50"
                            onClick={handleBuyNow}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

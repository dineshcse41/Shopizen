// src/components/ProductCard/ProductCard.jsx
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../components/context/CartContext.jsx";
import { WishlistContext } from "../../components/context/WishlistContext.jsx";
import { AuthContext } from "../../components/context/AuthContext.jsx";
import { useComparison } from "../../components/context/ComparisonContext.jsx";
import { useToast } from "../../components/context/ToastContext.jsx";
import defaultImage from "../../assets/product-default-image.png";
import API from "../../api/api";
import "./ProductCard.css";

const ProductCard = ({ product, selectedSize, onSizeSelect }) => {
  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const { comparisonList, toggleCompare } = useComparison();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const discount = product.discount || 0;
  const [internalSize, setInternalSize] = useState(
    selectedSize || product.sizes?.[0] || "Free Size"
  );
  const [reviews, setReviews] = useState([]);
  const sizeToUse = selectedSize || internalSize;

  const sizePrice = product.priceBySize?.[sizeToUse] || product.price;
  const discountedPrice = sizePrice - (sizePrice * discount) / 100;

  const displayPrice = new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: product.currency || "USD",
  }).format(discountedPrice);

  const displayOldPrice = new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: product.currency || "USD",
  }).format(sizePrice);

  // Fetch product reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await API.get(`products/${product.id}/reviews/`);
        setReviews(response.data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchReviews();
  }, [product.id]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const finalRating = Number(averageRating.toFixed(1));

  const handleSizeClick = (size) => {
    if (onSizeSelect) onSizeSelect(size);
    else setInternalSize(size);
  };

  useEffect(() => {
    if (!product.sizes || product.sizes.length === 0) setInternalSize("Free Size");
  }, [product.sizes]);

  const isInWishlist = wishlist.some((item) => item.id === product.id);
  const isAdded = comparisonList.some((p) => p.id === product.id);

  // Add to Cart
  const handleAddToCart = async () => {
    if (!user) {
      showToast("Please log in to add items to cart.", "error");
      navigate("/login-email");
      return;
    }

    try {
      const response = await API.post("cart/add/", {
        product_id: product.id,
        selected_size: sizeToUse,
        quantity: 1,
      });
      addToCart(response.data); // Update context
      showToast(`${product.name} (${sizeToUse}) added to cart!`, "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to add to cart.", "error");
    }
  };

  // Buy Now
  const handleBuyNow = async () => {
    if (!user) {
      showToast("Please log in to proceed with purchase.", "error");
      navigate("/login-email");
      return;
    }

    try {
      const response = await API.post("api/orders/create/", {
        products: [
          {
            product_id: product.id,
            quantity: 1,
            selected_size: sizeToUse,
          },
        ],
      });
      navigate("/checkout", { state: { order: response.data } });
    } catch (error) {
      console.error(error);
      showToast("Failed to create order.", "error");
    }
  };

  // Wishlist toggle
  const handleWishlist = async () => {
    if (!user) {
      showToast("Please log in to manage wishlist.", "error");
      navigate("/login-email");
      return;
    }

    try {
      await API.post("wishlist/toggle/", { product_id: product.id });
      toggleWishlist(product);
      showToast(
        isInWishlist
          ? `${product.name} removed from wishlist.`
          : `${product.name} added to wishlist!`,
        "success"
      );
    } catch (error) {
      console.error(error);
      showToast("Failed to update wishlist.", "error");
    }
  };

  // Comparison toggle
  const handleCompare = async () => {
    if (!user) {
      showToast("Please log in to compare products.", "error");
      navigate("/login-email");
      return;
    }

    if (!isAdded && comparisonList.length >= 3) {
      showToast("You can compare up to 3 products only!", "error");
      return;
    }

    try {
      await API.post("api/compare/", { product_id: product.id });
      toggleCompare(product);
      showToast(
        isAdded
          ? `${product.name} removed from comparison.`
          : `${product.name} added for comparison!`,
        "success"
      );
    } catch (error) {
      console.error(error);
      showToast("Failed to update comparison.", "error");
    }
  };

  // Discount and rating classes
  const getDiscountClass = () => {
    if (discount > 75) return "discount-green";
    if (discount >= 45) return "discount-gold";
    return "discount-red";
  };

  const getRatingClass = () => {
    if (finalRating > 4) return "rating-green";
    if (finalRating >= 3) return "rating-gold";
    return "rating-red";
  };

  return (
    <div className="card h-100 shadow-sm border-0 d-flex flex-column position-relative">
      <button className="btn position-absolute top-0 end-0 m-2 p-2" onClick={handleWishlist}>
        <i className={isInWishlist ? "bi bi-heart-fill" : "bi bi-heart"} style={{ color: isInWishlist ? "red" : "" }}></i>
      </button>

      {discount > 0 && <div className={`discount-badge ${getDiscountClass()}`}>{discount}% OFF</div>}

      <a href={`/product/${product.id}`} target="_blank" rel="noopener noreferrer">
        <img
          src={product.images?.[0] || defaultImage}
          className="card-img-top"
          alt={product.name}
          style={{ objectFit: "contain", cursor: "pointer" }}
          onError={(e) => (e.target.src = defaultImage)}
        />
      </a>

      <div className="card-body d-flex flex-column">
        <div className="form-check d-flex justify-content-between mt-auto mt-2">
          <div>
            <input
              className="form-check-input"
              type="checkbox"
              id={`compare-${product.id}`}
              checked={isAdded}
              onChange={handleCompare}
            />
            <label className="form-check-label mt-0" htmlFor={`compare-${product.id}`}>
              Compare
            </label>
          </div>
          <span className="brand text-end">{product.brand}</span>
        </div>

        <h5 className="text-start h5 mt-1 card-title">{product.name}</h5>

        <div className="card-price d-flex align-items-center m-0 flex-wrap">
          <span className="price h3 fw-bold">{displayPrice}</span>
          {discount > 0 && <span className="oldprice text-decoration-line-through text-muted mt-4 ms-2">{displayOldPrice}</span>}
          <div className={`rating-badge ms-auto ${getRatingClass()}`}>{finalRating} <i className="bi bi-star-fill"></i></div>
        </div>

        {product.sizes?.length > 0 ? (
          <div className="">
            <label className="form-label">Select Size:</label>
            <div className="d-flex flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`btn btn-sm me-2 mb-2 ${sizeToUse === size ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => handleSizeClick(size)}
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

        <div className="d-flex justify-content-between mt-auto">
          <button className="btn btn-outline-primary w-50 me-2" onClick={handleAddToCart}>Add to Cart</button>
          <button className="btn btn-outline-dark w-50" onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

import { useContext, useState, useEffect } from "react";
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

  const discount = product.discount || 0;
  const [selectedSize, setSelectedSize] = useState("");

  const oldPrice = product.price;
  const discountedPrice = oldPrice - (oldPrice * discount) / 100;

  const displayPrice = new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: product.currency || "USD",
  }).format(discountedPrice);

  const displayOldPrice = new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: product.currency || "USD",
  }).format(product.price);

  useEffect(() => {
    if (!product.sizes || product.sizes.length === 0) {
      setSelectedSize("Free Size");
    }
  }, [product.sizes]);

  const isInWishlist = wishlist.some((item) => item.id === product.id);
  const isAdded = comparisonList.some((p) => p.id === product.id);

  const handleAddToCart = () => {
    if (!user) {
      showToast("Please log in to add items to cart.", "error");
      navigate("/login-email");
      return;
    }
    if (!selectedSize) {
      showToast("Please select a size before adding to cart.", "error");
      return;
    }
    addToCart({ ...product, selectedSize });
    showToast(`${product.name} (${selectedSize}) added to cart!`, "success");
  };

  const handleBuyNow = () => {
    if (!user) {
      showToast("Please log in to proceed with purchase.", "error");
      navigate("/login-email");
      return;
    }
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

  const getDiscountClass = () => {
    if (discount > 75) return "discount-green";
    if (discount >= 45) return "discount-gold";
    return "discount-red";
  };

  const getRatingClass = () => {
    if (product.rating > 4) return "rating-green";
    if (product.rating >= 3) return "rating-gold";
    return "rating-red";
  };

  return (
    <div className="card h-100 shadow-sm border-0 d-flex flex-column position-relative">
      <button
        className="btn position-absolute top-0 end-0 m-2 p-2"
        onClick={handleWishlist}
      >
        <i
          className={isInWishlist ? "bi bi-heart-fill" : "bi bi-heart"}
          style={{ color: isInWishlist ? "red" : "" }}
        ></i>
      </button>

      {discount > 0 && (
        <div className={`discount-badge ${getDiscountClass()}`}>
          {product.discount}% OFF
        </div>
      )}

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
            <label className="form-check-label" htmlFor={`compare-${product.id}`}>
              Compare
            </label>
          </div>
          <span className="brand text-end">{product.brand}</span>
        </div>

        <h5 className="card-title">{product.name}</h5>

        <div className="d-flex align-items-center mb-2 flex-wrap">
          <span className="price fw-bold">{displayPrice}</span>
          {discount > 0 && (
            <span className="text-decoration-line-through text-muted ms-2">
              {displayOldPrice}
            </span>
          )}
          <div className={`rating-badge ms-auto ${getRatingClass()}`}>
            {product.rating} <i className="bi bi-star-fill"></i>
          </div>
        </div>

        {product.sizes?.length > 0 ? (
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

        <div className="d-flex justify-content-between mt-auto">
          <button className="btn btn-outline-primary w-50 me-2" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button className="btn btn-outline-dark w-50" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

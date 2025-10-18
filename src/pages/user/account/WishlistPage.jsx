import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../../components/context/CartContext";
import { WishlistContext } from "../../../components/context/WishlistContext";
import { useComparison } from "../../../components/context/ComparisonContext.jsx";
import { useToast } from "../../../components/context/ToastContext.jsx";
import { useAuth } from "../../../components/context/AuthContext.jsx";
import defaultImage from "../../../assets/product-default-image.png";

const WishlistPage = () => {
  const { addToCart } = useContext(CartContext);
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { comparisonList, toggleCompare } = useComparison();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🧩 Track selected size per product using an object
  const [selectedSizes, setSelectedSizes] = useState({});

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product) => {
    if (!user) {
      showToast("Please log in to add items to cart.", "error");
      navigate("/login-email");
      return;
    }

    const size = selectedSizes[product.id] || "Free Size";
    addToCart({ ...product, selectedSize: size });
    showToast(`${product.name} (${size}) added to cart!`, "success");
  };

  const handleCompare = (product) => {
    if (!user) {
      showToast("Please log in to compare products.", "error");
      navigate("/login-email");
      return;
    }
    if (!comparisonList.find((p) => p.id === product.id) && comparisonList.length >= 3) {
      showToast("You can compare up to 3 products only!", "error");
      return;
    }
    toggleCompare(product);
    showToast(
      comparisonList.find((p) => p.id === product.id)
        ? `${product.name} removed from comparison!`
        : `${product.name} added for comparison!`,
      "success"
    );
  };

  return (
    <div className="mt-4 ms-4">
      <h3>My Wishlist</h3>

      {wishlist.length === 0 ? (
        <div className="text-center mt-5">
          <p>No items in wishlist.</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/products")}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="row me-2">
          {wishlist.map((product) => {
            const isAdded = comparisonList.some((p) => p.id === product.id);
            const selectedSize = selectedSizes[product.id] || "Free Size";

            return (
              <div className="col-lg-3 col-md-4 col-6 mb-4" key={product.id}>
                <div className="card h-100 shadow-sm border-0 d-flex flex-column position-relative">
                  
                  {/* ❤️ Remove from Wishlist */}
                  <button
                    className="btn position-absolute top-0 end-0 m-2 p-2"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <i className="bi bi-heart-fill" style={{ color: "red" }}></i>
                  </button>

                  {/* 🏷️ Discount Badge */}
                  {product.discount && (
                    <div
                      className={`discount-badge ${
                        product.discount > 25
                          ? "discount-high"
                          : product.discount > 10
                          ? "discount-medium"
                          : "discount-low"
                      }`}
                    >
                      {product.discount}% OFF
                    </div>
                  )}

                  {/* 🖼️ Product Image */}
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? product.images[0]
                          : defaultImage
                      }
                      className="card-img-top"
                      alt={product.name}
                      style={{ cursor: "pointer", objectFit: "contain" }}
                      onError={(e) => (e.target.src = defaultImage)}
                    />
                  </Link>

                  <div className="card-body border d-flex flex-column">
                    {/* Compare Checkbox */}
                    <div className="form-check d-flex justify-content-between mt-auto mt-2">
                      <div>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`compare-${product.id}`}
                          checked={isAdded}
                          onChange={() => handleCompare(product)}
                        />
                        <label
                          className="form-check-label mt-0"
                          htmlFor={`compare-${product.id}`}
                        >
                          Compare
                        </label>
                      </div>
                      <span className="brand text-end">{product.brand}</span>
                    </div>

                    <h5 className="card-title">{product.name}</h5>

                    {/* 💰 Price and Rating */}
                    <div className="d-flex align-items-center mb-2 flex-wrap">
                      <span className="price fw-bold">₹{product.price}.00</span>
                      {product.oldPrice && (
                        <span className="text-decoration-line-through text-muted ms-2">
                          ₹{product.oldPrice}.00
                        </span>
                      )}
                      <div
                        className={`rating-badge ms-auto ${
                          product.rating >= 4
                            ? "rating-high"
                            : product.rating >= 3
                            ? "rating-medium"
                            : "rating-low"
                        }`}
                      >
                        {product.rating} <i className="bi bi-star-fill"></i>
                      </div>
                    </div>

                    {/* 👕 Size Selection */}
                    {product.sizes && product.sizes.length > 0 ? (
                      <div className="mb-3">
                        <label className="form-label">Select Size:</label>
                        <div className="d-flex flex-wrap">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              className={`btn btn-sm me-2 mb-2 ${
                                selectedSize === size
                                  ? "btn-primary"
                                  : "btn-outline-secondary"
                              }`}
                              onClick={() =>
                                handleSizeSelect(product.id, size)
                              }
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

                    {/* 🛒 Action Buttons */}
                    <div className="d-flex justify-content-between mt-auto">
                      <button
                        className="btn btn-outline-primary w-50 me-2"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="btn btn-outline-danger w-50"
                        onClick={() => removeFromWishlist(product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;

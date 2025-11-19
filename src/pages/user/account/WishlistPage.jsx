import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../components/context/CartContext";
import { WishlistContext } from "../../../components/context/WishlistContext";
import { useComparison } from "../../../components/context/ComparisonContext.jsx";
import { useToast } from "../../../components/context/ToastContext.jsx";
import { useAuth } from "../../../components/context/AuthContext.jsx";
import ProductCard from "../../../components/ProductCard/ProductCard.jsx"; // Import the reusable ProductCard

const WishlistPage = () => {
  const { wishlist } = useContext(WishlistContext);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Track selected sizes per product
  const [selectedSizes, setSelectedSizes] = useState({});

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  return (
    <div className="wishlist-page mt-4 mb-5 ms-4">
      <h3 className="text-center mb-2">My Wishlist</h3>

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
          {wishlist.map((product) => (
            <div className="col-lg-3 col-md-4 col-12 mb-4" key={product.id}>
              <ProductCard
                product={product}
                selectedSize={selectedSizes[product.id]}
                onSizeSelect={(size) => handleSizeSelect(product.id, size)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;

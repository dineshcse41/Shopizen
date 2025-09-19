import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { WishlistContext } from "../context/WishlistContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import defaultImage from "../../src/assets/product-default-image.png";
import { useComparison } from "../context/ComparisonContext.jsx";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
   const { comparisonList, toggleCompare } = useComparison();
  const navigate = useNavigate();
  const isInWishlist = wishlist.some((item) => item.id === product.id);
  const isAdded = comparisonList.some((p) => p.id === product.id);

  const handleAddToCart = () => {
    if (!user) {
      alert("Please log in to add items to cart.");
      navigate("/login-email");
      return;
    }
    addToCart(product);
  };

  const handleWishlist = () => {
    if (!user) {
      alert("Please log in to manage wishlist.");
      navigate("/login-email");
      return;
    }
    toggleWishlist(product);
  };

  const handleCompare = () => {
    if (!user) {
      alert("Please log in to compare products.");
      navigate("/login-email");
      return;
    }
    toggleCompare(product);
  };

  const handleBuyNow = () => {
    if (!user) {
      alert("Please log in to proceed with purchase.");
      navigate("/login-email");
      return;
    }
    navigate("/checkout", {
      state: { buyNowProduct: { ...product, quantity: 1 } },
    });
  };

  return (
    <div className="col-lg-4 col-md-6 col-6 mb-4">
      <div className="card h-100 shadow-sm border-0 d-flex flex-column">
        {/* Wishlist */}
        <button
          className="btn position-absolute top-0 end-0 m-2 p-2"
          onClick={handleWishlist}
        >
          <i
            className={isInWishlist ? "bi bi-heart-fill" : "bi bi-heart"}
            style={{ color: isInWishlist ? "red" : "" }}
          ></i>
        </button>

        {/* Discount */}
        {product.discount && (
          <div className="discount-badge">{product.discount}% OFF</div>
        )}

        {/* Image */}
        <a href={`/product/${product.id}`} target="_blank" rel="noopener noreferrer">
          <img
            src={product.image}
            className="card-img-top"
            alt={product.name}
            style={{ cursor: "pointer" }}
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
        </a>

        <div className="card-body border">
          <span className="brand text-end d-block">{product.brand}</span>
          <h5 className="card-title">{product.name}</h5>

          <div className="d-flex align-items-center mb-2 flex-wrap">
            <span className="price fw-bold">₹{product.price}.00</span>
            <span className="text-decoration-line-through text-muted ms-2">
              ₹{product.oldPrice}.00
            </span>
            <div className="rating-badge ms-auto">
              {product.rating} <i className="bi bi-star-fill"></i>
            </div>
          </div>

         


          <div className="button d-flex justify-content-between  mt-auto">
            <button
              className="btn btn-outline-primary w-25 ms-2"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button className={`btn ${isAdded ? "btn-secondary w-25 ms-2" : "btn-outline-info w-25 ms-2"}`} onClick={handleCompare}>
              {isAdded ? "Remove Compare" : "Compare"}
            </button>
            <button
              className="btn btn-outline-dark w-25 ms-2"
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

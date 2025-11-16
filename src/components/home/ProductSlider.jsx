import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "react-bootstrap";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import defaultImage from "../../assets/product-default-image.png";
import "./ProductSlider.css";

const ProductSlider = ({
  title,
  products,
  getImage,
  onProductClick,
  viewLink,
}) => {
  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  const scrollAmount = 300;

  // ✅ Update max scroll dynamically
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const updateScroll = () =>
      setMaxScroll(slider.scrollWidth - slider.clientWidth);
    updateScroll();
    window.addEventListener("resize", updateScroll);
    return () => window.removeEventListener("resize", updateScroll);
  }, []);

  // ✅ Auto-scroll
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      const slider = sliderRef.current;
      if (!slider) return;

      if (slider.scrollLeft >= maxScroll - 10) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
        setScrollPosition(0);
      } else {
        slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
        setScrollPosition(slider.scrollLeft + scrollAmount);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, maxScroll]);

  const handleScroll = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const newPos =
      direction === "left"
        ? Math.max(0, slider.scrollLeft - scrollAmount)
        : Math.min(maxScroll, slider.scrollLeft + scrollAmount);

    slider.scrollTo({ left: newPos, behavior: "smooth" });
    setScrollPosition(newPos);
  };

  return (
    <div
      className="product-slider-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with title + buttons */}
      <div className="slider-header d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <h3>{title}</h3>

          <Link
            to={
              viewLink ||
              `/products/category/${title
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "-")}`
            }
            className="view-link ms-3 mt-2 text-primary fw-semibold text-decoration-none"
          >
            View all
          </Link>
        </div>
        <div>
          <button
            className="slider-btn left"
            onClick={() => handleScroll("left")}
            disabled={scrollPosition <= 0}
          >
            <FiChevronLeft />
          </button>
          <button
            className="slider-btn right"
            onClick={() => handleScroll("right")}
            disabled={scrollPosition >= maxScroll - 10}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Scrollable product list */}
      <ul className="product-slide" ref={sliderRef}>
        {products.map((product) => (
          <li
            key={product.id}
            className="product-item"
            onClick={() => onProductClick && onProductClick(product.id)}
          >
            <div className="product-card">
              <div className="product-img-container">
                <a href={`/product/${product.id}`}>
                  <img
                    src={getImage(product) || defaultImage}
                    onError={(e) => (e.target.src = defaultImage)}
                    alt={product.name || "Product Image"}
                    className="product-img"
                  />
                </a>

                {product.discount > 0 && (
                  <Badge bg="danger" className="slider-discount-badge">
                    {product.discount}% OFF
                  </Badge>
                )}
              </div>

              <div className="product-info">
                <p className="product-name">{product.name}</p>
                {product.rating && (
                  <p className="product-rating">
                    ⭐ {product.rating.toFixed(1)}
                  </p>
                )}
                {product.price && (
                  <p className="product-price">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductSlider;

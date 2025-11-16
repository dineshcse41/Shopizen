// src/components/home/Slider.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import offersData from "../../data/common/offers.json";
/* import defaultBanner from "../../assets/default-banner.jpg";  */// 👈 Add one default image
import "./Slider.css";

const Slider = ({ autoTime = 4000, maxVisible = 6 }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // ✅ Filter valid (unexpired) offers and cap to maxVisible
  const currentDate = new Date();
  const activeOffers = offersData.offers
    .filter((offer) => new Date(offer.expiryDate) >= currentDate)
    .slice(0, maxVisible);

  // ✅ Auto slide logic
  useEffect(() => {
    if (isHovered || activeOffers.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activeOffers.length);
    }, autoTime);
    return () => clearInterval(interval);
  }, [isHovered, activeOffers.length, autoTime]);

  // ✅ Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight")
        setActiveIndex((prev) => (prev + 1) % activeOffers.length);
      if (e.key === "ArrowLeft")
        setActiveIndex(
          (prev) => (prev - 1 + activeOffers.length) % activeOffers.length
        );
    },
    [activeOffers.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ✅ Touch swipe support (for mobile)
  let touchStartX = 0;
  let touchEndX = 0;
  const handleTouchStart = (e) => (touchStartX = e.touches[0].clientX);
  const handleTouchMove = (e) => (touchEndX = e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50)
      setActiveIndex((prev) => (prev + 1) % activeOffers.length);
    if (touchEndX - touchStartX > 50)
      setActiveIndex(
        (prev) => (prev - 1 + activeOffers.length) % activeOffers.length
      );
  };

  // ✅ Navigate to offer page
  const handleBannerClick = (offer) =>
    navigate(offer.link || `/offers/${offer.id}`);

  if (!activeOffers.length) return null;

  return (
    <div
      className="slider-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Promotional Offers"
      tabIndex={0}
    >
      {activeOffers.map((offer, index) => (
        <div
          key={offer.id}
          className={`slide ${index === activeIndex ? "active" : ""}`}
          onClick={() => handleBannerClick(offer)}
        >
          <img
            src={offer.bannerImage || defaultBanner}
            alt={offer.title}
            className="slide-img"
            onError={(e) => (e.target.src = defaultBanner)}
          />
         {/*  <div className="slide-overlay">
            <h2>{offer.title}</h2>
            {offer.discount && (
              <span className="discount-tag">{offer.discount}% OFF</span>
            )}
          </div> */}
        </div>
      ))}

      {/* Dots */}
      <div className="dots">
        {activeOffers.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === activeIndex ? "active" : ""}`}
            onClick={() => setActiveIndex(idx)}
          ></span>
        ))}
      </div>

      {/* Arrows */}
      {activeOffers.length > 1 && (
        <>
          <button
            className="arrow left"
            onClick={() =>
              setActiveIndex(
                (prev) => (prev - 1 + activeOffers.length) % activeOffers.length
              )
            }
          >
            ❮
          </button>
          <button
            className="arrow right"
            onClick={() =>
              setActiveIndex((prev) => (prev + 1) % activeOffers.length)
            }
          >
            ❯
          </button>
        </>
      )}
    </div>
  );
};

export default Slider;

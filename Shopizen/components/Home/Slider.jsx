import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import homeData from "../../data/homeData.json";
import "./Slider.css";

const Slider = ({ startId, endId, autoTime = 3000 }) => {
  const navigate = useNavigate();
  const { slider } = homeData;

  // ✅ Filter slides + max 7
  const filteredSlides = slider
    .filter((slide) => slide.id >= startId && slide.id <= endId)
    .slice(0, 7);

  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % filteredSlides.length);
    }, autoTime);
    return () => clearInterval(interval);
  }, [filteredSlides.length, autoTime]);

  // ✅ Handle click on banner
  const handleBannerClick = (url) => {
    if (url.startsWith("http")) {
      window.open(url, "_blank");
    } else {
      navigate(url);
    }
  };

  // ✅ Swipe for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      // swipe left → next
      setActiveIndex((prev) => (prev + 1) % filteredSlides.length);
    }
    if (touchEndX - touchStartX > 50) {
      // swipe right → prev
      setActiveIndex(
        (prev) => (prev - 1 + filteredSlides.length) % filteredSlides.length
      );
    }
  };

  return (
    <div
      className="slider-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {filteredSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === activeIndex ? "active" : ""}`}
          onClick={() => handleBannerClick(slide.link)}
        >
          <img src={slide.image} alt={slide.alt} className="slide-img" />
        </div>
      ))}

      {/* ✅ Dots Navigation */}
      <div className="dots">
        {filteredSlides.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === activeIndex ? "active" : ""}`}
            onClick={() => setActiveIndex(idx)}
          ></span>
        ))}
      </div>

      {/* ✅ Left/Right Arrows */}
      <button
        className="arrow left"
        onClick={() =>
          setActiveIndex(
            (prev) => (prev - 1 + filteredSlides.length) % filteredSlides.length
          )
        }
      >
        ❮
      </button>
      <button
        className="arrow right"
        onClick={() =>
          setActiveIndex((prev) => (prev + 1) % filteredSlides.length)
        }
      >
        ❯
      </button>
    </div>
  );
};

export default Slider;

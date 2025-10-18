import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import offersData from "../../data/common/offers.json";
import "../home/Slider.css";

const Slider = ({ autoTime = 4000, currentDate = new Date() }) => {
    const navigate = useNavigate();

    // Filter only active offers
    const activeOffers = offersData.offers.filter(
        (offer) => new Date(offer.expiryDate) >= currentDate
    );

    const [activeIndex, setActiveIndex] = useState(0);
    const [countdown, setCountdown] = useState("");

    // Auto-slide
    useEffect(() => {
        if (activeOffers.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % activeOffers.length);
        }, autoTime);
        return () => clearInterval(interval);
    }, [activeOffers.length, autoTime]);

    // Countdown timer
    useEffect(() => {
        if (!activeOffers.length) return;
        const timer = setInterval(() => {
            const expiry = new Date(activeOffers[activeIndex].expiryDate).getTime();
            const now = new Date().getTime();
            const distance = expiry - now;
            if (distance <= 0) {
                setCountdown("Expired");
            } else {
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setCountdown(`${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [activeIndex, activeOffers]);

    // Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => (touchStartX = e.targetTouches[0].clientX);
    const handleTouchMove = (e) => (touchEndX = e.targetTouches[0].clientX);
    const handleTouchEnd = () => {
        if (touchStartX - touchEndX > 50) setActiveIndex((prev) => (prev + 1) % activeOffers.length);
        if (touchEndX - touchStartX > 50)
            setActiveIndex((prev) => (prev - 1 + activeOffers.length) % activeOffers.length);
    };

    const handleBannerClick = (offer) => navigate(`/offers/${offer.id}`);

    if (!activeOffers.length) return null;

    return (
        <div
            className="slider-container"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {activeOffers.map((offer, index) => (
                <div
                    key={offer.id}
                    className={`slide ${index === activeIndex ? "active" : ""}`}
                    onClick={() => handleBannerClick(offer)}
                >
                    <img src={offer.bannerImage} alt={offer.title} className="slide-img" />
                    <div className="offer-title">{offer.title}</div>
                    <div className="offer-badge">{offer.discount}% OFF</div>
                    <div className="offer-countdown">{countdown}</div>
                </div>
            ))}

            {/* Dots */}
            <div className="dots">
                {activeOffers.map((_, idx) => (
                    <span key={idx} className={`dot ${idx === activeIndex ? "active" : ""}`} onClick={() => setActiveIndex(idx)}></span>
                ))}
            </div>

            {/* Arrows */}
            {activeOffers.length > 1 && (
                <>
                    <button
                        className="arrow left"
                        onClick={() =>
                            setActiveIndex((prev) => (prev - 1 + activeOffers.length) % activeOffers.length)
                        }
                    >
                        ❮
                    </button>
                    <button
                        className="arrow right"
                        onClick={() => setActiveIndex((prev) => (prev + 1) % activeOffers.length)}
                    >
                        ❯
                    </button>
                </>
            )}
        </div>
    );
};

export default Slider;

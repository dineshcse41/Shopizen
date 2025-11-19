import React, { useEffect, useState } from "react";

const OfferTimer = ({ expiryDate }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            const distance = new Date(expiryDate) - Date.now();
            if (distance <= 0) {
                setTimeLeft("Expired");
                clearInterval(timer);
            } else {
                const hrs = Math.floor((distance / (1000 * 60 * 60)) % 24);
                const mins = Math.floor((distance / (1000 * 60)) % 60);
                const secs = Math.floor((distance / 1000) % 60);
                setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [expiryDate]);

    return <p className="offer-timer">{timeLeft}</p>;
};

export default OfferTimer;

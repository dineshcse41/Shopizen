import React from "react";
import { useParams } from "react-router-dom";

const ShareTrackerPage = () => {
    const { orderId } = useParams();
    const trackLink = `${window.location.origin}/track/${orderId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(trackLink);
        alert("Tracking link copied!");
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Track My Order",
                    text: `Track my order (ID: ${orderId}) here:`,
                    url: trackLink,
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            alert("Sharing not supported. Please copy link.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Share Tracking Link</h2>
            <p><strong>Order ID:</strong> {orderId}</p>
            <p>
                <strong>Tracking Link:</strong>{" "}
                <a href={trackLink} target="_blank" rel="noopener noreferrer">{trackLink}</a>
            </p>

            <button onClick={handleCopy} className="btn btn-primary me-2">Copy Link</button>
            <button onClick={handleShare} className="btn btn-success">Share</button>
        </div>
    );
};

export default ShareTrackerPage;

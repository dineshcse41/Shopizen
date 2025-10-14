import React from "react";
import "./Preloader.css";

const Preloader = () => {
    return (
        <div className="preloader-container">
            <div className="spinner"></div>
            <p>Loading, please wait...</p>
        </div>
    );
};

export default Preloader;

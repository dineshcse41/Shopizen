import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-wrapper">
            <div className="footer-section">
                <div>ABOUT</div>
                <Link to="/about">About Us</Link>
                <Link to="/account/contact">Contact Us</Link>
            </div>

            <div className="footer-section">
                <div>HELP</div>
                <Link to="/payments">Payments</Link>
                <Link to="/shipping">Shipping</Link>
                <Link to="/returns">Returns</Link>
                <Link to="/faq">FAQ</Link>
            </div>

            <div className="footer-section">
                <div>POLICY</div>
                <Link to="/terms">Terms & Conditions</Link>
                <Link to="/privacy">Privacy Policy</Link>
            </div>

            <p className="footer-bottom-text">
                &copy; {currentYear} Shopizen. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;

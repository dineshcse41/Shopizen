import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-wrapper">
            <div className="footer-section">
                <div>ABOUT</div>
                <Link to="../home page/about.html">About Us</Link>
                <Link to="../home page/contact.html">Contact Us</Link>
            </div>

            <div className="footer-section">
                <div>HELP</div>
                <Link to="#">Payments</Link>
                <Link to="#">Shipping</Link>
                <Link to="#">Returns</Link>
                <Link to="../home page/contact.html">FAQ</Link>
            </div>

            <div className="footer-section">
                <div>POLICY</div>
                <Link to="../home page/terms.html">Terms & Conditions</Link>
                <Link to="../home page/policy.html">Privacy Policy</Link>
            </div>

            <p className="footer-bottom-text">
                &copy; {currentYear} Shopizen. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;

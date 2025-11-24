// src/pages/policies/ShippingPolicy.jsx
import React from "react";
import "./PolicyPage.css";

const ShippingPolicy = () => {
  const policyData = {
    pageTitle: "Shipping Policy — Shopizen",
    lastUpdated: "October 29, 2025",
    sections: [
      {
        title: "Shipping Coverage",
        content: [
          "Shopizen currently ships across India through reliable courier partners.",
          "We are expanding to international locations soon.",
        ],
      },
      {
        title: "Delivery Time",
        content: [
          "Orders are usually dispatched within 24–48 hours and delivered within 3–7 business days depending on your location.",
          "You will receive tracking details once your order is shipped.",
        ],
      },
      {
        title: "Shipping Charges",
        content: [
          "Shipping is free for orders above ₹499.",
          "For orders below ₹499, a nominal delivery fee will apply.",
        ],
      },
      {
        title: "Order Tracking",
        content: [
          "You can track your order from the ‘My Orders’ section in your Shopizen account or via the tracking link sent by email/SMS.",
        ],
      },
    ],
  };

  return (
    <div className="policies-container p-4">
      {/* Header Section */}
      <div className="policies-header text-center mb-4">
        <h1>{policyData.pageTitle}</h1>
        <div className="policies-meta">
          Last updated: {policyData.lastUpdated}
        </div>
      </div>

      {/* Content Sections */}
      {policyData.sections.map((section, index) => (
        <section key={index} className="policy-section mb-4">
          <h4>{section.title}</h4>
          {section.content.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </section>
      ))}

      {/* Contact Info */}
      <div className="contact-box text-center mt-5">
        <strong>For Assistance:</strong>{" "}
        <a href="mailto:support@shopizen.com">support@shopizen.com</a>
      </div>
    </div>
  );
};

export default ShippingPolicy;

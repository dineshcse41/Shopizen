// src/pages/policies/ReturnPolicy.jsx
import React from "react";
import "./PolicyPage.css";

const ReturnPolicy = () => {
  const policyData = {
    pageTitle: "Return & Refund Policy — Shopizen",
    lastUpdated: "October 29, 2025",
    sections: [
      {
        title: "Return Eligibility",
        content: [
          "Products are eligible for return within 7 days of delivery if they are defective, damaged, or not as described.",
          "Certain categories like innerwear, cosmetics, and personalized items are not returnable.",
        ],
      },
      {
        title: "Return Process",
        content: [
          "Go to ‘My Orders’, select the item you wish to return, and initiate a return request.",
          "Our logistics partner will arrange for pickup, or you can ship the product to the address provided.",
        ],
      },
      {
        title: "Refund Timelines",
        content: [
          "Once the returned item is inspected and approved, refunds are processed within 5–7 business days.",
          "Refunds will be made to your original payment source or Shopizen wallet.",
        ],
      },
      {
        title: "Exchange Policy",
        content: [
          "If you prefer an exchange instead of a refund, select the ‘Replace Item’ option while initiating a return request.",
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

export default ReturnPolicy;

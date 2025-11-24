import React from "react";
import "./PolicyPage.css";

const TermsAndConditions = () => {
  const policyData = {
    pageTitle: "Terms & Conditions — Shopizen",
    lastUpdated: "October 29, 2025",
    sections: [
      {
        title: "Introduction",
        content: [
          "Welcome to Shopizen! These Terms and Conditions ('Terms') govern your access to and use of our website, mobile application, and related services.",
          "By using Shopizen, you agree to comply with and be bound by these Terms. If you do not agree, please do not use our services.",
        ],
      },
      {
        title: "User Account & Responsibilities",
        content: [
          "To make purchases, you must register an account with accurate and complete details.",
          "You are responsible for maintaining the confidentiality of your account information, including your password, and for all activities under your account.",
        ],
      },
      {
        title: "Product Information & Pricing",
        content: [
          "We make every effort to display accurate product information, but errors in pricing or descriptions may occur.",
          "In such cases, Shopizen reserves the right to cancel or modify the order after notifying you.",
        ],
      },
      {
        title: "Intellectual Property",
        content: [
          "All content, including logos, text, images, and software, is the property of Shopizen or its content suppliers.",
          "Unauthorized reproduction or redistribution of Shopizen content is prohibited.",
        ],
      },
      {
        title: "Governing Law & Jurisdiction",
        content: [
          "These Terms are governed by the laws of India.",
          "In case of disputes, the jurisdiction will be Chennai, Tamil Nadu.",
        ],
      },
    ],
  };

  return (
    <div className="policies-container p-4">
      <div className="policies-header text-center mb-4">
        <h1>{policyData.pageTitle}</h1>
        <div className="policies-meta">
          Last updated: {policyData.lastUpdated}
        </div>
      </div>

      {policyData.sections.map((section, index) => (
        <section key={index} className="policy-section mb-4">
          <h4>{section.title}</h4>
          {section.content.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </section>
      ))}

      <div className="contact-box text-center mt-5">
        <strong>For Assistance:</strong>{" "}
        <a href="mailto:support@shopizen.com">support@shopizen.com</a>
      </div>
    </div>
  );
};

export default TermsAndConditions;

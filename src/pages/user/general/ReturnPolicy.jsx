// src/pages/policies/ReturnPolicy.jsx
import React, { useEffect, useState } from "react";
import "./PolicyPage.css";
import policies from "../../../data/policies/returns.json";

const ReturnPolicy = () => {
  const [policyData, setPolicyData] = useState(null);

  useEffect(() => {
    setPolicyData(policies);
  }, []);

  if (!policyData) return <p className="text-center mt-5">Loading policy...</p>;

  return (
    <div className=" policies-container  p-4">
      {/* Header Section */}
      <div className="policies-header text-center mb-4">
        <h1>{policyData.pageTitle || "Return Policy"}</h1>
        {policyData.lastUpdated && (
          <div className="policies-meta">
            Last updated: {policyData.lastUpdated}
          </div>
        )}
      </div>

      {/* Content Sections */}
      {policyData.sections &&
        policyData.sections.map((section, index) => (
          <section key={index} className="policy-section mb-4">
            <h4>{section.title}</h4>
            {Array.isArray(section.content) ? (
              section.content.map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <p>{section.content}</p>
            )}
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

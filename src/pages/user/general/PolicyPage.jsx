import React, { useEffect, useState } from "react";
import "./PolicyPage.css";

const PolicyPage = ({ jsonData }) => {
    const [policyData, setPolicyData] = useState(null);

    useEffect(() => {
        // Directly set imported JSON as data
        setPolicyData(jsonData);
    }, [jsonData]);

    if (!policyData) return <p className="text-center mt-5">Loading policy...</p>;

    return (
        <div className="policies-container p-4">
            <div className="policies-header text-center mb-4">
                <h1>{policyData.pageTitle}</h1>
                <div className="policies-meta">Last updated: {policyData.lastUpdated}</div>
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

export default PolicyPage;

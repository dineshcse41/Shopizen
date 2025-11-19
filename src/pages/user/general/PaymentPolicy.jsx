import React, { useEffect, useState } from "react";
import "./PolicyPage.css";
import policies from "../../../data/policies/payments.json";

const PaymentPolicy = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        // ✅ Directly assign the imported JSON
        setData(policies);
    }, []);

    if (!data) return <p>Loading...</p>;

    return (
        <div className="policy-page py-5">
            <h2 className="policy-title mb-4 text-center">{data.pageTitle}</h2>
            <p className="text-center text-muted">Last updated: {data.lastUpdated}</p>

            {data.sections.map((sec, index) => (
                <div key={index} className="policy-section mb-4">
                    <h5 className="section-heading">{sec.title}</h5>
                    {sec.content.map((para, i) => (
                        <p key={i} className="section-content">{para}</p>
                    ))}
                </div>
            ))}

            <div className="text-center mt-5 contact-box">
                <strong>Need help?</strong>{" "}
                <a href="mailto:support@shopizen.com">support@shopizen.com</a>
            </div>
        </div>
    );
};

export default PaymentPolicy;

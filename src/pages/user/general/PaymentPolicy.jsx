import React from "react";
import "./PolicyPage.css";

const PaymentPolicy = () => {
  const data = {
    pageTitle: "Payment Policy — Shopizen",
    lastUpdated: "October 29, 2025",
    sections: [
      {
        title: "Accepted Payment Methods",
        content: [
          "Shopizen accepts all major Credit Cards, Debit Cards, UPI, Net Banking, and leading digital wallets.",
          "Cash on Delivery (COD) is available for select pin codes.",
        ],
      },
      {
        title: "Payment Security",
        content: [
          "All payments are processed through secure, PCI-DSS compliant gateways.",
          "Shopizen does not store your card or banking credentials on its servers.",
        ],
      },
      {
        title: "Order Confirmation",
        content: [
          "Once payment is successful, you will receive an order confirmation email and SMS.",
          "In case of payment failure, please retry using a different method or contact your bank.",
        ],
      },
      {
        title: "Refunds & Cancellations",
        content: [
          "Refunds for canceled or returned orders will be credited to your original payment method within 5–7 business days.",
          "For COD orders, refunds will be initiated through bank transfer or UPI.",
        ],
      },
    ],
  };

  return (
    <div className="policy-page py-5">
      <h2 className="policy-title mb-4 text-center">{data.pageTitle}</h2>
      <p className="text-center text-muted">Last updated: {data.lastUpdated}</p>

      {data.sections.map((sec, index) => (
        <div key={index} className="policy-section mb-4">
          <h5 className="section-heading">{sec.title}</h5>
          {sec.content.map((para, i) => (
            <p key={i} className="section-content">
              {para}
            </p>
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

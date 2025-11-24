import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./FAQ.css";

const FAQ = () => {
  // ✅ Static FAQ Data (instead of fetching JSON)
  const staticFaqData = [
    {
      question: "What is Shopizen?",
      answer:
        "Shopizen is your one-stop online shopping destination offering fashion, electronics, home essentials, and more — all with fast delivery and secure payment options.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you’ll receive a tracking ID via email or SMS. You can also check the order status directly in the 'My Orders' section of your Shopizen account.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major debit/credit cards, UPI, net banking, and wallets like Paytm and Google Pay. Cash on Delivery is also available for select locations.",
    },
    {
      question: "Can I return or exchange an item?",
      answer:
        "Yes! We offer a 7-day hassle-free return and exchange policy. Simply visit the 'My Orders' page and request a return or exchange for eligible items.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Currently, Shopizen delivers across India. We’re working on expanding to international shipping very soon!",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach us via the 'Contact Us' page, email us at support@shopizen.in, or call our 24/7 helpline at +91 98765 43210.",
    },
  ];

  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    // ❇️ Directly load static FAQ data
    setFaqs(staticFaqData);
  }, []);

  return (
    <div className="faq-container ">
      <h2 className="faq-title text-center mb-4">Frequently Asked Questions</h2>
      <p className="faq-subtitle text-center mb-5">
        Find quick answers to common queries about shopping on Shopizen.
      </p>

      <div className="accordion w-75 " id="faqAccordion">
        {faqs.length > 0 ? (
          faqs.map((faq, index) => (
            <div className="accordion-item mb-3  shadow-sm" key={index}>
              <h2 className="accordion-header" id={`heading${index}`}>
                <button
                  className={`accordion-button ${
                    index !== 0 ? "collapsed" : ""
                  }`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  aria-expanded={index === 0 ? "true" : "false"}
                  aria-controls={`collapse${index}`}
                >
                  {faq.question}
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className={`accordion-collapse collapse ${
                  index === 0 ? "show" : ""
                }`}
                aria-labelledby={`heading${index}`}
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">{faq.answer}</div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">Loading FAQs...</p>
        )}
      </div>

      {/* Contact Support */}
      <div className="text-center mt-5">
        <p className="faq-contact-text mb-3">
          Still have questions or need further assistance?
        </p>
        <Link to="/account/contact" className="btn btn-primary faq-contact-btn mb-2">
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default FAQ;

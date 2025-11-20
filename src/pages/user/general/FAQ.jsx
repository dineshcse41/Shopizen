import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FAQ.css";
import { Link } from "react-router-dom";

const FAQ = () => {
    const [faqs, setFaqs] = useState([]);

    useEffect(() => {
        // ✅ Recommended: Move faqData.json to /public for easier fetching
        fetch("../src/data/common/faqData.json")
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch FAQ data");
                return response.json();
            })
            .then((data) => setFaqs(data))
            .catch((error) => console.error("Error loading FAQs:", error));
    }, []);

    return (
        <div className="faq-container container py-5">
            <h2 className="faq-title text-center mb-4">Frequently Asked Questions</h2>
            <p className="faq-subtitle text-center mb-5">
                Find quick answers to common queries about shopping on Shopizen.
            </p>

            <div className="accordion" id="faqAccordion">
                {faqs.length > 0 ? (
                    faqs.map((faq, index) => (
                        <div className="accordion-item mb-3 shadow-sm" key={index}>
                            <h2 className="accordion-header" id={`heading${index}`}>
                                <button
                                    className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
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
                                className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
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

            {/* ✅ Contact Support CTA */}
            <div className="text-center mt-5">
                <p className="faq-contact-text mb-3">
                    Still have questions or need further assistance?
                </p>
                <Link to="/account/contact" className="btn btn-primary faq-contact-btn">
                    Contact Support
                </Link>
            </div>
        </div>
    );
};

export default FAQ;

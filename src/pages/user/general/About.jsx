import React from "react";
import "./About.css"; // custom styles

export default function About() {
  return (
    <div className="about-page">
      {/* HERO SECTION */}
      <section className="hero">
        <h1>About Shopizen</h1>
        <p>Your trusted destination for online shopping in India</p>
      </section>

      {/* WHO WE ARE */}
          <section className="container py-5">
        <h2 className="section-title ">Who We Are</h2>
        <p className="lead ">
          Shopizen is a modern Indian e-commerce platform created by a passionate
          team to give customers a seamless and enjoyable online shopping
          experience. We offer everything from fashion and electronics to daily
          essentials — all in one trusted place.
        </p>
      </section>

      {/* MISSION & VISION */}
          <section className="container py-5">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card card-custom h-100 p-4">
              <h3 className="text-center text-primary">
                <i className="bi bi-bullseye"></i> Our Mission
              </h3>
              <p className="mt-3 text-secondary text-center">
                To provide quality products at affordable prices with fast
                delivery, easy returns, and friendly customer service — making
                online shopping simple and stress-free.
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card card-custom h-100 p-4">
              <h3 className="text-center text-success">
                <i className="bi bi-eye"></i> Our Vision
              </h3>
              <p className="mt-3 text-secondary text-center">
                To become India’s most trusted and customer-friendly online
                shopping platform, built on transparency, technology, and service
                excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="container py-5">
        <h2 className="section-title">Why Shopizen?</h2>
        <div className="row g-4 mt-4">
          {[
            {
              icon: "bi-shield-check",
              title: "100% Genuine",
              desc: "All products are authentic and quality-checked.",
            },
            {
              icon: "bi-truck",
              title: "Fast Delivery",
              desc: "Orders delivered quickly and safely across India.",
            },
            {
              icon: "bi-arrow-repeat",
              title: "Easy Returns",
              desc: "7-day hassle-free return & refund policy.",
            },
            {
              icon: "bi-lock",
              title: "Secure Payments",
              desc: "Trusted payment gateways with data protection.",
            },
            {
              icon: "bi-chat-dots",
              title: "Friendly Support",
              desc: "Always available to assist customers.",
            },
          ].map((value, index) => (
            <div key={index} className="col-md-4 col-lg-3 col-sm-6 mx-auto">
              <div className="value-box">
                <i className={`bi ${value.icon}`}></i>
                <h5>{value.title}</h5>
                <p>{value.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      
    </div>
  );
}

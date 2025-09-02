// CheckoutPage.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../../src/components/context/CartContext";
import { AuthContext } from "../../src/components/context/AuthContext";
import Navbar from "../../src/components/Navbar/Navbar";
import ProgressBar from "../../src/components/Cart/ProgressBar";
import "./order.css";

// Utility for unique IDs
const uid = (prefix = "id") =>
  `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;

const CheckoutPage = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const buyNowProduct = location.state?.buyNowProduct;
  const itemsToCheckout = buyNowProduct ? [buyNowProduct] : cart;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    houseNo: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    paymentMethod: "",
  });

  const totalItems =
    itemsToCheckout?.reduce((sum, p) => sum + p.quantity, 0) || 0;
  const totalPrice =
    itemsToCheckout?.reduce((sum, p) => sum + p.price * p.quantity, 0) || 0;

  // Input Change Handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Razorpay payment start
const startRazorpayPayment = (order) => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = () => {
    const options = {
      key: "rzp_test_xxxxxxxx", // 🔑 your Razorpay test key
      amount: order.totalPrice * 100, // in paise
      currency: "INR",
      name: "My Shop",
      description: "Order Payment",
      handler: function (response) {
        // ✅ Success → update order
        order.paymentStatus = "Paid";
        order.razorpay_payment_id = response.razorpay_payment_id;
        saveOrder(order, true);
      },
      modal: {
        ondismiss: function () {
          // ❌ User closed modal without paying
          navigate("/payment-failure");
        },
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone,
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);

    // ✅ Listen for payment failures
    rzp.on("payment.failed", function (response) {
      console.error("Payment failed:", response.error);
      order.paymentStatus = "Failed";
      saveOrder(order, false);
      navigate("/payment-failure", { state: { orderData: order } });
    });

    rzp.open();
  };
  document.body.appendChild(script);
};


  // ✅ Save order to localStorage & navigate
  const saveOrder = (order, isPaid) => {
    const existingOrders =
      JSON.parse(localStorage.getItem(`orders_${user.id}`)) || [];
    localStorage.setItem(
      `orders_${user.id}`,
      JSON.stringify([...existingOrders, order])
    );

    if (!buyNowProduct) {
      clearCart();
    }

    // Navigate based on status
    if (isPaid) {
      navigate("/payment-success", { state: { orderData: order } });
    } else {
      navigate("/order-confirm", { state: { orderData: order } });
    }
  };

  // ✅ Place Order
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first to place an order.");
      navigate("/login-email");
      return;
    }

    if (!formData.paymentMethod) {
      alert("Please choose a payment method");
      return;
    }

    // Generate order
    const orderId = uid("ORD");
    const orderItems = itemsToCheckout.map((item) => ({
      ...item,
      orderItemId: uid("IT"),
      expectedDelivery: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toDateString(),
    }));

    const order = {
      id: orderId,
      customer: formData,
      items: orderItems,
      totalItems,
      totalPrice,
      userId: user.id,
      paymentStatus:
        formData.paymentMethod === "cod" ? "Pending" : "Initiated",
    };

    // COD → directly save & go to confirm page
    if (formData.paymentMethod === "cod") {
      saveOrder(order, false);
    } else {
      // Online → trigger Razorpay
      startRazorpayPayment(order);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-white m-0 p-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap">
          <div className="col-md-4 mb-2">
            <span className="h3 ms-5">
              Secure Checkout <i className="bi bi-cart2"></i>
            </span>
          </div>
          <ProgressBar step={2} />
        </div>
      </div>

      <div className="d-flex checkout-page m-3">
        <div className="col-8">
          <form onSubmit={handleSubmit}>
              {/* Personal Info */}
                        <div className="personal-info m-1 p-2 border rounded">
                            <h4>Personal Information</h4>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label htmlFor="firstName" className="form-label">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        id="firstName"
                                        className="form-control"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="lastName" className="form-label">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        id="lastName"
                                        className="form-control"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="phone" className="form-label">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        className="form-control"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="shipping-info m-2 p-2 border rounded">
                            <h4>Shipping Address</h4>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label htmlFor="houseNo" className="form-label">
                                        House No./Building
                                    </label>
                                    <input
                                        type="text"
                                        name="houseNo"
                                        id="houseNo"
                                        className="form-control"
                                        value={formData.houseNo}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="address" className="form-label">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        className="form-control"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="city" className="form-label">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        id="city"
                                        className="form-control"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="state" className="form-label">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        id="state"
                                        className="form-control"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="pincode" className="form-label">
                                        Pincode
                                    </label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        id="pincode"
                                        className="form-control"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="country" className="form-label">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        id="country"
                                        className="form-control"
                                        value={formData.country}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

            {/* Payment Info */}
            <div className="payment-info m-2 p-2 border rounded">
              <h4>Payment Method</h4>
              <select
                className="form-select"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select payment method
                </option>
                <optgroup label="Offline">
                  <option value="cod">Cash on Delivery (COD)</option>
                </optgroup>
                <optgroup label="Online Payments">
                  <option value="razorpay">Razorpay (UPI/Card/NetBanking)</option>
                </optgroup>
              </select>
            </div>

            {/* Review Products */}
                        <div className="review-product m-2 p-3 border rounded">
                            <h4>Product Overview</h4>
                            {itemsToCheckout.map((p) => (
                                <div
                                    key={p.id}
                                    className="d-flex align-items-center mb-3 border p-2"
                                >
                                    <img
                                        src={p.image}
                                        alt={p.name}
                                        className="me-3"
                                        style={{ width: "80px" }}
                                    />
                                    <div>
                                        <h6>{p.name}</h6>
                                        <p className="mb-0">Quantity: {p.quantity}</p>
                                        <p className="mb-0">Price: ₹{p.price * p.quantity}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="d-flex justify-content-between border-top pt-2 mt-2">
                                <strong>Total Items:</strong>
                                <span>{totalItems}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <strong>Total Price:</strong>
                                <span>₹{totalPrice}</span>
                            </div>
                        </div>
          </form>
        </div>

        {/* RIGHT SIDE SUMMARY */}
        <div className="col-4">
          <div
            className="total-sec p-2 border d-flex flex-column"
            style={{ position: "sticky", top: "100px" }}
          >
            <h4 className="text-center">Product Total</h4>
            <span className="h5 m-2">Total Items: {totalItems}</span>
            <div className="d-flex justify-content-between">
              <span>Total Price: </span>
              <span>
                <strong>₹{totalPrice}</strong>
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Delivery:</span>
              <span>₹0</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <span>Order Price: </span>
              <span className="h5">
                <strong>₹{totalPrice}</strong>
              </span>
            </div>
            <div className="col-12 text-end">
              <button
                type="submit"
                className="btn btn-primary mt-3 w-100"
                disabled={itemsToCheckout.length === 0}
                onClick={handleSubmit}
              >
                Place Order
              </button>
              <Link
                to="/cart"
                className="btn btn-outline-secondary w-100 mt-2"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;

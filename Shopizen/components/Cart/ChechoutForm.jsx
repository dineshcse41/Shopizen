import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useNotifications } from "../context/NotificationContext";

const stripePromise = loadStripe("pk_test_..."); // your key

const CheckoutForm = ({ user, itemsToCheckout, buyNowProduct, clearCart, navigate, setPaymentResult }) => {
    const savedAddress = user ? JSON.parse(localStorage.getItem(`address_${user.id}`)) : null;

    const [formData, setFormData] = useState(savedAddress || {
        firstName: "", lastName: "", email: "", phone: "",
        houseNo: "", address: "", city: "", state: "", pincode: "", country: "",
        paymentMethod: "",
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const totalItems = itemsToCheckout.reduce((sum, p) => sum + p.quantity, 0);
    const totalPrice = itemsToCheckout.reduce((sum, p) => sum + p.price * p.quantity, 0);

    const { addNotification } = useNotifications();

    const saveOrder = (order) => {
        const ordersKey = `orders_${user.id}`;
        const existingOrders = JSON.parse(localStorage.getItem(ordersKey)) || [];
        localStorage.setItem(ordersKey, JSON.stringify([...existingOrders, order]));
        return order.id;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            addNotification("Please login first to place an order.", "error");
            navigate("/login-email");
            return;
        }

        localStorage.setItem(`address_${user.id}`, JSON.stringify(formData));

        const orderId = `ORD-${Date.now()}`; // unique per order
        const orderItems = itemsToCheckout.map((item) => ({
            ...item,
            orderItemId: `IT-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toDateString(),
        }));

        const order = {
            id: orderId,
            customer: formData,
            items: orderItems,
            totalItems,
            totalPrice,
            userId: user.id,
            paymentMethod: formData.paymentMethod,
            date: new Date().toLocaleString(),
            paymentStatus: formData.paymentMethod === "cod" ? "pending" : "initiated",
        };

        if (formData.paymentMethod === "cod") {
            saveOrder(order);
            if (!buyNowProduct) clearCart();
            addNotification(`Your order #${orderId} is confirmed`, "success");
            navigate("/order-confirm", { state: { orderData: order } });
        } else {
            try {
                const stripe = await stripePromise;
                const response = await fetch("http://127.0.0.1:8000/create-checkout-session/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ items: itemsToCheckout, email: formData.email }),
                });
                const session = await response.json();
                if (session.error) return setPaymentResult({ success: false, error: session.error });

                const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
                if (error) return setPaymentResult({ success: false, error: error.message });

                saveOrder(order);
                if (!buyNowProduct) clearCart();
                setPaymentResult({ success: true, order });
            } catch (err) {
                setPaymentResult({ success: false, error: err.message });
            }
        }
    };

    return (
        <form id="checkoutForm" onSubmit={handleSubmit}>
            {/* Personal Info */}
            <div className="personal-info border rounded p-2 m-1">
                <h4>Personal Information</h4>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label>First Name</label>
                        <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label>Last Name</label>
                        <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label>Email</label>
                        <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label>Phone</label>
                        <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
                    </div>
                </div>
            </div>

            {/* Shipping Info */}
            <div className="shipping-info border rounded p-2 m-2">
                <h4>Shipping Address</h4>
                <div className="row g-3">
                    {["houseNo", "address", "city", "state", "pincode", "country"].map(field => (
                        <div className="col-md-6" key={field}>
                            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input type="text" name={field} className="form-control" value={formData[field]} onChange={handleChange} required={field !== "country"} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment */}
            <div className="payment-info border rounded p-2 m-2">
                <h4>Payment Method</h4>
                <select className="form-select" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
                    <option value="" disabled>Select payment method</option>
                    <optgroup label="Offline">
                        <option value="cod">Cash on Delivery (COD)</option>
                    </optgroup>
                    <optgroup label="Online Payments">
                        <option value="upi">UPI</option>
                        <option value="netbanking">Net Banking</option>
                        <option value="card">Credit/Debit Card</option>
                        <option value="wallet">Wallets</option>
                        <option value="emi">EMI</option>
                        <option value="paylater">Pay Later</option>
                    </optgroup>
                </select>
            </div>

            {/* Product Overview */}
            <div className="review-product border rounded p-3 m-2">
                <h4>Product Overview</h4>
                {itemsToCheckout.map((p) => (
                    <div key={p.id} className="d-flex flex-column flex-sm-row mb-3 border p-2 align-items-start align-items-sm-center">
                        <img src={p.image} alt={p.name} style={{ width: "80px" }} className="me-sm-3 mb-2 mb-sm-0" />
                        <div>
                            <h6>{p.name}</h6>
                            <p className="mb-0">Quantity: {p.quantity}</p>
                            <p className="mb-0">Price: ₹{p.price * p.quantity}</p>
                        </div>
                    </div>
                ))}
                <div className="d-flex justify-content-between border-top pt-2 mt-2">
                    <strong>Total Items:</strong> <span>{totalItems}</span>
                </div>
                <div className="d-flex justify-content-between">
                    <strong>Total Price:</strong> <span>₹{totalPrice}</span>
                </div>
            </div>
        </form>
    );
};

export default CheckoutForm;

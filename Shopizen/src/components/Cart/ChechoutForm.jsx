// src/components/Checkout/CheckoutForm.jsx
import React, { useState } from "react";

const CheckoutForm = ({ user, itemsToCheckout, buyNowProduct, clearCart, navigate }) => {
    // Prefill address from localStorage if available
    const savedAddress = user ? JSON.parse(localStorage.getItem(`address_${user.id}`)) : null;

    const [formData, setFormData] = useState(savedAddress || {
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!user) {
            alert("Please login first to place an order.");
            navigate("/login-email");
            return;
        }

        // Save address permanently
        localStorage.setItem(`address_${user.id}`, JSON.stringify(formData));

        // Generate order
        const orderId = `ORD-${Date.now()}`;
        const orderItems = itemsToCheckout.map(item => ({
            ...item,
            orderItemId: `IT-${Date.now()}-${item.id}`,
            expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toDateString()
        }));

        const order = {
            id: orderId,
            customer: formData,
            items: orderItems,
            totalItems: itemsToCheckout.reduce((sum, p) => sum + p.quantity, 0),
            totalPrice: itemsToCheckout.reduce((sum, p) => sum + p.price * p.quantity, 0),
            userId: user.id
        };

        const existingOrders = JSON.parse(localStorage.getItem(`orders_${user.id}`)) || [];
        localStorage.setItem(`orders_${user.id}`, JSON.stringify([...existingOrders, order]));

        if (!buyNowProduct) {
            clearCart();
        }

        navigate("/order-confirm", { state: { orderData: order } });
    };

    const totalItems = itemsToCheckout.reduce((sum, p) => sum + p.quantity, 0);
    const totalPrice = itemsToCheckout.reduce((sum, p) => sum + p.price * p.quantity, 0);

    return (
        <form id="checkoutForm" onSubmit={handleSubmit}>
            {/* Personal Info */}
            <div className="personal-info m-1 p-2 border rounded">
                <h4>Personal Information</h4>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label>First Name</label>
                        <input type="text" name="firstName" className="form-control"
                            value={formData.firstName} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label>Last Name</label>
                        <input type="text" name="lastName" className="form-control"
                            value={formData.lastName} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label>Email</label>
                        <input type="email" name="email" className="form-control"
                            value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label>Phone</label>
                        <input type="tel" name="phone" className="form-control"
                            value={formData.phone} onChange={handleChange} />
                    </div>
                </div>
            </div>

            {/* Shipping Info */}
            <div className="shipping-info m-2 p-2 border rounded">
                <h4>Shipping Address</h4>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label>House No.</label>
                        <input type="text" name="houseNo" className="form-control"
                            value={formData.houseNo} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label>Address</label>
                        <input type="text" name="address" className="form-control"
                            value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label>City</label>
                        <input type="text" name="city" className="form-control"
                            value={formData.city} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label>State</label>
                        <input type="text" name="state" className="form-control"
                            value={formData.state} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label>Pincode</label>
                        <input type="text" name="pincode" className="form-control"
                            value={formData.pincode} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label>Country</label>
                        <input type="text" name="country" className="form-control"
                            value={formData.country} onChange={handleChange} />
                    </div>
                </div>
            </div>

            {/* Payment Info */}
            <div className="payment-info m-2 p-2 border rounded">
                <h4>Payment Method</h4>
                <select className="form-select" name="paymentMethod"
                    value={formData.paymentMethod} onChange={handleChange} required>
                    <option value="" disabled>Select payment method</option>
                    <option value="cod">Cash on Delivery (COD)</option>
                    <option value="upi">UPI</option>
                    <option value="netbanking">Net Banking</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="wallet">Wallets</option>
                    <option value="emi">EMI</option>
                    <option value="paylater">Pay Later</option>
                </select>
            </div>

            {/* Product Overview */}
            <div className="review-product m-2 p-3 border rounded">
                <h4>Product Overview</h4>
                {itemsToCheckout.map(p => (
                    <div key={p.id} className="d-flex align-items-center mb-3 border p-2">
                        <img src={p.image} alt={p.name} className="me-3" style={{ width: "80px" }} />
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
    );
};

export default CheckoutForm;

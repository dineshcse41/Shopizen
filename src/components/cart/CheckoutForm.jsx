import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useUserNotifications } from "../context/UserNotificationContext";
import defaultImage from "../../assets/product-default-image.png";

const stripePromise = loadStripe("pk_test_...");

const CheckoutForm = ({
    user,
    itemsToCheckout,
    detailsConfirmed,
    setDetailsConfirmed,
    buyNowProduct,
    clearCart,
    navigate,
    setPaymentResult
}) => {
    const savedAddress = user ? JSON.parse(localStorage.getItem(`address_${user.id}`)) : null;

    const [formData, setFormData] = useState(
        savedAddress || {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            houseNo: "",
            address: "",
            city: "",
            landmark: "",
            state: "",
            pincode: "",
            country: "",
            paymentMethod: "",
        }
    );

    const [checkoutItems, setCheckoutItems] = useState(itemsToCheckout || []);
    const { addNotification } = useUserNotifications();

    useEffect(() => setCheckoutItems(itemsToCheckout), [itemsToCheckout]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // ✅ Dynamically update size for a product
    const handleSizeChange = (productId, size) => {
        const updatedItems = checkoutItems.map(item =>
            item.id === productId ? { ...item, selectedSize: size } : item
        );
        setCheckoutItems(updatedItems);
    };

    const totalItems = checkoutItems.reduce((sum, p) => sum + p.quantity, 0);
    const totalPrice = checkoutItems.reduce((sum, p) => sum + p.price * p.quantity, 0);

    const saveOrder = (order) => {
        const ordersKey = `orders_${user.id}`;
        const existingOrders = JSON.parse(localStorage.getItem(ordersKey)) || [];
        localStorage.setItem(ordersKey, JSON.stringify([...existingOrders, order]));
        return order.id;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!detailsConfirmed) return alert("Please confirm your details first!");

        if (!user) {
            addNotification("Please login first to place an order.", "error");
            navigate("/login-email");
            return;
        }

        localStorage.setItem(`address_${user.id}`, JSON.stringify(formData));

        const orderId = `ORD-${Date.now()}`;
        const orderItems = checkoutItems.map((item) => ({
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
                    body: JSON.stringify({ items: checkoutItems, email: formData.email }),
                });
                const session = await response.json();
                if (session.error)
                    return setPaymentResult({ success: false, error: session.error });

                const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
                if (error)
                    return setPaymentResult({ success: false, error: error.message });

                saveOrder(order);
                if (!buyNowProduct) clearCart();
                setPaymentResult({ success: true, order });
            } catch (err) {
                setPaymentResult({ success: false, error: err.message });
            }
        }
    };

    const confirmDetails = () => {
        const allFilled = Object.values(formData).every(val => val !== "");
        if (!allFilled) {
            alert("Please fill all required details before confirming!");
            return;
        }
        setDetailsConfirmed(true);
    };

    return (
        <form id="checkoutForm" onSubmit={handleSubmit}>
            {/* Personal Info */}
            <div className="personal-info border rounded p-2 m-1">
                <h4>Personal Information</h4>
                <div className="row g-3">
                    {["firstName", "lastName", "email", "phone"].map(field => (
                        <div className="col-md-6" key={field}>
                            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input
                                type={field === "email" ? "email" : "text"}
                                name={field}
                                className="form-control"
                                value={formData[field]}
                                onChange={handleChange}
                                required={field !== "phone"}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Shipping Info */}
            <div className="shipping-info border rounded p-2 m-2">
                <h4>Shipping Address</h4>
                <div className="row g-3">
                    {["houseNo", "address", "city", "landmark", "state", "pincode", "country"].map(field => (
                        <div className="col-md-6" key={field}>
                            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input
                                type="text"
                                name={field}
                                className="form-control"
                                value={formData[field]}
                                onChange={handleChange}
                                required={field !== "country"}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Method */}
            <div className="payment-info border rounded p-2 m-2">
                <h4>Payment Method</h4>
                <select
                    className="form-select"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    required
                >
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

            {/* ✅ Product Overview (2 products per row on all screens) */}
            <div className="review-product border rounded p-3 m-2">
                <h4>Product Overview</h4>

                <div
                    className="d-flex flex-wrap justify-content-center gap-3"
                    style={{ width: "100%" }}
                >
                    {checkoutItems.map((p) => (
                        <div
                            key={p.id}
                            className="border p-2 rounded shadow-sm"
                            style={{
                                flex: "1 1 calc(50% - 12px)", // ✅ exactly 2 per row (both desktop & mobile)
                                maxWidth: "calc(50% - 12px)",
                                boxSizing: "border-box",
                                
                            }}
                        >
                            <div className="d-flex flex-column align-items-center text-center">
                                <img
                                    src={p.images?.[0] || defaultImage}
                                    alt={p.name}
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        marginBottom: "8px",
                                    }}
                                    onError={(e) => (e.target.src = defaultImage)}
                                />

                                <h6 className="fw-semibold">{p.name}</h6>
                                <p className="mb-1">Quantity: {p.quantity}</p>

                                {/* ✅ Editable size dropdown */}
                                <div className="d-flex align-items-center justify-content-center mb-1">
                                    <label className="me-2 mb-0 small">Size:</label>
                                    {p.sizes && p.sizes.length > 0 ? (
                                        <select
                                            className="form-select form-select-sm w-auto"
                                            value={p.selectedSize || p.size || "Free Size"}
                                            onChange={(e) => handleSizeChange(p.id, e.target.value)}
                                        >
                                            {p.sizes.map((size) => (
                                                <option key={size} value={size}>
                                                    {size}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className="badge bg-secondary">Free Size</span>
                                    )}
                                </div>

                                <p className="fw-bold mb-0">₹{p.price * p.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="d-flex justify-content-between border-top pt-2 mt-3">
                    <strong>Total ({totalItems} items):</strong>
                    <strong>₹{totalPrice}</strong>
                </div>
            </div>


            {/* Confirm Details Button */}
            <div className="text-end m-2">
                <button
                    type="button"
                    className={`btn ${detailsConfirmed ? "btn-success" : "btn-primary"}`}
                    onClick={confirmDetails}
                >
                    {detailsConfirmed ? "Confirmed ✅" : "Confirm Details"}
                </button>
            </div>
        </form>
    );
};

export default CheckoutForm;

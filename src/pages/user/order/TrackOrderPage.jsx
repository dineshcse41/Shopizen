import React, { useEffect, useState, useContext, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../components/context/AuthContext";
import "../../user/order/OrderPage.css";
import Footer from "../../../components/Footer/Footer";
import ordersData from "../../../data/orders/orders.json";

const statuses = ["Placed", "Confirmed", "Shipped", "Delivered"];
const statusColors = ["#6c757d", "#0d6efd", "#fd7e14", "#198754"];
const statusMap = {
  Pending: 0,
  Processing: 1,
  Placed: 0,
  Confirmed: 1,
  Shipped: 2,
  Delivered: 3,
};

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const intervalRef = useRef(null);

  const storageKey = useMemo(() => (user ? `orders_${user.id}` : null), [user]);

  const formatPrice = (amount, currency = "INR") =>
    new Intl.NumberFormat(navigator.language, {
      style: "currency",
      currency,
    }).format(amount);

  // Load order
  useEffect(() => {
    if (!orderId) return;

    const found = ordersData.find((o) => o.orderId === orderId);
    if (found) {
      const updatedItems = found.items.map((item) => ({
        ...item,
        statusIndex: statusMap[found.status] || 0,
      }));
      setOrder({ ...found, items: updatedItems });
    }
  }, [orderId]);

  // Auto-progress statuses
  useEffect(() => {
    if (!order || !storageKey) return;

    if (order.items.some((i) => i.statusIndex === -1)) return;

    intervalRef.current = setInterval(() => {
      setOrder((prev) => {
        if (!prev) return prev;

        const updatedItems = prev.items.map((item) => {
          if (item.statusIndex < statuses.length - 1) {
            return { ...item, statusIndex: item.statusIndex + 1 };
          }
          return item;
        });

        const updatedOrder = { ...prev, items: updatedItems };

        // Save to localStorage
        const allOrders = JSON.parse(localStorage.getItem(storageKey)) || [];
        const newOrders = allOrders.map((o) =>
          o.orderId === orderId ? updatedOrder : o
        );
        localStorage.setItem(storageKey, JSON.stringify(newOrders));

        return updatedOrder;
      });
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [order, storageKey, orderId]);

  if (!user)
    return (
      <p className="text-center mt-4">Please login to track your order.</p>
    );
  if (!order)
    return (
      <div className="m-4" style={{ height: "187px" }}>
        <p className="text-center mt-4">Order not found!</p>
      </div>
    );

  // Calculate overall order status: max statusIndex among items
  const overallStatusIndex = Math.max(
    ...order.items.map((item) => item.statusIndex)
  );

  return (
    <>
      <div className="track-order-page-container mx-4 my-4">
        <h2 className="mb-4">Tracking Order: {orderId}</h2>

        {order.items?.map((item) => (
          <div key={item.orderItemId} className="card mb-2 shadow-sm">
            <div className="card-body">
              <h5>{item.productName}</h5>
              <p>
                <strong>Quantity:</strong> {item.quantity} |{" "}
                <strong>Price:</strong>{" "}
                {formatPrice(item.price * (item.quantity || 1), order.currency)}
              </p>
              <p>
                <strong>Expected Delivery:</strong>{" "}
                {order.expectedDelivery || "N/A"}
              </p>
            </div>
          </div>
        ))}

        {/* Single Progress Bar for entire order */}
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5>Order Status</h5>
            <div className="d-flex justify-content-between align-items-center mt-2">
              {statuses.map((status, i) => (
                <div
                  key={i}
                  className="progress-status-bar text-center"
                  style={{
                    flex: 1,
                    margin: "0 2px",
                    padding: "6px 0",
                    borderRadius: "5px",
                    backgroundColor:
                      i <= overallStatusIndex ? statusColors[i] : "#e0e0e0",
                    color: i <= overallStatusIndex ? "#fff" : "#000",
                    fontWeight: i === overallStatusIndex ? "bold" : "normal",
                    fontSize: i === overallStatusIndex ? "0.95rem" : "0.85rem",
                    transition: "background-color 0.5s, color 0.5s",
                  }}
                >
                  {status}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TrackOrderPage;

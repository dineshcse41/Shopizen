import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../../../components/context/AuthContext";
import Footer from "../../../components/Footer/Footer";
import "../../user/order/Order.css";

const statuses = ["Placed", "Confirmed", "Shipped", "Delivered"];

const TrackOrderPage = () => {
  const { orderId, itemId } = useParams();
  const { user } = useContext(AuthContext);
  const [item, setItem] = useState(null);
  const [order, setOrder] = useState(null);
  const intervalRef = useRef(null);

  const storageKey = useMemo(() => (user ? `orders_${user.id}` : null), [user]);

  // Load order and specific item
  useEffect(() => {
    if (!storageKey || !orderId || !itemId) return;

    const orders = JSON.parse(localStorage.getItem(storageKey)) || [];
    const foundOrder = orders.find((o) => o.id === orderId);
    if (!foundOrder) return;

    const foundItem = foundOrder.items.find((i) => i.orderItemId === itemId);
    if (!foundItem) return;

    setOrder(foundOrder);
    setItem(foundItem);
  }, [storageKey, orderId, itemId]);

  // Auto-progress for this specific item
  useEffect(() => {
    if (!item || !order || !storageKey) return;

    intervalRef.current = setInterval(() => {
      setItem((prev) => {
        if (!prev) return prev;

        let updatedItem = { ...prev };
        if (updatedItem.statusIndex !== -1 && updatedItem.statusIndex < statuses.length - 1) {
          updatedItem.statusIndex += 1;
        }

        // Update order in localStorage
        const allOrders = JSON.parse(localStorage.getItem(storageKey)) || [];
        const updatedOrders = allOrders.map((o) => {
          if (o.id === order.id) {
            return {
              ...o,
              items: o.items.map((i) => (i.orderItemId === itemId ? updatedItem : i)),
            };
          }
          return o;
        });
        localStorage.setItem(storageKey, JSON.stringify(updatedOrders));

        return updatedItem;
      });
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [item, order, storageKey, itemId]);

  if (!user) return <p className="text-center mt-4">Please login to track your order.</p>;
  if (!item) return <p className="text-center mt-4">Item not found!</p>;

  return (
    <>
      <div className="mx-4 my-4">
        <h2 className="mb-4">Tracking Item: {item.name}</h2>
        <h5>Order ID: {orderId}</h5>

        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <p><strong>Expected Delivery:</strong> {item.expectedDelivery || "N/A"}</p>

            {item.statusIndex === -1 ? (
              <p className="text-danger fw-bold">
                {item.action === "return" ? `Returned: ${item.reason}` : `Cancelled: ${item.reason}`}
              </p>
            ) : (
              <div className="progress mb-3" style={{ height: "25px" }}>
                {statuses.map((status, index) => (
                  <div
                    key={index}
                    className={`progress-bar ${
                      index <= item.statusIndex ? "bg-success" : "bg-light text-dark"
                    }`}
                    style={{ width: `${100 / statuses.length}%` }}
                  >
                    {status}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Link to="/orders" className="btn btn-outline-primary me-2">Back to Orders</Link>
        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
      <Footer />
    </>
  );
};

export default TrackOrderPage;

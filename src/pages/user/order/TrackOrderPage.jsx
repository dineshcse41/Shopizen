import React, { useEffect, useState, useContext, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../components/context/AuthContext";
import "../../user/order/Order.css";

import Footer from "../../../components/Footer/Footer";

const statuses = ["Placed", "Confirmed", "Shipped", "Delivered"];

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const intervalRef = useRef(null);

  const storageKey = useMemo(() => (user ? `orders_${user.id}` : null), [user]);

  // Load order from localStorage
  useEffect(() => {
    if (!storageKey || !orderId) return;
    const orders = JSON.parse(localStorage.getItem(storageKey)) || [];
    const found = orders.find((o) => o.id === orderId);
    if (found) setOrder(found);
  }, [storageKey, orderId]);

  // Auto-progress statuses & sync with localStorage
  useEffect(() => {
    if (!order || !storageKey) return;

    // Stop auto-progress if any item is cancelled/returned
    if (order.items.some((i) => i.statusIndex === -1)) return;

    intervalRef.current = setInterval(() => {
      setOrder((prev) => {
        if (!prev) return prev;

        const updated = {
          ...prev,
          items: prev.items.map((item) => {
            if (item.statusIndex < statuses.length - 1) {
              return { ...item, statusIndex: item.statusIndex + 1 };
            }
            return item;
          }),
        };

        // 🔥 Save updated order back into localStorage
        const allOrders = JSON.parse(localStorage.getItem(storageKey)) || [];
        const newOrders = allOrders.map((o) => (o.id === orderId ? updated : o));
        localStorage.setItem(storageKey, JSON.stringify(newOrders));

        return updated;
      });
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [order, storageKey, orderId]);

  if (!user) return <p className="text-center mt-4">Please login to track your order.</p>;
  if (!order) return <p className="text-center mt-4">Order not found!</p>;

  return (
    <>

      <div className="mx-4 my-4">
        <h2 className="mb-4">Tracking Order: {orderId}</h2>

        {order.items?.map((item) => (
          <div key={item.orderItemId} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5>{item.name}</h5>
              <p>
                <strong>Expected Delivery:</strong>{" "}
                {item.expectedDelivery || "N/A"}
              </p>

              {item.statusIndex === -1 ? (
                <p className="text-danger fw-bold">
                  {item.action === "return"
                    ? `Returned: ${item.reason}`
                    : `Cancelled: ${item.reason}`}
                </p>
              ) : (
                <div className="progress mb-3" style={{ height: "25px" }}>
                  {statuses.map((status, index) => (
                    <div
                      key={index}
                      className={`progress-bar ${index <= item.statusIndex
                        ? "bg-success"
                        : "bg-light text-dark"
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
        ))}
      </div>
      <Footer />
    </>
  );
};

export default TrackOrderPage;
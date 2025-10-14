import React, { useContext, useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../components/context/AuthContext";
import { useToast } from "../../../components/context/ToastContext";
import { useUserNotifications } from "../../../components/context/UserNotificationContext";
import ordersData from "../../../data/orders/orders.json";
import orderItemsData from "../../../data/orders/order_items.json";
import pickupAgentsData from "../../../data/orders/pickupAgent.json";
import "./Order.css";

const OrderPage = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { addNotification } = useUserNotifications();

  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [agents, setAgents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [reason, setReason] = useState("");
  const [actionType, setActionType] = useState(""); // "returnOrExchange"

  const storageKey = useMemo(() => (user ? `orders_${user.id}` : null), [user]);

  // Load data separately
  useEffect(() => {
    setOrders(ordersData);
    setOrderItems(orderItemsData);
    setAgents(pickupAgentsData);
  }, []);

  if (!user) {
    addNotification("Please login first to view orders.", "error");
    navigate("/login-email");
    return null;
  }

  const openModal = (orderId, itemId, type) => {
    setSelectedOrderId(orderId);
    setSelectedItemId(itemId);
    setActionType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrderId(null);
    setSelectedItemId(null);
    setReason("");
    setActionType("");
    setModalOpen(false);
  };

  const confirmAction = () => {
    if (!reason.trim()) {
      showToast("Please provide a reason", "error");
      return;
    }

    // Assign a random pickup agent
    const agent = agents[Math.floor(Math.random() * agents.length)];

    // Update order item status
    const updatedItems = orderItems.map(item => {
      if (item.orderItemId === selectedItemId) {
        return {
          ...item,
          action: actionType, // "returnOrExchange"
          reason,
          pickupAgent: agent,
          status: "Pickup Scheduled"
        };
      }
      return item;
    });

    setOrderItems(updatedItems);
    showToast("Return/Exchange request submitted! Pickup agent assigned.", "success");
    closeModal();
  };

  return (
    <div className="mx-4 my-4">
      <h2 className="mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info">No orders found.</div>
      ) : (
        orders.map(order => {
          const items = orderItems.filter(item => item.orderId === order.orderId);

          return (
            <div key={order.orderId} className="card shadow-sm mb-4 order-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <span><strong>Order ID:</strong> {order.orderId}</span>
                <span className="badge bg-primary">{order.status}</span>
              </div>
              <div className="card-body">
                {items.map(item => (
                  <div key={item.orderItemId} className="d-flex align-items-center border-bottom pb-2 mb-2">
                    <img
                      src={item.image || "https://via.placeholder.com/60"}
                      alt={item.name}
                      className="img-thumbnail me-3 order-img"
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{item.name}</h6>
                      <p className="mb-0 text-muted">
                        Qty: {item.quantity} | ₹{(item.price || 0) * (item.quantity || 0)}
                      </p>

                      {item.status !== "Returned" && item.status !== "Cancelled" && order.status === "Delivered" && (
                        <div className="mt-2">
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => openModal(order.orderId, item.orderItemId, "returnOrExchange")}
                          >
                            Return / Exchange
                          </button>
                        </div>
                      )}

                      {item.status && (
                        <p className="text-info mt-1 small">
                          {item.status === "Pickup Scheduled" &&
                            `Pickup Agent: ${item.pickupAgent.name} (${item.pickupAgent.phone})`}
                        </p>
                      )}

                      {item.status === "Returned" && (
                        <p className="text-success mt-1 small">Returned successfully</p>
                      )}
                    </div>

                    <Link to={`/track/${order.orderId}/${item.orderItemId}`} className="btn btn-primary btn-sm me-2">
                      View Details
                    </Link>
                  </div>
                ))}

                <div className="d-flex justify-content-between mt-3">
                  <p className="fw-bold mb-0">
                    Total Price: ₹{items.reduce((a, c) => a + (c.price || 0) * (c.quantity || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Return / Exchange Modal */}
      {modalOpen && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 shadow">
              <div className="modal-header">
                <h5 className="modal-title">Return / Exchange</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Reason for return/exchange:</label>
                <select className="form-select mb-3" value={reason} onChange={e => setReason(e.target.value)}>
                  <option value="">Select reason</option>
                  <option value="Ordered by mistake">Ordered by mistake</option>
                  <option value="Found cheaper elsewhere">Found cheaper elsewhere</option>
                  <option value="Product not required anymore">Product not required anymore</option>
                  <option value="Delivery taking too long">Delivery taking too long</option>
                  <option value="Damaged/Defective item">Damaged/Defective item</option>
                  <option value="Other">Other</option>
                </select>
                {reason === "Other" && (
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter your reason"
                    onChange={e => setReason(e.target.value)}
                  ></textarea>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                <button className="btn btn-danger" onClick={confirmAction}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;

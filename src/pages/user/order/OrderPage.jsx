// src/pages/orders/OrderPage.jsx
import React, { useContext, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../components/context/AuthContext";
import { useToast } from "../../../components/context/ToastContext";
import { useUserOrders } from "../../../components/context/UserOrderContext";
import defaultImage from "../../../assets/product-default-image.png";
import usersData from "../../../data/users/users.json";
import addressesData from "../../../data/users/addresses.json";
import "./OrderPage.css";

const OrderPage = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { currentUserOrders = [], setUserOrders } = useUserOrders();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason] = useState("");
  const [actionType, setActionType] = useState("");
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
const [isDownloading, setIsDownloading] = useState(false);


  const orders = [...currentUserOrders].sort((a, b) =>
    (b?.orderId || "").localeCompare(a?.orderId || "")
  );

  useEffect(() => {
    if (modalOpen && selectedOrderId) {
      const order = orders.find((o) => o.orderId === selectedOrderId);
      if (!order) return;

      const eligibleItems =
        actionType === "return"
          ? order.items.filter((i) => i.statusIndex === 3)
          : order.items.filter((i) => i.statusIndex !== -1);

      if (eligibleItems.length === 1) {
        setSelectedItems([eligibleItems[0].orderItemId]);
      }
    }
  }, [modalOpen, selectedOrderId, actionType, orders]);

  if (!user) {
    showToast("Please login first to view orders.", "error");
    navigate("/login-email");
    return null;
  }

  // ================== Cancel / Return Modal Logic ==================
  const openModal = (orderId, type) => {
    setSelectedOrderId(orderId);
    setActionType(type);
    setSelectedItems([]);
    setReason("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrderId(null);
    setSelectedItems([]);
    setReason("");
    setActionType("");
    setModalOpen(false);
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const confirmAction = () => {
    if (!reason.trim()) {
      showToast("Please provide a reason", "error");
      return;
    }
    if (actionType === "return" && selectedItems.length === 0) {
      showToast("Select at least one item to return", "error");
      return;
    }

    const updatedOrders = orders.map((order) => {
      if (order.orderId === selectedOrderId) {
        return {
          ...order,
          items: order.items.map((item) => {
            if (
              actionType === "return" &&
              selectedItems.includes(item.orderItemId)
            ) {
              return {
                ...item,
                statusIndex: 4, // Pickup Scheduled
                action: "return",
                reason,
              };
            }
            if (
              actionType === "cancel" &&
              (selectedItems.includes(item.orderItemId) ||
                selectedItems.length === 0)
            ) {
              return {
                ...item,
                statusIndex: -1, // Cancelled
                action: "cancel",
                reason,
              };
            }
            return item;
          }),
        };
      }
      return order;
    });

    setUserOrders(updatedOrders);
    showToast(
      actionType === "return"
        ? "Return request submitted! Pickup will be scheduled."
        : "Order cancelled successfully!",
      "success"
    );
    closeModal();
  };

  // ================== Invoice Modal Logic ==================
  const openInvoiceModal = (order) => {
    setSelectedInvoiceOrder(order);
    setInvoiceModalOpen(true);
  };

  const closeInvoiceModal = () => {
    setSelectedInvoiceOrder(null);
    setInvoiceModalOpen(false);
  };

  const downloadInvoiceAsImage = async () => {
    try {
      if (!selectedInvoiceOrder) return;

      setIsDownloading(true); // start download

      const invoiceElement = document.getElementById("invoiceCapture");
      if (!invoiceElement) return;

      const width = invoiceElement.scrollWidth;
      const height = invoiceElement.scrollHeight;

      const canvas = await html2canvas(invoiceElement, {
        scale: 3,
        width,
        height,
        backgroundColor: "#ffffff",
        useCORS: true,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      });

      const image = canvas.toDataURL("image/png");

      // Optional: check if image is valid by opening in new tab
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<img src="${image}" alt="Invoice Preview"/>`);
      }

      // Trigger download
      const link = document.createElement("a");
      link.href = image;
      link.download = `Invoice-${selectedInvoiceOrder.orderId}.png`;
      link.click();
    } catch (error) {
      console.error("Failed to generate invoice image:", error);
      showToast("Failed to generate invoice.", "error");
    } finally {
      setIsDownloading(false);
    }
  };



  return (
    <>
      <div className="mx-4 my-4">
        <h2 className="mb-4">My Orders</h2>

        {orders.length === 0 ? (
          <div className="alert alert-info">No orders found.</div>
        ) : (
          orders.map((order) => (
            <div key={order.orderId} className="card shadow-sm mb-4 order-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <span>
                  <strong>Order ID:</strong> {order.orderId}
                </span>
                <span className="badge bg-primary">{order.status}</span>
              </div>

              <div className="card-body">
                {order.items?.map((item) => (
                  <div
                    key={item.orderItemId}
                    className="d-flex align-items-center border-bottom pb-2 mb-2"
                  >
                    <img
                      src={item.image || defaultImage}
                      alt={item.productName}
                      className="img-thumbnail me-3 order-img"
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{item.productName}</h6>
                      <p className="mb-0 text-muted">
                        Qty: {item.quantity} |{" "}
                        {new Intl.NumberFormat(undefined, {
                          style: "currency",
                          currency: order.currency || "INR",
                        }).format((item.price || 0) * (item.quantity || 0))}
                      </p>

                      {item.statusIndex === -1 && (
                        <p className="text-danger mt-1 small">
                          <strong>
                            {item.action === "return"
                              ? "Returned:"
                              : "Cancelled:"}
                          </strong>{" "}
                          {item.reason}
                        </p>
                      )}

                      {item.statusIndex === 4 && (
                        <span className="badge bg-info mt-1">
                          Pickup Scheduled
                        </span>
                      )}
                    </div>

                    <div>
                      <p>
                        {new Date(order.expectedDelivery).toLocaleDateString(
                          "en-GB"
                        )}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="mt-3 d-flex flex-wrap justify-content-start">
                  <button
                    className="btn btn-primary btn-sm me-2 mb-2"
                    onClick={() => openModal(order.orderId, "cancel")}
                    disabled={
                      order.status === "Delivered" || order.status === "Shipped"
                    }
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-danger btn-sm mb-2"
                    onClick={() => openModal(order.orderId, "return")}
                    disabled={order.status !== "Delivered"}
                  >
                    Return
                  </button>

                  <button
                    className="btn btn-outline-success btn-sm ms-2 mb-2"
                    onClick={() => openInvoiceModal(order)}
                  >
                    View / Download Invoice
                  </button>
                </div>

                <div className="d-flex justify-content-between mt-3 flex-wrap">
                  <p className="fw-bold mb-0">
                    Total Price:{" "}
                    {new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: order.currency || "INR",
                    }).format(
                      order.items?.reduce(
                        (a, c) => a + (c.price || 0) * (c.quantity || 0),
                        0
                      )
                    )}
                  </p>

                  <div className="order-actions d-flex justify-content-end mt-3 flex-wrap">
                    <Link
                      to={`/track/${encodeURIComponent(order.orderId)}`}
                      className="btn btn-primary btn-sm me-2 mb-2"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= Cancel / Return Modal ================= */}
      {modalOpen && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 shadow">
              <div className="modal-header">
                <h5 className="modal-title">
                  {actionType === "return" ? "Return Order" : "Cancel Order"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>

              <div className="modal-body">
                {(() => {
                  const order = orders.find(
                    (o) => o.orderId === selectedOrderId
                  );
                  if (!order) return null;

                  const eligibleItems =
                    actionType === "return"
                      ? order.items.filter((i) => i.statusIndex === 3)
                      : order.items.filter((i) => i.statusIndex !== -1);

                  return (
                    <>
                      {eligibleItems.length > 1 ? (
                        <div className="mb-3">
                          <p>
                            {actionType === "return"
                              ? "Select items to return:"
                              : "Select items to cancel:"}
                          </p>
                          {eligibleItems.map((item) => (
                            <div
                              key={item.orderItemId}
                              className="form-check mb-2"
                            >
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedItems.includes(
                                  item.orderItemId
                                )}
                                onChange={() =>
                                  toggleItemSelection(item.orderItemId)
                                }
                                id={`select-${item.orderItemId}`}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`select-${item.orderItemId}`}
                              >
                                {item.productName} –{" "}
                                {new Intl.NumberFormat(undefined, {
                                  style: "currency",
                                  currency: order.currency || "INR",
                                }).format(item.price)}{" "}
                                × {item.quantity}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mb-3">
                          <p>
                            {actionType === "return"
                              ? "You are returning this item:"
                              : "You are cancelling this item:"}
                          </p>
                          {eligibleItems.map((item) => (
                            <div
                              key={item.orderItemId}
                              className="border p-2 rounded bg-light"
                            >
                              <strong>{item.productName}</strong> –{" "}
                              {new Intl.NumberFormat(undefined, {
                                style: "currency",
                                currency: order.currency || "INR",
                              }).format(item.price)}{" "}
                              × {item.quantity}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}

                <label className="form-label">
                  Reason for{" "}
                  {actionType === "return" ? "return" : "cancellation"}:
                </label>
                <select
                  className="form-select mb-3 w-50"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">Select reason</option>
                  <option value="Ordered by mistake">Ordered by mistake</option>
                  <option value="Found cheaper elsewhere">
                    Found cheaper elsewhere
                  </option>
                  <option value="Product not required anymore">
                    Product not required anymore
                  </option>
                  <option value="Delivery taking too long">
                    Delivery taking too long
                  </option>
                  <option value="Damaged/Defective item">
                    Damaged/Defective item
                  </option>
                  <option value="Other">Other</option>
                </select>
                {reason === "Other" && (
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter your reason"
                    onChange={(e) => setReason(e.target.value)}
                  ></textarea>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button className="btn btn-danger" onClick={confirmAction}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= Invoice Modal ================= */}
      {invoiceModalOpen && selectedInvoiceOrder && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div
              className="modal-content p-3"
              style={{ maxWidth: "100%", overflowX: "auto" }}
            >
              <div className="modal-header">
                <h5 className="modal-title text-primary fw-bold">
                  Invoice Preview
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeInvoiceModal}
                ></button>
              </div>

              <div
                className="modal-body p-4"
                id="invoiceCapture"
                style={{ width: "100%", fontSize: "14px" }}
              >
                {/* Logo */}
                <div className="text-center mb-3">
                  <h3 className="text-primary fw-bold">Shopizen</h3>
                  <p className="text-muted mb-1">Your Smart Shopping Partner</p>
                </div>
                <hr />

                {/* Customer & Order Details */}
                {(() => {
                  const userData = usersData.find(
                    (u) => String(u.id) === String(selectedInvoiceOrder.userId)
                  );
                  const address = addressesData.find(
                    (a) =>
                      String(a.addressId) ===
                      String(selectedInvoiceOrder.addressId)
                  );

                  return (
                    <div className="row mb-3">
                      <div className="col-12 col-md-6 mb-2">
                        <p>
                          <strong>Invoice ID:</strong>{" "}
                          {selectedInvoiceOrder.orderId}
                        </p>
                        <p>
                          <strong>Order Date:</strong>{" "}
                          {new Date(
                            selectedInvoiceOrder.orderDate
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Customer:</strong> {userData?.name || "N/A"}
                        </p>
                        <p>
                          <strong>Email:</strong> {userData?.email || "N/A"}
                        </p>
                      </div>
                      <div className="col-12 col-md-6 mb-2">
                        <p>
                          <strong>Delivery Address:</strong>
                        </p>
                        <p>
                          {address
                            ? `${address.street}, ${address.city}, ${address.state}, ${address.zipcode}`
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                <hr />

                {/* Items Table */}
                <h6 className="fw-bold text-primary mb-2">Items</h6>
                <div className="table-responsive">
                  <table
                    className="table table-bordered"
                    style={{ minWidth: "600px" }}
                  >
                    <thead className="table-primary">
                      <tr>
                        <th>Order ID</th>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoiceOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.productName}</td>
                          <td>{item.quantity}</td>
                          <td>
                            {new Intl.NumberFormat(undefined, {
                              style: "currency",
                              currency: selectedInvoiceOrder.currency || "INR",
                            }).format(item.price)}
                          </td>
                          <td>
                            {new Intl.NumberFormat(undefined, {
                              style: "currency",
                              currency: selectedInvoiceOrder.currency || "INR",
                            }).format(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total Amount */}
                <h5 className="text-end text-success mt-3">
                  Total:{" "}
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: selectedInvoiceOrder.currency || "INR",
                  }).format(selectedInvoiceOrder.amount)}
                </h5>

                <p className="text-center text-muted mt-4 mb-0">
                  Thank you for shopping with Shopizen!
                </p>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={closeInvoiceModal}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={downloadInvoiceAsImage}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Downloading...
                    </>
                  ) : (
                    "Download Invoice"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderPage;

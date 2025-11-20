import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../../components/context/DataContext";
import { useDarkMode } from "../../../components/context/DarkModeContext"; // ✅ dark mode
import "./OrderDetails.css";

const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export default function OrderDetails() {
  const { id } = useParams();
  const { orders } = useData();
  const navigate = useNavigate();
  const { theme } = useDarkMode(); // ✅ get current theme

  const order = orders.find((o) => String(o.id) === String(id));

  if (!order)
    return (
      <div className={`container mt-5 ${theme === "dark" ? "text-light" : ""}`}>
        <div className="alert alert-warning">
          Order not found.
          <button
            onClick={() => navigate(-1)}
            className="btn btn-link ms-2 p-0"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const symbol = currencySymbols[order.currency] || order.currency;

  return (
    <div
      className={`container my-5 order-details ${
        theme === "dark" ? "dark" : "light"
      }`}
    >
      <div
        className={`card shadow-sm border-0 ${
          theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"
        }`}
      >
        <div className="card-header py-3 px-4 d-flex justify-content-between align-items-center">
          <h2 className="fw-bold mb-3 mb-md-0">Order #{order.orderId}</h2>
          <button
            className={`btn btn-outline-${
              theme === "dark" ? "light" : "secondary"
            } btn-sm`}
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        <div className="card-body">
          {/* Customer & Order Info */}
          <div className="row mb-4">
            <div className="col-md-4">
              <h6 className="">Customer</h6>
              <p>{order.customer}</p>
            </div>
            <div className="col-md-4">
              <h6 className="">Order Date</h6>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="col-md-4">
              <h6 className="">Status</h6>
              <span className={`badge ${getStatusBadge(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="table-responsive mb-4">
            <table
              className={`table table-bordered align-middle mb-0 ${
                theme === "dark" ? "table-dark" : ""
              }`}
            >
              <thead
                className={
                  theme === "dark" ? "table-secondary text-dark" : "table-light"
                }
              >
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((it, i) => (
                  <tr key={i}>
                    <td>{it.name}</td>
                    <td>{it.qty}</td>
                    <td>
                      {symbol}
                      {it.price}
                    </td>
                    <td>
                      {symbol}
                      {it.qty * it.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="d-flex justify-content-end">
            <h5>
              Total:{" "}
              <span className="text-success">
                {symbol}
                {order.total}
              </span>
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper for status badge color
function getStatusBadge(status) {
  switch (status) {
    case "Pending":
      return "bg-warning text-dark";
    case "Processing":
      return "bg-info text-dark";
    case "Shipped":
      return "bg-primary";
    case "Delivered":
      return "bg-success";
    case "Cancelled":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
}

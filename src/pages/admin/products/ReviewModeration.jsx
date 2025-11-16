import React, { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2"; // ✅ import SweetAlert2
import Table from "../../../components/admin/Table";
import reviewsData from "../../../data/products/reviews.json";
import productsData from "../../../data/products/products.json";

export default function ReviewModeration() {
  const [reviews, setReviews] = useState([]);
  const [filters, setFilters] = useState({
    product: "All",
    status: "All",
    rating: "All",
  });

  useEffect(() => {
    const reviewsWithProductName = reviewsData.map((r) => {
      const product = productsData.find((p) => p.id === r.productId);
      return {
        ...r,
        productName: product ? product.name : r.productId,
      };
    });
    setReviews(reviewsWithProductName);
  }, []);

  const productOptions = useMemo(
    () => ["All", ...new Set(productsData.map((p) => p.name))],
    []
  );
  const statusOptions = useMemo(
    () => ["All", ...new Set(reviewsData.map((r) => r.status))],
    []
  );
  const ratingOptions = useMemo(
    () => [
      "All",
      ...new Set(reviewsData.map((r) => r.rating).sort((a, b) => a - b)),
    ],
    []
  );

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchProduct =
        filters.product === "All" || r.productName === filters.product;
      const matchStatus =
        filters.status === "All" || r.status === filters.status;
      const matchRating =
        filters.rating === "All" || r.rating === Number(filters.rating);
      return matchProduct && matchStatus && matchRating;
    });
  }, [reviews, filters]);

  const updateStatus = (id, newStatus) => {
    setReviews(
      reviews.map((r) => (r.reviewId === id ? { ...r, status: newStatus } : r))
    );
  };

  // ✅ SweetAlert2 Delete
  const deleteReview = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This review will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setReviews(reviews.filter((r) => r.reviewId !== id));
      Swal.fire({
        title: "Deleted!",
        text: "The review has been removed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const columns = [
    { key: "reviewId", title: "ID" },
    { key: "name", title: "User" },
    { key: "productName", title: "Product" },
    { key: "rating", title: "Rating" },
    { key: "text", title: "Review" },
    { key: "status", title: "Status" },
    {
      key: "actions",
      title: "Actions",
      render: (r) => (
        <div className="d-flex gap-2">
          {r.status !== "approved" && (
            <button
              className="btn btn-success btn-sm"
              onClick={() => updateStatus(r.reviewId, "approved")}
            >
              Approve
            </button>
          )}
          {r.status !== "rejected" && (
            <button
              className="btn btn-warning btn-sm"
              onClick={() => updateStatus(r.reviewId, "rejected")}
            >
              Reject
            </button>
          )}
          <button
            className="btn btn-danger btn-sm"
            onClick={() => deleteReview(r.reviewId)} // ✅ updated here
          >
            <i className="bi bi-trash-fill"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="review-page-wrapper p-3">
      <h2 className="mb-3 text-center">Review Moderation</h2>

      {/* Filter Controls */}
      <div className="d-flex flex-wrap gap-3 mb-4 justify-content-center">
        <select
          className="form-select w-auto"
          value={filters.product}
          onChange={(e) => setFilters({ ...filters, product: e.target.value })}
        >
          {productOptions.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <select
          className="form-select w-auto"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          {statusOptions.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          className="form-select w-auto"
          value={filters.rating}
          onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
        >
          {ratingOptions.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>

        <button
          className="btn btn-outline-secondary"
          onClick={() =>
            setFilters({ product: "All", status: "All", rating: "All" })
          }
        >
          Reset
        </button>
      </div>

      <Table columns={columns} data={filteredReviews} pageSize={15} />
    </div>
  );
}

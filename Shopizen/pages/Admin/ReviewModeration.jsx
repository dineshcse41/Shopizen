import React, { useState } from "react";
import Table from "../../components/admin/Table";
import reviewsData from "../../data/reviews.json";

export default function ReviewModeration() {
    const [reviews, setReviews] = useState(reviewsData);

    const updateStatus = (id, newStatus) => {
        setReviews(
            reviews.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
    };

    const deleteReview = (id) => {
        if (window.confirm("Delete this review?")) {
            setReviews(reviews.filter((r) => r.id !== id));
        }
    };

    const columns = [
        { key: "id", title: "ID" },
        { key: "user", title: "User" },
        { key: "product", title: "Product" },
        { key: "review", title: "Review" },
        { key: "status", title: "Status" },
        {
            key: "actions",
            title: "Actions",
            render: (r) => (
                <div className="flex gap-2">
                    {r.status !== "approved" && (
                        <button
                            className="btn btn-success btn-sm"
                            onClick={() => updateStatus(r.id, "approved")}
                        >
                            Approve
                        </button>
                    )}
                    {r.status !== "rejected" && (
                        <button
                            className="btn btn-warning btn-sm"
                            onClick={() => updateStatus(r.id, "rejected")}
                        >
                            Reject
                        </button>
                    )}
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteReview(r.id)}
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="m-3">
                <h2 className="page-title mb-3 text-center">Review Moderation</h2>
                <Table columns={columns} data={reviews} />
            </div>
        </>
    );
}

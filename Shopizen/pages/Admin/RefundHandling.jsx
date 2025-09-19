import React, { useState } from "react";
import Table from "../../components/admin/Table";
import refundsData from "../../data/refunds.json";

export default function RefundHandling() {
    const [refunds, setRefunds] = useState(refundsData);

    const updateStatus = (id, newStatus) => {
        setRefunds(
            refunds.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
    };

    const columns = [
        { key: "id", title: "ID" },
        { key: "orderId", title: "Order ID" },
        { key: "user", title: "User" },
        { key: "amount", title: "Amount" },
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
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="m-3">
                <h2 className="page-title mb-3 text-center">Refund Handling</h2>
                <Table columns={columns} data={refunds} />
            </div>
        </>
    );
}

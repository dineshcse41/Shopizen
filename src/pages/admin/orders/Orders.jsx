import React from "react";
import Table from "../../../components/admin/Table";
import { useData } from "../../../components/context/DataContext";
import { Link } from "react-router-dom";

export default function OrdersPage() {
    const { orders, updateOrderStatus } = useData();

    const cols = [
        { key: "id", title: "Order #" },
        { key: "customer", title: "Customer" },
        { key: "createdAt", title: "Date" },
        { key: "total", title: "Total", render: r => `₹${r.total}` },
        { key: "status", title: "Status", render: r => r.status },
        {
            key: "actions", title: "Actions", render: r => (
                <div className="flex gap-2 items-center">
                    <Link to={`/admin/order/${r.id}`} className="px-2 py-1 bg-gray-200 rounded text-xs">View</Link>
                    <select value={r.status} onChange={(e) => updateOrderStatus(r.id, e.target.value)} className="p-1 border text-xs">
                        {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            )
        }
    ];

    return (
        <>
            <h2 className="text-xl font-semibold mb-4">Orders</h2>
            <Table columns={cols} data={orders} />
        </>
    );
}

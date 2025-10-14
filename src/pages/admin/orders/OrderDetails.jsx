import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../../components/context/DataContext";

export default function OrderDetails() {
    const { id } = useParams();
    const { orders } = useData();
    const navigate = useNavigate();
    const order = orders.find(o => String(o.id) === String(id));

    if (!order) return <Layout><div>Order not found <button onClick={() => navigate(-1)} className="ml-2 text-blue-600">Back</button></div></Layout>;

    return (
        <>
            <h2 className="text-xl font-semibold mb-4">Order #{order.id}</h2>
            <div className="bg-white p-4 rounded shadow">
                <div><strong>Customer:</strong> {order.customer}</div>
                <div><strong>Date:</strong> {order.createdAt}</div>
                <div><strong>Status:</strong> {order.status}</div>
                <div className="mt-3">
                    <strong>Items</strong>
                    <ul className="pl-4 list-disc">
                        {order.items.map((it, i) => <li key={i}>{it.name} × {it.qty} — ₹{it.price}</li>)}
                    </ul>
                </div>
                <div className="mt-3"><strong>Total:</strong> ₹{order.total}</div>
            </div>
        </>
    );
}

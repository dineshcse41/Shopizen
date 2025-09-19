import React, { useMemo, useState } from "react";
import Table from "../../components/admin/Table";
import { useData } from "../../components/context/DataContext";
import { Link } from "react-router-dom";
import './ProductsPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ProductsPage() {
    const { products, deleteProduct } = useData();
    const [q, setQ] = useState("");
    const [sortKey, setSortKey] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 5; // number of rows per page

    // Filter
    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return products;
        return products.filter(
            p =>
                (p.name || "").toLowerCase().includes(term) ||
                (p.brand || "").toLowerCase().includes(term)
        );
    }, [products, q]);

    // Sort
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            let valA = a[sortKey];
            let valB = b[sortKey];

            if (typeof valA === "string") valA = valA.toLowerCase();
            if (typeof valB === "string") valB = valB.toLowerCase();

            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [filtered, sortKey, sortOrder]);

    // Pagination
    const totalPages = Math.ceil(sorted.length / pageSize);
    const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Columns
    const cols = [
        { key: "id", title: "ID" },
        { key: "name", title: "Name" },
        { key: "brand", title: "Brand" },
        { key: "category", title: "Category" },
        { key: "price", title: "Price", render: r => `₹${r.price}` },
        { key: "stock", title: "Stock" },
        {
            key: "actions", title: "Actions", render: r => (
                <div className="d-flex gap-2">
                    <Link
                        to={`/admin/edit-product/${r.id}`}
                        className="btn btn-sm btn-warning"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => {
                            if (window.confirm("Delete product?")) deleteProduct(r.id);
                        }}
                        className="btn btn-sm btn-danger"
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ];

    return (
        <>
            <div className="text-center mb-4">
                <h2 className="page-title">Product Management</h2>
                <Link to="/admin/add-product" className="btn btn-primary mt-2">
                    ➕ Add Product
                </Link>
            </div>

            <div className="mb-3 d-flex justify-content-center">
                <input
                    className="form-control w-50 shadow-sm"
                    placeholder="🔍 Search by name or brand"
                    value={q}
                    onChange={e => { setQ(e.target.value); setCurrentPage(1); }}
                />
            </div>

            <div className="table-responsive shadow rounded bg-white p-3">
                <Table
                    columns={cols}
                    data={paginated}
                    sortKey={sortKey}
                    sortOrder={sortOrder}
                    onSort={(key) => {
                        if (sortKey === key) {
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                            setSortKey(key);
                            setSortOrder("asc");
                        }
                    }}
                />
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-3">
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>
                                ◀ Prev
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>
                                Next ▶
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}

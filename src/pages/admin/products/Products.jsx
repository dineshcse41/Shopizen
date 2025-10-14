// src/pages/admin/ProductsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Table from "../../../components/admin/Table";
import "./Products.css";

// Dummy JSON (for development mode)
import productsData from "../../../data/products/products.json";

export default function ProductsPage() {
    const [products, setProducts] = useState(productsData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [brandFilter, setBrandFilter] = useState("All");
    const [sortKey, setSortKey] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);


    const pageSize = 15;
    const useAPI = false; // 🔄 change this to true when backend API is ready

    // ========================
    // Fetch Data (API or Dummy)
    // ========================
    useEffect(() => {
        const fetchProducts = async () => {
            if (!useAPI) return; // Skip API call when using dummy data
            try {
                setLoading(true);
                const res = await axios.get("http://127.0.0.1:5000/api/products/");
                setProducts(res.data);
                setError(null);
            } catch (err) {
                setError("Failed to fetch products. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [useAPI]);

    // ========================
    // Derived Data
    // ========================
    const categories = useMemo(
        () => ["All", ...new Set(products.map(p => p.category))],
        [products]
    );
    const brands = useMemo(
        () => ["All", ...new Set(products.map(p => p.brand))],
        [products]
    );

    const filteredData = useMemo(() => {
        return products.filter(p => {
            const matchesSearch =
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory =
                categoryFilter === "All" || p.category === categoryFilter;
            const matchesBrand = brandFilter === "All" || p.brand === brandFilter;
            return matchesSearch && matchesCategory && matchesBrand;
        });
    }, [products, searchTerm, categoryFilter, brandFilter]);

    const sortedData = useMemo(() => {
        return [...filteredData].sort((a, b) => {
            let valA = a[sortKey];
            let valB = b[sortKey];
            if (typeof valA === "string") valA = valA.toLowerCase();
            if (typeof valB === "string") valB = valB.toLowerCase();
            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortKey, sortOrder]);

    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // ========================
    // Handlers
    // ========================
    const handleSort = key => {
        if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const confirmDelete = id => {
        setProductToDelete(id);
        setShowDeleteModal(true);
    };

    const deleteProduct = async () => {
        if (!productToDelete) return;

        try {
            if (useAPI) {
                await axios.delete(`http://127.0.0.1:5000/api/products/${productToDelete}/`);
            }
            setProducts(prev => prev.filter(p => p.id !== productToDelete));
            setProductToDelete(null);
            setShowDeleteModal(false);
        } catch (err) {
            alert("Failed to delete product. Please try again.");
        }
    };

    const cancelDelete = () => {
        setProductToDelete(null);
        setShowDeleteModal(false);
    };


    // ========================
    // UI States
    // ========================
    if (loading) return <p className="text-center">Loading products...</p>;
    if (error) return <p className="text-center text-danger">{error}</p>;
    if (!products.length)
        return (
            <p className="text-center text-muted mt-4">
                No products found. Please add some!
            </p>
        );

    // ========================
    // Columns for Table
    // ========================
    const columns = [
        { key: "id", title: "ID" },
        { key: "name", title: "Name" },
        { key: "brand", title: "Brand" },
        { key: "category", title: "Category" },
        { key: "price", title: "Price", render: r => `₹${r.price}` },
        { key: "stock", title: "Stock" },
        {
            key: "actions",
            title: "Actions",
            render: r => (
                <div className="d-flex gap-2">
                    <Link
                        to={`/admin/products/view/${r.id}`}
                        state={{ product: r }} // ✅ Pass product data to view page
                        className="btn btn-sm btn-info"
                    >
                        View
                    </Link>

                    <Link
                        to={`/admin/products/edit/${r.id}`}
                        state={{ product: r }} // ✅ Pass product data
                        className="btn btn-sm btn-warning"
                    >
                        Edit
                    </Link>



                    <button
                        onClick={() => confirmDelete(r.id)}
                        className="btn btn-sm btn-danger"
                    >
                        Delete
                    </button>

                </div>
            )
        }
    ];

    return (
        <div className="products-page">
            <div className="header text-center mb-4">
                <h2 className="page-title"> Product Management</h2>
                <Link to="/admin/products/add" className="btn btn-primary mt-2">
                    Add Product
                </Link>

            </div>

            {/* Filters */}
            <div className="filters ">

                <div className="d-flex justify-content-between">
                    <input
                        className="form-control shadow-sm w-75"
                        placeholder="Search by name or brand"
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <select
                        className="form-select shadow-sm ms-2 w-50"
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                    >
                        {categories.map(c => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                    <select
                        className="form-select shadow-sm ms-2 w-50 "
                        value={brandFilter}
                        onChange={e => setBrandFilter(e.target.value)}
                    >
                        {brands.map(b => (
                            <option key={b} value={b}>
                                {b}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="table-responsive shadow rounded p-3">
                <Table
                    columns={columns}
                    data={paginatedData}
                    sortKey={sortKey}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                    <nav>
                        <ul className="pagination">
                            <li
                                className={`page-item ${currentPage === 1 ? "disabled" : ""
                                    }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() =>
                                        setCurrentPage(p => Math.max(p - 1, 1))
                                    }
                                >
                                    ◀ Prev
                                </button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li
                                    key={i}
                                    className={`page-item ${currentPage === i + 1 ? "active" : ""
                                        }`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            <li
                                className={`page-item ${currentPage === totalPages ? "disabled" : ""
                                    }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() =>
                                        setCurrentPage(p =>
                                            Math.min(p + 1, totalPages)
                                        )
                                    }
                                >
                                    Next ▶
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}

            {/* ======================== */}
            {/* Delete Confirmation Modal */}
            {/* ======================== */}
            {showDeleteModal && (
                <div className="modal-backdrop">
                    <div className="modal-center">
                        <h5>Are you sure you want to delete this product?</h5>
                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button className="btn btn-secondary" onClick={cancelDelete}>
                                Cancel
                            </button>
                            <button className="btn btn-danger" onClick={deleteProduct}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

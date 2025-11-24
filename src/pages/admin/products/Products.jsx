// src/pages/admin/ProductsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import Table from "../../../components/admin/Table";
import "./Products.css";
import productsData from "../../../data/products/products.json";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [brandFilter, setBrandFilter] = useState("All");
  const [sortKey, setSortKey] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const useAPI = false; // 🔄 set true when backend ready

  // ========================
  // Fetch Data (API or Dummy)
  // ========================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        if (useAPI) {
          const res = await axios.get("http://127.0.0.1:5000/api/products/");
          setProducts(res.data);
        } else {
          setProducts(productsData);
        }
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
    () => ["All", ...new Set(products.map((p) => p.category))],
    [products]
  );

  const brands = useMemo(
    () => ["All", ...new Set(products.map((p) => p.brand))],
    [products]
  );

  const filteredData = useMemo(() => {
    return products.filter((p) => {
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

  // ========================
  // Delete with SweetAlert2
  // ========================

   const handleSort = (key) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };


  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        if (useAPI) {
          await axios.delete(`http://127.0.0.1:5000/api/products/${id}/`);
        }
        setProducts((prev) => prev.filter((p) => p.id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "The product has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete product. Please try again.",
          icon: "error",
        });
      }
    }
  };

  // ✅ Reset Filters Function
  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All");
    setBrandFilter("All");
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
    { key: "price", title: "Price", render: (r) => `₹${r.price}` },
    { key: "stock", title: "Stock" },
    {
      key: "actions",
      title: "Actions",
      render: (r) => (
        <div className="d-flex gap-2">
          <Link
            to={`/admin/products/view/${r.id}`}
            state={{ product: r }}
            className="btn btn-sm btn-info"
          >
            <i className="bi bi-eye-fill"></i>
          </Link>

          <Link
            to={`/admin/products/edit/${r.id}`}
            state={{ product: r }}
            className="btn btn-sm btn-warning"
          >
            <i className="bi bi-pen-fill"></i>
          </Link>

          <button
            onClick={() => handleDelete(r.id)}
            className="btn btn-sm btn-danger"
          >
            <i className="bi bi-trash-fill"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="products-page p-4">
      <div className="header text-center mb-4">
        <h2 className="fw-bold mb-3 mb-md-0">Product Management</h2>
        <Link to="/admin/products/add" className="btn btn-primary mt-2">
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="filters mb-4">
        <div className="d-flex flex-wrap justify-content-between gap-2">
          <input
            className="form-control shadow-sm flex-grow-1 w-25"
            placeholder="Search by name or brand"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select shadow-sm w-auto"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="form-select shadow-sm w-auto"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* ✅ Reset Button */}
          <button
            className="btn btn-outline-secondary shadow-sm"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive shadow rounded p-3">
        <Table
          columns={columns}
          data={sortedData}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={handleSort}
          pageSize={15}
        />
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import Table from "../../../components/admin/Table";
import Modal from "../../../components/admin/Modal";
import brandsData from "../../../data/products/brands.json"; // ✅ Local dummy data
import "./BrandsPage.css";

export default function BrandsPage() {
    const [brands, setBrands] = useState(brandsData);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalData, setModalData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    /* ----------------------------------------------------------------
       🔄 BACKEND API CONNECTION (DJANGO + POSTGRESQL)
       Uncomment this useEffect and replace the API URLs accordingly
    -------------------------------------------------------------------
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/brands/")   // Example Django REST endpoint
            .then((res) => res.json())
            .then((data) => setBrands(data))
            .catch((err) => console.error("Error fetching brands:", err));
    }, []);
    ------------------------------------------------------------------- */

    // ---------------------- DELETE HANDLER ----------------------
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this brand?")) {
            setBrands(brands.filter((brand) => brand.id !== id));

            /* --- API DELETE EXAMPLE (uncomment for backend) ---
            fetch(`http://127.0.0.1:8000/api/brands/${id}/`, {
                method: "DELETE",
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to delete brand");
                })
                .catch((err) => console.error(err));
            ---------------------------------------------------- */
        }
    };

    // ---------------------- ADD / EDIT HANDLER ----------------------
    const handleAddEdit = (data) => {
        if (data.id) {
            // Edit existing brand
            setBrands(brands.map((b) => (b.id === data.id ? data : b)));

            /* --- API PUT EXAMPLE ---
            fetch(`http://127.0.0.1:8000/api/brands/${data.id}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
                .then((res) => res.json())
                .then((updated) => {
                    setBrands(brands.map((b) => (b.id === updated.id ? updated : b)));
                })
                .catch((err) => console.error(err));
            ------------------------- */
        } else {
            // Add new brand (dummy mode)
            const newData = { ...data, id: `brand_${Date.now()}` };
            setBrands([...brands, newData]);

            /* --- API POST EXAMPLE ---
            fetch("http://127.0.0.1:8000/api/brands/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
                .then((res) => res.json())
                .then((newBrand) => setBrands([...brands, newBrand]))
                .catch((err) => console.error(err));
            -------------------------- */
        }
        setIsModalOpen(false);
    };

    // ---------------------- SEARCH FILTER ----------------------
    const filteredBrands = brands.filter((b) =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ---------------------- TABLE COLUMNS ----------------------
    const columns = [
        { key: "id", title: "ID" },
        { key: "name", title: "Brand Name" },
        { key: "logo", title: "Logo URL" },
        {
            key: "actions",
            title: "Actions",
            render: (row) => (
                <div className="d-flex gap-2 justify-content-center">
                    <button
                        className="btn btn-sm btn-warning"
                        onClick={() => {
                            setModalData(row);
                            setIsModalOpen(true);
                        }}
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(row.id)}
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    // ---------------------- PAGE RENDER ----------------------
    return (
        <div className="brands-page py-4">
            <div className="card shadow-sm p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-primary mb-3 mb-md-0">Brand Management</h2>
                    <div className="d-flex gap-3 flex-wrap">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search brands..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "220px" }}
                        />
                        <button
                            className="btn btn-success"
                            onClick={() => {
                                setModalData(null);
                                setIsModalOpen(true);
                            }}
                        >
                            + Add Brand
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <Table data={filteredBrands} columns={columns} />
                </div>
            </div>

            {isModalOpen && (
                <Modal
                    title={modalData ? "Edit Brand" : "Add Brand"}
                    data={modalData}
                    fields={["name", "logo"]}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddEdit}
                />
            )}
        </div>
    );
}

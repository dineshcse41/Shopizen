// src/pages/admin/CategoriesPage.jsx
import React, { useState, useEffect } from "react";
import Table from "../../../components/admin/Table";
import Modal from "../../../components/admin/Modal";
import categoriesData from "../../../data/products/categories.json";
import "./CategoriesPage.css";

export default function CategoriesPage() {
    const [categories, setCategories] = useState(categoriesData);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalData, setModalData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch from API (currently commented)
    /*
    useEffect(() => {
        fetch("/api/categories/")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));
    }, []);
    */

    const handleDelete = (id) => {
        if (window.confirm("Are you sure to delete this category?")) {
            setCategories(categories.filter(cat => cat.id !== id));
        }
    };

    const handleAddEdit = (data) => {
        if (data.id) {
            setCategories(categories.map(cat => (cat.id === data.id ? data : cat)));
        } else {
            const newData = { ...data, id: `C${Date.now()}` };
            setCategories([...categories, newData]);
        }
        setIsModalOpen(false);
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { key: "id", title: "ID" },
        { key: "name", title: "Name" },
        { key: "description", title: "Description" },
        {
            key: "actions",
            title: "Actions",
            render: (row) => (
                <div className="d-flex gap-2 justify-content-center">
                    <button className="btn btn-sm btn-warning" onClick={() => { setModalData(row); setIsModalOpen(true); }}>
                        Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(row.id)}>
                        Delete
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className=" py-4 categories-page">
            <div className="card shadow-sm p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-primary mb-3 mb-md-0">Category Management</h2>
                    <div className="d-flex gap-3 flex-wrap">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ width: "220px" }}
                        />
                        <button
                            className="btn btn-success"
                            onClick={() => { setModalData(null); setIsModalOpen(true); }}
                        >
                            + Add Category
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <Table data={filteredCategories} columns={columns} />
                </div>
            </div>

            {isModalOpen && (
                <Modal
                    title={modalData ? "Edit Category" : "Add Category"}
                    data={modalData}
                    fields={["name", "description"]}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddEdit}
                />
            )}
        </div>
    );
}

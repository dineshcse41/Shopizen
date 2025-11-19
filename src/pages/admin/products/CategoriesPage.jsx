// src/pages/admin/CategoriesPage.jsx
import React, { useState, useMemo } from "react";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import Table from "../../../components/admin/Table";
import Modal from "../../../components/admin/Modal";
import categoriesData from "../../../data/products/categories.json";
import "./CategoriesPage.css";

export default function CategoriesPage() {
  const [categories, setCategories] = useState(categoriesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Handle add/edit ---
  const handleAddEdit = (data) => {
    if (data.id) {
      setCategories(categories.map((cat) => (cat.id === data.id ? data : cat)));
    } else {
      const newData = { ...data, id: `C${Date.now()}` };
      setCategories([...categories, newData]);
    }
    setIsModalOpen(false);
  };

  // --- Handle delete with SweetAlert2 confirmation ---
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This category will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setCategories(categories.filter((cat) => cat.id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "The category has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // --- Filtered categories ---
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [categories, searchTerm]);

  // --- Table columns ---
  const columns = [
    { key: "id", title: "ID" },
    { key: "name", title: "Name" },
    { key: "description", title: "Description" },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="d-flex gap-2">
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

  return (
    <div className="p-4">
      <h2 className="fw-bold mb-3 mb-md-0">Category Management</h2>

      {/* --- Filter bar --- */}
      <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <input
          type="text"
          placeholder="Search categories..."
          className="form-control"
          style={{ width: "220px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          className="btn btn-success"
          onClick={() => {
            setModalData(null);
            setIsModalOpen(true);
          }}
        >
          + Add Category
        </button>
      </div>

      {/* --- Table --- */}
      <Table columns={columns} data={filteredCategories} pageSize={15} />

      {/* --- Modal --- */}
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

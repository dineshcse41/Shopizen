// src/pages/admin/BrandsPage.jsx
import React, { useState, useMemo } from "react";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import Table from "../../../components/admin/Table";
import Modal from "../../../components/admin/Modal";
import brandsData from "../../../data/products/brands.json";
import "./BrandsPage.css";

export default function BrandsPage() {
  const [brands, setBrands] = useState(brandsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ---------------------- ADD / EDIT ----------------------
  const handleAddEdit = (data) => {
    const updatedData = { ...data };
    if (data.logo instanceof File) {
      updatedData.logo = URL.createObjectURL(data.logo);
    }
    if (data.id) {
      setBrands(brands.map((b) => (b.id === data.id ? updatedData : b)));
    } else {
      const newData = { ...updatedData, id: `brand_${Date.now()}` };
      setBrands([...brands, newData]);
    }
    setIsModalOpen(false);
  };

  // ---------------------- DELETE (SweetAlert2) ----------------------
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This brand will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setBrands(brands.filter((b) => b.id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "The brand has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // ---------------------- FILTERED DATA ----------------------
  const filteredBrands = useMemo(() => {
    return brands.filter((b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [brands, searchTerm]);

  // ---------------------- TABLE COLUMNS ----------------------
  const columns = [
    { key: "id", title: "ID" },
    { key: "name", title: "Brand Name" },
    {
      key: "logo",
      title: "Logo",
      render: (row) =>
        row.logo ? (
          <img
            src={row.logo}
            alt={row.name}
            style={{ height: "40px", objectFit: "contain" }}
          />
        ) : (
          <span>No Logo</span>
        ),
    },
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

  // ---------------------- RENDER ----------------------
  return (
    <div className="p-4">
      <h2 className="fw-bold mb-3 mb-md-0">Brand Management</h2>

      {/* --- Filter/Search Bar --- */}
      <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <input
          type="text"
          placeholder="Search brands..."
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
          + Add Brand
        </button>
      </div>

      {/* --- Table --- */}
      <Table columns={columns} data={filteredBrands} pageSize={15} />

      {/* --- Modal --- */}
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

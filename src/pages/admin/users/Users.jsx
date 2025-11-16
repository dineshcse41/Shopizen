import React, { useState } from "react";
import Swal from "sweetalert2"; // ✅ import SweetAlert2
import usersData from "../../../data/users/users.json";
import Table from "../../../components/admin/Table";

export default function UserManagement() {
  const [users, setUsers] = useState(usersData);
  const [search, setSearch] = useState("");

  const toggleStatus = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "blocked" : "active" }
          : u
      )
    );
  };

  // ✅ SweetAlert2 Delete
  const deleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete!",
    });

    if (result.isConfirmed) {
      setUsers(users.filter((u) => u.id !== id));
      Swal.fire({
        title: "Deleted!",
        text: "The user has been removed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const normalizeNumber = (num) => {
    return num.replace(/[\s\-()]/g, "").replace(/^(\+?\d{1,3})/, "");
  };

  const filteredUsers = users.filter((u) => {
    const searchTerm = search.toLowerCase().replace(/[\s\-()]/g, "");
    return (
      u.name.toLowerCase().includes(searchTerm) ||
      u.email.toLowerCase().includes(searchTerm) ||
      normalizeNumber(u.mobile).includes(searchTerm)
    );
  });

  const columns = [
    { key: "id", title: "ID" },
    { key: "name", title: "Name" },
    { key: "email", title: "Email" },
    { key: "mobile", title: "Phone" },
    { key: "status", title: "Status" },
    {
      key: "actions",
      title: "Action",
      render: (u) => (
        <div className="d-flex gap-2">
          <button
            className={`btn btn-${
              u.status === "active" ? "danger" : "success"
            }`}
            onClick={() => toggleStatus(u.id)}
          >
            {u.status === "active" ? "Block" : "Unblock"}
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={() => deleteUser(u.id)} // ✅ updated here
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="m-3">
      <div className="text-center mb-4">
        <h2 className="page-title">User Management</h2>
      </div>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name, email, or mobile"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table columns={columns} data={filteredUsers} pageSize={15} />
    </div>
  );
}

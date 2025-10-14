import React, { useState } from "react";
import usersData from "../../../data/users/users.json";
import Table from "../../../components/admin/Table"; // import your reusable Table

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

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    // Define columns for the Table component
    const columns = [
        { key: "id", title: "ID" },
        { key: "name", title: "Name" },
        { key: "email", title: "Email" },
        { key: "status", title: "Status" },
        {
            key: "actions",
            title: "Action",
            render: (u) => (
                <button
                    className={`btn btn-${u.status === "active" ? "danger" : "success"}`}
                    onClick={() => toggleStatus(u.id)}
                >
                    {u.status === "active" ? "Block" : "Unblock"}
                </button>
            ),
        },
    ];

    return (
        <>
            <div className="m-3">
                <div className="text-center mb-4">
                    <h2 className="page-title">User Management</h2>
                </div>

                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search by name or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Use the reusable Table component */}
                <Table columns={columns} data={filteredUsers} />
            </div>
        </>
    );
}

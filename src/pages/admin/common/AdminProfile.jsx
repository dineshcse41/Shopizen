// src/pages/admin/AdminProfile.jsx
import React, { useState, useEffect } from "react";
import { useDarkMode } from "../../../components/context/DarkModeContext";
import { useAuth } from "../../../components/context/AuthContext"; // updated hook
import adminData from "../../../data/admin/admin.json"; // your admin JSON
import "./AdminProfile.css";

export default function AdminProfile() {
  const { theme } = useDarkMode();
  const { user: loggedInAdmin } = useAuth(); // get logged-in admin from AuthContext
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [stats, setStats] = useState({
    totalAdmins: 0,
    activeAdmins: 0,
    roles: {},
  });

  useEffect(() => {
    if (!loggedInAdmin) return;

    // Find the logged-in admin in your JSON
    const selectedAdmin =
      adminData.find((a) => a.id === loggedInAdmin.id) ||
      adminData.find((a) => a.email === loggedInAdmin.email); // fallback by email
    if (!selectedAdmin) return;

    setAdmin(selectedAdmin);
    setFormData({
      name: selectedAdmin.name || "",
      email: selectedAdmin.email || "",
      phoneNumber: selectedAdmin.phoneNumber || "",
      active: selectedAdmin.active || false,
    });

    // Compute stats dynamically
    const totalAdmins = adminData.length;
    const activeAdmins = adminData.filter((a) => a.active).length;
    const roles = adminData.reduce((acc, curr) => {
      acc[curr.role] = (acc[curr.role] || 0) + 1;
      return acc;
    }, {});

    setStats({ totalAdmins, activeAdmins, roles });
  }, [loggedInAdmin]);

  if (!loggedInAdmin) return <p>Please log in to view your profile.</p>;
  if (!admin) return <p>Loading admin data...</p>;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    setAdmin({ ...admin, ...formData });
    setEditMode(false);
    // Optional: persist changes to localStorage or API
  };

  return (
    <div className={`admin-profile ${theme}`}>
      {/* Profile Header */}
      <div className="profile-header">
        <img
          src={`https://i.pravatar.cc/150?u=${admin.id}`}
          alt={admin.name}
          className="profile-pic"
        />
        <div className="profile-info">
          {editMode ? (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field"
              />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="input-field"
              />
              <label>
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                />{" "}
                Active
              </label>
            </>
          ) : (
            <>
              <h2>{admin.name}</h2>
              <p>{admin.email}</p>
              <p className="role">{admin.role}</p>
              <p>Phone: {admin.phoneNumber}</p>
              <p>Last Login: {new Date(admin.lastLogin).toLocaleString()}</p>
              <p>Status: {admin.active ? "Active" : "Inactive"}</p>
            </>
          )}
          <button
            className="edit-btn"
            onClick={() => (editMode ? handleSave() : setEditMode(true))}
          >
            {editMode ? "Save" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="card total-card">
          <h3>{stats.totalAdmins}</h3>
          <p>Total Admins</p>
        </div>
        <div className="card active-card">
          <h3>{stats.activeAdmins}</h3>
          <p>Active Admins</p>
        </div>
        {Object.entries(stats.roles).map(([role, count]) => (
          <div key={role} className="card role-card">
            <h3>{count}</h3>
            <p>{role.charAt(0).toUpperCase() + role.slice(1)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../components/context/AuthContext";
import { useUserNotifications } from "../../../components/context/UserNotificationContext";
import usersData from "../../../data/users/users.json";
import addressData from "../../../data/users/addresses.json";
import "../account/Profile.css";

const ProfilePage = () => {
    const { user, setUser } = useContext(AuthContext);
    const { addNotification } = useUserNotifications();

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        mobile: "",
        gender: "",
        dob: "",
        profilePicture: "",
    });

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

    // 🧩 Load from dummy JSON
    useEffect(() => {
        if (user?.id) {
            const foundUser = usersData.find((u) => u.id === user.id);
            if (foundUser) {
                setProfile(foundUser);
            }

            const userAddresses = addressData.filter((a) => a.userId === user.id);
            setAddresses(userAddresses);
        }
    }, [user]);

    // ✅ Save profile changes locally (dummy)
    const handleSave = (e) => {
        e.preventDefault();

        if (!validateEmail(profile.email)) {
            setError("Invalid email format");
            return;
        }
        if (!validatePhone(profile.phone)) {
            setError("Phone must be 10 digits");
            return;
        }

        setError("");
        setLoading(true);

        setTimeout(() => {
            setUser(profile);
            addNotification("Profile updated successfully", "success");
            setLoading(false);
        }, 1000);

        // ✅ Uncomment when backend is ready (Django)
        /*
        const response = await fetch(`http://localhost:8000/api/users/${user.id}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profile),
        });
        if (!response.ok) throw new Error("Failed to update profile");
        const updatedUser = await response.json();
        setUser(updatedUser);
        addNotification("Profile updated successfully", "success");
        */
    };

    return (
        <div className="container profile-container mt-4">
            <div className="row">
                {/* Left Column – Profile Details */}
                <div className="col-lg-5 mb-4">
                    <div className="profile-card p-4 shadow-sm rounded">
                        <h3>My Profile</h3>

                        <div className="text-center mb-3">
                            <img
                                src={
                                    profile.profilePicture ||
                                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                }
                                alt="Profile"
                                className="rounded-circle border"
                                width="100"
                                height="100"
                            />
                        </div>

                        <form onSubmit={handleSave} className="mt-3">
                            <div className="mb-3">
                                <label>Full Name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Phone:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={profile.mobile}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Gender:</label>
                                <select
                                    className="form-select"
                                    value={profile.gender}
                                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label>Date of Birth:</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={profile.dob}
                                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                                />
                            </div>

                            {error && <p className="text-danger">{error}</p>}
                            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column – Addresses */}
                <div className="col-lg-7">
                    <div className="profile-card p-4 shadow-sm rounded">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3>My Addresses ({addresses.length})</h3>
                            <Link to="/address/add" className="btn btn-success btn-sm">
                                + Add New
                            </Link>
                        </div>

                        {addresses.length === 0 ? (
                            <p>No addresses saved yet.</p>
                        ) : (
                            <ul className="list-group address-list">
                                {addresses.map((addr) => (
                                    <li
                                        key={addr.id}
                                        className="list-group-item d-flex justify-content-between align-items-start mb-2"
                                    >
                                        <div>
                                            <strong>{addr.name}</strong> <br />
                                            {addr.address}, {addr.city}, {addr.state} - {addr.pincode} <br />
                                            Phone: {addr.phone}
                                        </div>
                                        <Link
                                            to={`/address/edit/${addr.id}`}
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            Edit
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

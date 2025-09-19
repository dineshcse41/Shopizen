import React, { useState, useContext } from "react";
import { AuthContext } from "../../components/context/AuthContext";
import { useNotifications } from "../../components/context/NotificationContext";
import Navbar from "../../components/Navbar/Navbar";

const ProfilePage = () => {
    const { user, setUser } = useContext(AuthContext);
    const { addNotification } = useNotifications();

    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError("Invalid email format");
            addNotification("Invalid email format", "error");
            return;
        }
        if (!validatePhone(phone)) {
            setError("Phone must be 10 digits");
            addNotification("Invalid phone number", "error");
            return;
        }

        setError("");
        setLoading(true);

        try {
            // Example: replace with your actual backend/API URL
            const response = await fetch("http://localhost:5000/users/" + user.id, {
                method: "PUT", // or PATCH
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...user, email, phone }),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            const updatedUser = await response.json();

            setUser(updatedUser); // update AuthContext
            addNotification("Profile updated successfully", "success");
        } catch (err) {
            setError(err.message);
            addNotification("Error updating profile", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="mt-4">
                <h2>My Profile</h2>
                <form onSubmit={handleSave} className="p-3 border rounded w-50">
                    <div className="mb-3">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label>Phone:</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default ProfilePage;

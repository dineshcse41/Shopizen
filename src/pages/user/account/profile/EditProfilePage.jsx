import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import usersData from "../../../../data/users/users.json";
import "./Profile.css";

const EditProfilePage = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    profilePicture: "",
  });

  const [preview, setPreview] = useState(""); // Preview URL
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load user data from JSON
  useEffect(() => {
    const userId = 101; // Simulate logged-in user
    const foundUser = usersData.find((u) => u.id === userId);
    if (foundUser) {
      setProfile(foundUser);
      setPreview(foundUser.profilePicture);
    }
  }, []);

  // Validation
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview locally
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);

      // Save image data in profile object (for demo)
      setProfile({ ...profile, profilePicture: reader.result });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!validateEmail(profile.email)) {
      setError("Invalid email format");
      return;
    }

    if (!validatePhone(profile.mobile)) {
      setError("Phone must be 10 digits");
      return;
    }

    setError("");
    setLoading(true);

    // Simulate save delay
    setTimeout(() => {
      const index = usersData.findIndex((u) => u.id === profile.id);
      if (index !== -1) {
        usersData[index] = profile;
      }
      setLoading(false);
      navigate("/account/profile");
      alert("Profile updated successfully!");
    }, 1000);
  };

  return (
    <div className="profile-container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="profile-card p-4 shadow-sm rounded">
            <h3 className="mb-3">Edit Profile</h3>

            {/* Email Verification Reminder */}
            {!profile.emailVerified && (
              <div className="alert alert-warning d-flex justify-content-between align-items-center">
                <span>
                  Your email is not verified.{" "}
                  <Link
                    to="/account/verify-email"
                    className="text-decoration-underline"
                  >
                    Verify Now
                  </Link>
                </span>
              </div>
            )}

            {/* Profile Image Upload */}
            <div className="text-center mb-3">
              <img
                src={
                  preview ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="Profile"
                className="rounded-circle border"
                width="100"
                height="100"
              />
              <input
                type="file"
                accept="image/*"
                className="form-control mt-2"
                onChange={handleImageChange}
              />
            </div>

            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label>Full Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label>Phone:</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.mobile}
                  onChange={(e) =>
                    setProfile({ ...profile, mobile: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label>Gender:</label>
                <select
                  className="form-select"
                  value={profile.gender}
                  onChange={(e) =>
                    setProfile({ ...profile, gender: e.target.value })
                  }
                  required
                >
                  <option value="">Select</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  className="form-control"
                  value={profile.dob}
                  onChange={(e) =>
                    setProfile({ ...profile, dob: e.target.value })
                  }
                  required
                />
              </div>

              {error && <p className="text-danger">{error}</p>}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <Link
                to="/account/profile"
                className="btn btn-secondary w-100 mt-2"
              >
                Cancel
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;

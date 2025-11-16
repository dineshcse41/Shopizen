import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../../components/context/AuthContext";
import { useUserNotifications } from "../../../../components/context/UserNotificationContext";
import usersData from "../../../../data/users/users.json";
import addressData from "../../../../data/users/addresses.json";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Profile.css";

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
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

  useEffect(() => {
    if (user?.id) {
      const foundUser = usersData.find((u) => u.id === user.id);
      if (foundUser) setProfile(foundUser);

      const userAddresses = addressData.filter((a) => a.userId === user.id);
      setAddresses(userAddresses);
    }
  }, [user]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!validateEmail(profile.email))
      return setProfileError("Invalid email format");
    if (!validatePhone(profile.mobile))
      return setProfileError("Phone must be 10 digits");

    setProfileError("");
    setLoading(true);

    setTimeout(() => {
      setUser(profile);
      addNotification("Profile updated successfully", "success");
      setLoading(false);
    }, 1000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = e.target;

    if (!currentPassword.value || !newPassword.value || !confirmPassword.value)
      return setPasswordError("All fields are required");
    if (newPassword.value.length < 8)
      return setPasswordError("New password must be at least 8 characters");
    if (newPassword.value !== confirmPassword.value)
      return setPasswordError("Passwords do not match");

    setPasswordError("");
    setLoading(true);

    setTimeout(() => {
      addNotification("Password changed successfully!", "success");
      setLoading(false);
      e.target.reset();
      setPasswordStrength("");
    }, 1000);
  };

  const evaluatePasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (password.length < 10) return "Medium";
    return "Strong";
  };

  return (
    <div className="profile-container mt-4">
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

            <form onSubmit={handleSaveProfile} className="mt-3">
              <div className="mb-3">
                <label>Full Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
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
                  onChange={(e) =>
                    setProfile({ ...profile, dob: e.target.value })
                  }
                />
              </div>

              {profileError && <p className="text-danger">{profileError}</p>}
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <Link
                to="/account/edit-profile"
                className="btn btn-outline-primary w-100 mt-3"
              >
                Edit Profile
              </Link>
            </form>
          </div>
        </div>

        {/* Right Column – Addresses & Change Password */}
        <div className="col-lg-7">
          {/* Addresses */}
          <div className="profile-card p-4 shadow-sm rounded mb-4">
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
                {addresses.map((addr, index) => (
                  <li
                    key={addr.addressId || index}
                    className="list-group-item d-flex justify-content-between align-items-start mb-2"
                  >
                    <div>
                      <strong>{addr.name}</strong> <br />
                      {addr.doorNumber}, {addr.street}, {addr.city},{" "}
                      {addr.state} - {addr.pincode} <br />
                      Phone: {addr.phone}
                    </div>
                    <Link
                      to={`/address/edit/${addr.addressId}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Edit
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Toggle Change Password */}
          <button
            className="btn btn-primary mb-3 w-100"
            onClick={() => setShowPasswordSection(!showPasswordSection)}
          >
            {showPasswordSection ? "Hide Password Section" : "Change Password"}
          </button>

          {showPasswordSection && (
            <div className="profile-card p-4 shadow-sm rounded">
              <h3>Change Password</h3>
              <form onSubmit={handleChangePassword} className="mt-3">
                {/* Current Password */}
                <div className="mb-3 position-relative">
                  <label>Current Password:</label>
                  <input
                    type={showCurrent ? "text" : "password"}
                    name="currentPassword"
                    className="form-control"
                    placeholder="Enter current password"
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setShowCurrent(!showCurrent)}
                  >
                    {showCurrent ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                {/* New Password */}
                <div className="mb-3 position-relative">
                  <label>New Password:</label>
                  <input
                    type={showNew ? "text" : "password"}
                    name="newPassword"
                    className="form-control"
                    placeholder="Enter new password"
                    onChange={(e) =>
                      setPasswordStrength(
                        evaluatePasswordStrength(e.target.value)
                      )
                    }
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  {passwordStrength && (
                    <small
                      className={`password-strength ${
                        passwordStrength === "Weak"
                          ? "text-danger"
                          : passwordStrength === "Medium"
                          ? "text-warning"
                          : "text-success"
                      }`}
                    >
                      {passwordStrength}
                    </small>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-3 position-relative">
                  <label>Confirm New Password:</label>
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Re-enter new password"
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                {passwordError && (
                  <p className="text-danger">{passwordError}</p>
                )}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

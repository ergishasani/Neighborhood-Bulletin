// src/pages/Profile.jsx

import React, { useState } from "react";
import { auth } from "../services/firebase";  // Firebase authentication
import useUserData from "../hooks/useUserData";  // Import custom hook

const Profile = () => {
  const { userData, loading, error } = useUserData();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Handle email change
  const handleEmailChange = async () => {
    try {
      await auth.currentUser.updateEmail(newEmail);
      alert("Email updated successfully");
    } catch (error) {
      alert("Error updating email: " + error.message);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    try {
      await auth.currentUser.updatePassword(newPassword);
      alert("Password updated successfully");
    } catch (error) {
      alert("Error updating password: " + error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {userData && (
        <div className="profile-details">
          <div>
            <label>First Name:</label>
            <span>{userData.firstName}</span>
          </div>
          <div>
            <label>Last Name:</label>
            <span>{userData.lastName}</span>
          </div>
          <div>
            <label>House Number:</label>
            <span>{userData.houseNumber}</span>
          </div>
          <div>
            <label>Email:</label>
            <span>{auth.currentUser.email}</span>
          </div>
          <div>
            <label>Moderator Status:</label>
            <span>{userData.isModerator ? "Yes" : "No"}</span>
          </div>
        </div>
      )}

      <div className="email-change">
        <input
          type="email"
          placeholder="Enter new email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button onClick={handleEmailChange}>Change Email</button>
      </div>

      <div className="password-change">
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handlePasswordChange}>Change Password</button>
      </div>
    </div>
  );
};

export default Profile;

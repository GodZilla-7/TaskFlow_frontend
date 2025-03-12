import React from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const Profile = () => {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed. Please try again.");
      }

      toast.success("Logged out successfully!");
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
 
      <button className="fixed bottom-4 right-4 z-50" onClick={handleLogout}><img src="./logout.svg"/></button>

  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getUserProfile(user.id);
        setFormData({
          name: data.name || "",
          username: data.username || "",
          email: data.email || "",
          password: "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await updateUserProfile(user.id, formData);
      login({ ...user, ...data }); // update context
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-md"
        aria-label="Profile form"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          My Profile
        </h2>

        {message && (
          <p
            className="text-center mb-4 text-sm text-green-600"
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}

        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-semibold mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            aria-label="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Username */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-semibold mb-1"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            aria-label="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            aria-label="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-semibold mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            aria-label="New password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
            placeholder="Enter new password"
          />
        </div>

        {/* Role (disabled) */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Role</label>
          <input
            type="text"
            value={user.role}
            disabled
            aria-label="User role"
            className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            Role changes can only be made by an admin.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          aria-label="Save profile changes"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;

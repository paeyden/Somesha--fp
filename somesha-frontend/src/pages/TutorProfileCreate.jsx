import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createTutorProfile } from "../services/api"; // API client

const TutorProfileCreate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId; // passed from Register redirect

  const [form, setForm] = useState({
    subjects: "",
    bio: "",
    experience: "",
    availability: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!userId) {
      alert("Missing user ID. Please log in again.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await createTutorProfile({ ...form, userId });
      alert("Tutor profile created successfully!");
      navigate("/tutor"); // redirect to tutor dashboard
    } catch (err) {
      alert("Error creating tutor profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg border border-blue-200 rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">
          Create Tutor Profile
        </h1>

        {!userId && (
          <div className="mb-4 text-sm text-red-600">
            Unable to identify your account. Please log in again.
          </div>
        )}

        <input
          type="text"
          name="subjects"
          placeholder="Subjects (comma-separated)"
          value={form.subjects}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="bio"
          placeholder="Short Bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
          rows={4}
        />

        <input
          type="number"
          name="experience"
          placeholder="Years of Experience"
          value={form.experience}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="availability"
          placeholder="Availability (e.g. Mon–Fri, 9am–5pm)"
          value={form.availability}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6 focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !userId}
          className={`w-full py-2 px-4 rounded font-semibold transition-colors ${
            loading || !userId
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          You can complete this later from your dashboard.
        </p>
      </div>
    </div>
  );
};

export default TutorProfileCreate;
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createTutorProfile } from "../services/api";

const TutorProfileCreate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

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
      navigate("/tutor");
    } catch (err) {
      alert("Error creating tutor profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 bg-blue-50">
      <div
        className="bg-white border border-blue-200 shadow-lg rounded-lg p-6 md:p-8 w-full max-w-lg"
        role="form"
        aria-labelledby="tutor-profile-heading"
      >
        <h1
          id="tutor-profile-heading"
          className="text-2xl md:text-3xl font-bold text-blue-700 mb-6 text-center"
        >
          Create Tutor Profile
        </h1>

        {!userId && (
          <div className="mb-4 text-sm text-red-600" role="alert">
            Unable to identify your account. Please log in again.
          </div>
        )}

        <label className="sr-only" htmlFor="subjects">
          Subjects
        </label>
        <input
          type="text"
          id="subjects"
          name="subjects"
          placeholder="Subjects (comma-separated)"
          value={form.subjects}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
          aria-required="true"
        />

        <label className="sr-only" htmlFor="bio">
          Short Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          placeholder="Short Bio"
          value={form.bio}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
          aria-required="true"
        />

        <label className="sr-only" htmlFor="experience">
          Years of Experience
        </label>
        <input
          type="number"
          id="experience"
          name="experience"
          placeholder="Years of Experience"
          value={form.experience}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
          aria-required="true"
        />

        <label className="sr-only" htmlFor="availability">
          Availability
        </label>
        <input
          type="text"
          id="availability"
          name="availability"
          placeholder="Availability (e.g. Mon–Fri, 9am–5pm)"
          value={form.availability}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6 focus:ring-2 focus:ring-blue-500"
          aria-required="true"
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !userId}
          className={`w-full py-2 px-4 rounded font-semibold transition-colors ${
            loading || !userId
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
          aria-busy={loading}
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

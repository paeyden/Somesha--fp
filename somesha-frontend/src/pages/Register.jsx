import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("parent");
  const [NationalId, setTutorId] = useState("");
  const [tscNumber, setTscNumber] = useState("");
  const [grade, setGrade] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name, email, password, role };
      if (username.trim()) payload.username = username;
      if (role === "tutor") {
        payload.nationalID = NationalId;
        payload.tscNumber = tscNumber;
      }
      if (role === "child") {
        payload.grade = grade;
      }

      const { data } = await registerUser(payload);

      // include admissionNumber in login context
      login({
        id: data.user.id,
        name: data.user.name,
        role: data.user.role,
        token: data.token,
        isVerified: data.user.isVerified,
        admissionNumber: data.user.admissionNumber,   // NEW
        children: data.user.children || [],
      });

      // Redirect tutors to profile setup, others to dashboards
      if (data.user.role === "tutor") {
        navigate("/tutor/profile/create", { state: { userId: data.user.id } });
      } else {
        navigate(`/${data.user.role}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-700">
          Create Your Account
        </h2>

        {error && (
          <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
        )}

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Username (optional)
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
            placeholder="Choose a username"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Role</label>
          <div className="flex gap-6">
            {["parent", "tutor", "child"].map((r) => (
              <label key={r} className="flex items-center gap-1">
                <input
                  type="radio"
                  value={r}
                  checked={role === r}
                  onChange={(e) => setRole(e.target.value)}
                />
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Tutor-specific fields */}
        {role === "tutor" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Tutor's National ID
              </label>
              <input
                type="text"
                value={NationalId}
                onChange={(e) => setTutorId(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                TSC Number
              </label>
              <input
                type="text"
                value={tscNumber}
                onChange={(e) => setTscNumber(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
            <div className="mb-4 text-xs text-gray-600 bg-gray-100 p-3 rounded">
              <strong>Privacy Notice:</strong> We collect Tutor ID and TSC Number
              to verify your professional credentials. This sensitive information
              is stored securely in line with our privacy policy.
            </div>
          </>
        )}

        {/* Child-specific field */}
        {role === "child" && (
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Grade</label>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          Register
        </button>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
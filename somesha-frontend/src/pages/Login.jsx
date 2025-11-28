import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await loginUser({ email, password });

      if (data?.token && data?.user) {
        login({
          id: data.user.id,
          name: data.user.name,
          role: data.user.role,
          token: data.token,
          isVerified: data.user.isVerified,
          admissionNumber: data.user.admissionNumber,
          children: data.user.children || [],
        });

        // Redirect based on role
        switch (data.user.role) {
          case "tutor":
            navigate("/tutor");
            break;
          case "parent":
            navigate("/parent");
            break;
          case "child":
            navigate("/child");
            break;
          case "admin":
            navigate("/admin");
            break;
          default:
            navigate("/");
        }
      } else {
        setError("Login failed: invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed: server error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
        aria-label="Login form"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Login
        </h2>

        {error && (
          <p
            className="text-red-500 mb-4 text-center"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </p>
        )}

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            aria-required="true"
            aria-label="Email address"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            aria-required="true"
            aria-label="Password"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Login"
        >
          Login
        </button>

        {/* Register Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer font-medium"
            onClick={() => navigate("/register")}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;

import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("someshaUser");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = user?.token;
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("someshaUser");
    navigate("/");
  };

  return (
    <nav className="bg-blue-800 text-white px-6 py-3 flex justify-between items-center">
      {/* Logo / Home */}
      <h1
        className="text-xl font-semibold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Somesha
      </h1>

      {/* Admission Number */}
      {token && user?.admissionNumber && (
        <span className="text-sm font-medium bg-blue-700 px-3 py-1 rounded">
          Admission #: {user.admissionNumber}
        </span>
      )}

      {/* Role-based navigation */}
      <div className="flex gap-4">
        {!token && (
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </>
        )}

        {token && role === "parent" && (
          <>
            <button onClick={() => navigate("/parent")}>Dashboard</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}

        {token && role === "tutor" && (
          <>
            <button onClick={() => navigate("/tutor")}>Dashboard</button>
            <button onClick={() => navigate("/tutor/lessons")}>Lessons</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}

        {token && role === "child" && (
          <>
            <button onClick={() => navigate("/child")}>Dashboard</button>
            <button onClick={() => navigate("/child/lessons")}>Lessons</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}

        {token && role === "admin" && (
          <>
            <button onClick={() => navigate("/admin-dashboard")}>Dashboard</button>
            <button onClick={() => navigate("/admin/users")}>Users</button>
            <button onClick={() => navigate("/admin/unverified-tutors")}>
              Verify Tutors
            </button>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
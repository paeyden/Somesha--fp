import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("someshaUser");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = user?.token;
  const role = user?.role;

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h2 className="text-xl font-semibold mb-6">Somesha</h2>

      {!token && (
        <ul className="space-y-2">
          <li>
            <button onClick={() => navigate("/")} className="w-full text-left">
              Home
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/login")} className="w-full text-left">
              Login
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/register")} className="w-full text-left">
              Register
            </button>
          </li>
        </ul>
      )}

      {token && role === "parent" && (
        <ul className="space-y-2">
          <li><button onClick={() => navigate("/parent")} className="w-full text-left">Dashboard</button></li>
          <li><button onClick={() => navigate("/profile")} className="w-full text-left">Profile</button></li>
        </ul>
      )}

      {token && role === "tutor" && (
        <ul className="space-y-2">
          <li><button onClick={() => navigate("/tutor")} className="w-full text-left">Dashboard</button></li>
          <li><button onClick={() => navigate("/tutor/lessons")} className="w-full text-left">Lessons</button></li>
          <li><button onClick={() => navigate("/tutor/student-progress")} className="w-full text-left">Student Progress</button></li>
          <li><button onClick={() => navigate("/profile")} className="w-full text-left">Profile</button></li>
        </ul>
      )}
      {token && role === "child" && (
        <ul className="space-y-2">
          <li>
            <button onClick={() => navigate("/child")} className="w-full text-left">
              Dashboard
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/child/lessons")} className="w-full text-left">
              Assigned Lessons
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/profile")} className="w-full text-left">
              Profile
            </button>
          </li>
        </ul>
      )}

      {token && role === "admin" && (
        <ul className="space-y-2">
          <li><button onClick={() => navigate("/admin-dashboard")} className="w-full text-left">Dashboard</button></li>
          <li><button onClick={() => navigate("/admin/users")} className="w-full text-left">Manage Users</button></li>
          <li><button onClick={() => navigate("/admin/unverified-tutors")} className="w-full text-left">Verify Tutors</button></li>
          <li><button onClick={() => navigate("/system-stats")} className="w-full text-left">System Stats</button></li>
          <li><button onClick={() => navigate("/profile")} className="w-full text-left">Profile</button></li>
        </ul>
      )}

    </aside>
  );
};

export default Sidebar;
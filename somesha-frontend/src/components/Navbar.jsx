import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const storedUser = localStorage.getItem("someshaUser");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = user?.token;
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("someshaUser");
    navigate("/");
  };

  // Toggle mobile menu
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav
      className="bg-blue-800 text-white px-4 sm:px-6 py-3 flex justify-between items-center"
      aria-label="Main navigation"
    >
      {/* Logo / Home */}
      <h1
        className="text-xl font-semibold cursor-pointer"
        onClick={() => navigate("/")}
        tabIndex={0}
        role="link"
        aria-label="Go to homepage"
        onKeyDown={(e) => e.key === "Enter" && navigate("/")}
      >
        Somesha
      </h1>

      {/* Admission Number */}
      {token && user?.admissionNumber && (
        <span className="hidden sm:inline-block text-sm font-medium bg-blue-700 px-3 py-1 rounded">
          Admission #: {user.admissionNumber}
        </span>
      )}

      {/* Desktop Menu */}
      <div className="hidden sm:flex gap-4 items-center">
        {!token && (
          <>
            <button onClick={() => navigate("/login")} aria-label="Login">
              Login
            </button>
            <button onClick={() => navigate("/register")} aria-label="Register">
              Register
            </button>
          </>
        )}

        {token && role === "parent" && (
          <>
            <button onClick={() => navigate("/parent")} aria-label="Parent Dashboard">
              Dashboard
            </button>
            <button onClick={handleLogout} aria-label="Logout">
              Logout
            </button>
          </>
        )}

        {token && role === "tutor" && (
          <>
            <button onClick={() => navigate("/tutor")} aria-label="Tutor Dashboard">
              Dashboard
            </button>
            <button onClick={() => navigate("/tutor/lessons")} aria-label="Tutor Lessons">
              Lessons
            </button>
            <button onClick={handleLogout} aria-label="Logout">
              Logout
            </button>
          </>
        )}

        {token && role === "child" && (
          <>
            <button onClick={() => navigate("/child")} aria-label="Child Dashboard">
              Dashboard
            </button>
            <button onClick={() => navigate("/child/lessons")} aria-label="Child Lessons">
              Lessons
            </button>
            <button onClick={handleLogout} aria-label="Logout">
              Logout
            </button>
          </>
        )}

        {token && role === "admin" && (
          <>
            <button onClick={() => navigate("/admin-dashboard")} aria-label="Admin Dashboard">
              Dashboard
            </button>
            <button onClick={() => navigate("/admin/users")} aria-label="Manage Users">
              Users
            </button>
            <button
              onClick={() => navigate("/admin/unverified-tutors")}
              aria-label="Verify Tutors"
            >
              Verify Tutors
            </button>
            <button onClick={handleLogout} aria-label="Logout">
              Logout
            </button>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={toggleMenu}
        className="sm:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="absolute top-full left-0 w-full bg-blue-800 flex flex-col items-start px-4 py-3 gap-2 sm:hidden z-20"
          aria-label="Mobile navigation menu"
        >
          {!token && (
            <>
              <button onClick={() => navigate("/login")} aria-label="Login">
                Login
              </button>
              <button onClick={() => navigate("/register")} aria-label="Register">
                Register
              </button>
            </>
          )}

          {token && role === "parent" && (
            <>
              <button onClick={() => navigate("/parent")} aria-label="Parent Dashboard">
                Dashboard
              </button>
              <button onClick={handleLogout} aria-label="Logout">
                Logout
              </button>
            </>
          )}

          {token && role === "tutor" && (
            <>
              <button onClick={() => navigate("/tutor")} aria-label="Tutor Dashboard">
                Dashboard
              </button>
              <button onClick={() => navigate("/tutor/lessons")} aria-label="Tutor Lessons">
                Lessons
              </button>
              <button onClick={handleLogout} aria-label="Logout">
                Logout
              </button>
            </>
          )}

          {token && role === "child" && (
            <>
              <button onClick={() => navigate("/child")} aria-label="Child Dashboard">
                Dashboard
              </button>
              <button onClick={() => navigate("/child/lessons")} aria-label="Child Lessons">
                Lessons
              </button>
              <button onClick={handleLogout} aria-label="Logout">
                Logout
              </button>
            </>
          )}

          {token && role === "admin" && (
            <>
              <button onClick={() => navigate("/admin-dashboard")} aria-label="Admin Dashboard">
                Dashboard
              </button>
              <button onClick={() => navigate("/admin/users")} aria-label="Manage Users">
                Users
              </button>
              <button
                onClick={() => navigate("/admin/unverified-tutors")}
                aria-label="Verify Tutors"
              >
                Verify Tutors
              </button>
              <button onClick={handleLogout} aria-label="Logout">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

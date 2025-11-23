import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PublicHome from "./pages/PublicHome";
import ChildDashboard from "./pages/ChildDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import TutorDashboard from "./pages/TutorDashboard";
// import AdminDashboard from "./pages/AdminDashboard"; // later
import Login from "./pages/Login";
import Register from "./pages/Register";

// NEW pages
import TutorLessons from "./pages/TutorLesson";          
import TutorStudentProgress from "./pages/StudentProgress"; 
import ProfilePage from "./pages/ProfilePage";            
import TutorProfileCreate from "./pages/TutorProfileCreate"; // ✅ new tutor profile create page
import ChildLessons from "./pages/ChildLessons";

import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth(); // user = { role: 'child' | 'parent' | 'tutor' | 'admin' }

  // Role-based route protection
 const ProtectedRoute = ({ children, allowedRoles }) => {
  console.log("ProtectedRoute check:", user);
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Child Dashboard */}
        <Route
          path="/child"
          element={
            <ProtectedRoute allowedRoles={["child"]}>
              <ChildDashboard childId={user?.id} />
            </ProtectedRoute>
          }
        />
        {/* Child Lessons */}
        <Route
          path="/child/lessons"
          element={
            <ProtectedRoute allowedRoles={["child"]}>
              <ChildLessons childId={user?.id} />
            </ProtectedRoute>
          }
        />

        {/* Parent Dashboard */}
        <Route
          path="/parent"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <ParentDashboard childId={user?.children?.[0]} />
            </ProtectedRoute>
          }
        />

        {/* Tutor Dashboard */}
        <Route
          path="/tutor"
          element={
            <ProtectedRoute allowedRoles={["tutor"]}>
              <TutorDashboard tutorId={user?.id} />
            </ProtectedRoute>
          }
        />

        {/* Tutor Lessons */}
        <Route
          path="/tutor/lessons"
          element={
            <ProtectedRoute allowedRoles={["tutor"]}>
              <TutorLessons />
            </ProtectedRoute>
          }
        />

        {/* Tutor Student Progress */}
        <Route
          path="/tutor/student-progress"
          element={
            <ProtectedRoute allowedRoles={["tutor"]}>
              <TutorStudentProgress />
            </ProtectedRoute>
          }
        />

        {/* Tutor Profile Create */}
        <Route
          path="/tutor/profile/create"
          element={
            <ProtectedRoute allowedRoles={["tutor"]}>
              <TutorProfileCreate />
            </ProtectedRoute>
          }
        />

        {/* Profile Page (all authenticated roles) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["child", "parent", "tutor", "admin"]}>
              <ProfilePage user={user} />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard (later) */}
        {/* <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </Router>
  );
}

export default App;
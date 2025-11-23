import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import StudentProgress from "../components/progress/StudentProgress";
import NotificationsPanel from "../components/NotificationPanel";
import ProfileCard from "../components/ProfileCard";
import LessonAssign from "../components/lessons/LessonAssign";
import { getCoursesByTutor } from "../services/api"; // you'll create this API call

const TutorDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Fetch courses for this tutor
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await getCoursesByTutor();
        setCourses(data);
        if (data.length) setSelectedCourse(data[0]._id); // default select first course
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <DashboardLayout role="tutor">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">Tutor Dashboard</h1>

      {/* Top Section: Profile + Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-600 mb-3">Profile</h2>
          <ProfileCard role="tutor" />
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-600 mb-3">Notifications</h2>
          <NotificationsPanel role="tutor" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Lessons</h3>
          <p className="text-2xl font-bold text-indigo-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold text-gray-700">Active Students</h3>
          <p className="text-2xl font-bold text-green-600">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold text-gray-700">Pending Reviews</h3>
          <p className="text-2xl font-bold text-red-600">3</p>
        </div>
      </div>

      {/* Course Selector + Lesson Assignment */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">Assign Lessons</h2>

        {/* Course Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Course:</label>
          <select
            value={selectedCourse || ""}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full max-w-sm"
          >
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title} - {course.subject}
              </option>
            ))}
          </select>
        </div>

        {/* Lesson Assign Component */}
        {selectedCourse && <LessonAssign tutorId={null} courseId={selectedCourse} />}
      </div>

      {/* Student Progress Snapshot */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-600 mb-3">Student Progress Overview</h2>
        <StudentProgress compact />
      </div>
    </DashboardLayout>
  );
};

export default TutorDashboard;

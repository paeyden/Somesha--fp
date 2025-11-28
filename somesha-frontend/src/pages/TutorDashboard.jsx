import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import StudentProgress from "../components/progress/StudentProgress";
import NotificationsPanel from "../components/NotificationPanel";
import ProfileCard from "../components/ProfileCard";
import LessonAssign from "../components/lessons/LessonAssign";
import { getCoursesByTutor } from "../services/api";

const TutorDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Fetch courses for this tutor
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const { data } = await getCoursesByTutor();
        setCourses(data);
        if (data.length) setSelectedCourse(data[0]._id); // default select first course
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <DashboardLayout role="tutor">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">Tutor Dashboard</h1>

      {/* Top Section: Profile + Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white shadow-md rounded-lg p-4" aria-labelledby="profile-heading">
          <h2 id="profile-heading" className="text-lg font-semibold text-blue-600 mb-3">
            Profile
          </h2>
          <ProfileCard role="tutor" />
        </section>

        <section className="bg-white shadow-md rounded-lg p-4" aria-labelledby="notifications-heading">
          <h2 id="notifications-heading" className="text-lg font-semibold text-blue-600 mb-3">
            Notifications
          </h2>
          <NotificationsPanel role="tutor" />
        </section>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {[
          { title: "Total Lessons", value: 12, color: "text-indigo-600" },
          { title: "Active Students", value: 8, color: "text-green-600" },
          { title: "Pending Reviews", value: 3, color: "text-red-600" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-lg shadow text-center"
            role="region"
            aria-label={`${stat.title}: ${stat.value}`}
          >
            <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Course Selector + Lesson Assignment */}
      <section className="mt-8 bg-white shadow-md rounded-lg p-4" aria-labelledby="assign-lessons-heading">
        <h2 id="assign-lessons-heading" className="text-lg font-semibold text-blue-600 mb-4">
          Assign Lessons
        </h2>

        {loadingCourses ? (
          <p className="text-gray-600">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-600">No courses available. Please create a course first.</p>
        ) : (
          <>
            <label htmlFor="course-select" className="block text-gray-700 mb-2">
              Select Course:
            </label>
            <select
              id="course-select"
              value={selectedCourse || ""}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full max-w-sm focus:ring focus:ring-blue-300"
              aria-label="Select course to assign lessons"
            >
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title} - {course.subject}
                </option>
              ))}
            </select>

            {selectedCourse && <LessonAssign tutorId={null} courseId={selectedCourse} />}
          </>
        )}
      </section>

      {/* Student Progress Snapshot */}
      <section className="mt-8 bg-white shadow-md rounded-lg p-4" aria-labelledby="student-progress-heading">
        <h2 id="student-progress-heading" className="text-lg font-semibold text-blue-600 mb-3">
          Student Progress Overview
        </h2>
        <StudentProgress compact />
      </section>
    </DashboardLayout>
  );
};

export default TutorDashboard;

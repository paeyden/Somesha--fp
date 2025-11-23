import React, { useState, useEffect } from "react";
import {
  createEnrollment,
  getAllTutors,
  getCourses,
} from "../../services/api"; // API client

const Bookings = ({ childId }) => {
  const [tutors, setTutors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tutorRes, courseRes] = await Promise.all([
          getAllTutors(),
          getCourses(),
        ]);
        setTutors(tutorRes.data);
        setCourses(courseRes.data);
      } catch (err) {
        console.error("Error fetching tutors/courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBooking = async () => {
    if (!selectedTutor || !selectedCourse) {
      alert("Please select both a tutor and a course.");
      return;
    }

    try {
      await createEnrollment({
        childId,
        tutorId: selectedTutor,
        courseId: selectedCourse,
      });
      alert("Enrollment successful! Your child has been enrolled.");
      setSelectedTutor("");
      setSelectedCourse("");
    } catch (err) {
      alert("Error creating enrollment: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto"></div>
        <p className="mt-3 text-gray-600">Loading tutors and courses...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">
        Book a Tutor & Course
      </h1>

      <div className="bg-white shadow-lg border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">
          Enrollment Form
        </h2>

        {/* Tutor Select */}
        <select
          value={selectedTutor}
          onChange={(e) => setSelectedTutor(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Tutor</option>
          {tutors.map((tutor) => (
            <option key={tutor._id} value={tutor._id}>
              {tutor.name} {tutor.verified ? "(Verified)" : "(Pending)"}
            </option>
          ))}
        </select>

        {/* Course Select */}
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title} — {course.subject}
            </option>
          ))}
        </select>

        {/* Submit Button */}
        <button
          onClick={handleBooking}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Enroll Child
        </button>
      </div>
    </div>
  );
};

export default Bookings;
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
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto"
          role="status"
          aria-label="Loading tutors and courses"
        ></div>
        <p className="mt-3 text-gray-600">Loading tutors and courses...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-blue-50 min-h-screen flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700 text-center">
          Book a Tutor & Course
        </h1>

        <div className="bg-white shadow-lg border border-blue-200 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-blue-600 mb-2">
            Enrollment Form
          </h2>

          {/* Tutor Select */}
          <label htmlFor="tutor" className="sr-only">
            Select Tutor
          </label>
          <select
            id="tutor"
            value={selectedTutor}
            onChange={(e) => setSelectedTutor(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select Tutor"
          >
            <option value="">Select Tutor</option>
            {tutors.map((tutor) => (
              <option key={tutor._id} value={tutor._id}>
                {tutor.name} {tutor.verified ? "(Verified)" : "(Pending)"}
              </option>
            ))}
          </select>

          {/* Course Select */}
          <label htmlFor="course" className="sr-only">
            Select Course
          </label>
          <select
            id="course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select Course"
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
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label="Enroll Child"
          >
            Enroll Child
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bookings;

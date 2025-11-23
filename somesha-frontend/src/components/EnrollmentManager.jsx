import React, { useState, useEffect } from "react";
import { createEnrollment, getCourses, getEnrollmentsByParent, getUserProfile } from "../services/api";

const EnrollmentManager = ({ parentId }) => {
  const [courses, setCourses] = useState([]);
  const [children, setChildren] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [form, setForm] = useState({
    courseId: "",
    childId: ""
  });

  // Load parent's children
  useEffect(() => {
    const loadChildren = async () => {
      try {
        const res = await getUserProfile();
        setChildren(res.data.children || []);
      } catch (err) {
        console.error("Error fetching children:", err);
      }
    };
    loadChildren();
  }, []);

  // Load courses
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await getCourses();
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    loadCourses();
  }, []);

  // Load parent's current enrollments
  useEffect(() => {
    const loadEnrollments = async () => {
      try {
        if (!parentId) return;
        const res = await getEnrollmentsByParent(parentId);
        setEnrollments(res.data);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
      }
    };
    loadEnrollments();
  }, [parentId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.childId || !form.courseId) {
      alert("Please select a child and a course");
      return;
    }
    try {
      await createEnrollment({
        childId: form.childId,
        courseId: form.courseId
      });

      alert("Enrollment successful!");
      setForm({ courseId: "", childId: "" });

      // Reload enrollments after successful enrollment
      const res = await getEnrollmentsByParent(parentId);
      setEnrollments(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error enrolling child");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Enroll Your Child in a Course
      </h2>

      {/* Enrollment Form */}
      <div className="mb-6">
        <select
          name="childId"
          value={form.childId}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-3"
        >
          <option value="">Select child</option>
          {children.map((ch) => (
            <option key={ch._id} value={ch._id}>
              {ch.name} ({ch.admissionNumber})
            </option>
          ))}
        </select>

        <select
          name="courseId"
          value={form.courseId}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-3"
        >
          <option value="">Select course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title} ({c.subject} - Grade {c.grade})
            </option>
          ))}
        </select>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Enroll Child
        </button>
      </div>

      {/* Current Enrollments */}
      <div>
        <h3 className="text-lg font-semibold text-blue-600 mb-3">
          Current Enrollments
        </h3>

        {enrollments.length === 0 ? (
          <p className="text-gray-500">No enrollments yet.</p>
        ) : (
          <ul className="space-y-2">
            {enrollments.map((enroll) => (
              <li
                key={enroll._id}
                className="border p-3 rounded shadow-sm bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-700">
                    {enroll.child?.name} — {enroll.course?.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {enroll.status} | Tutor: {enroll.tutor?.name}
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  Enrolled: {new Date(enroll.enrolledAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EnrollmentManager;

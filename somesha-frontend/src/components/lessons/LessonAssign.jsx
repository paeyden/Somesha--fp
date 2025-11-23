import React, { useState, useEffect } from "react";
import { getLessonsByTutor, getEnrollmentsByTutor, assignLesson } from "../../services/api";

const LessonAssign = ({ tutorId, courseId = null }) => {
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Fetch lessons by tutor (optionally filtered by course)
  useEffect(() => {
    const fetchLessons = async () => {
      if (!tutorId) return;
      try {
        const { data } = await getLessonsByTutor(tutorId, courseId);
        setLessons(data);
      } catch (err) {
        console.error("Error fetching lessons:", err);
      }
    };
    fetchLessons();
  }, [tutorId, courseId]);

  // Fetch enrolled students for this tutor (optionally filtered by course)
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!tutorId) return;
      try {
        const { data } = await getEnrollmentsByTutor(tutorId);
        const uniqueStudents = [];

        data.forEach((enrollment) => {
          // courseId may be null -> no filtering, otherwise filter by course
          const courseMatches = !courseId || enrollment.course._id.toString() === courseId.toString();

          if (enrollment.child && courseMatches && !uniqueStudents.find((s) => s._id === enrollment.child._id)) {
            uniqueStudents.push(enrollment.child);
          }
        });

        setStudents(uniqueStudents);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
      }
    };
    fetchEnrollments();
  }, [tutorId, courseId]);

  const toggleStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAssign = async (lessonId) => {
    try {
      await assignLesson(lessonId, selectedStudents);
      alert(`Lesson assigned to ${selectedStudents.length} students.`);
      setSelectedStudents([]);
    } catch (err) {
      alert("Error assigning lesson: " + err.message);
    }
  };

  return (
    <div className="p-6 bg-blue-50 min-h-[300px] rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">
        Assign Lessons to Enrolled Students
      </h1>

      {/* Student Selection */}
      <div className="bg-white shadow-lg border border-blue-200 rounded-lg mb-6 p-6">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">
          Select Students
        </h2>
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {students.length === 0 ? (
            <p className="text-gray-500">No students enrolled yet.</p>
          ) : (
            students.map((student) => (
              <label key={student._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student._id)}
                  onChange={() => toggleStudent(student._id)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{student.name}</span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Lessons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.length === 0 ? (
          <p className="text-gray-500 col-span-2">No lessons found for this tutor/course.</p>
        ) : (
          lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="bg-white shadow-md border border-green-200 rounded-lg p-6 transform transition hover:scale-105 hover:shadow-xl"
            >
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-blue-600">{lesson.title}</h3>
                <p className="text-sm text-gray-500">{lesson.subject} • Grade {lesson.grade}</p>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">{lesson.description}</p>
              <button
                onClick={() => handleAssign(lesson._id)}
                disabled={selectedStudents.length === 0}
                className={`mt-3 text-sm font-medium py-1 px-3 rounded transition-colors ${
                  selectedStudents.length === 0
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                Assign to Selected
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LessonAssign;

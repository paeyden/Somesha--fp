import React, { useState, useEffect } from "react";
import {
  createLesson,
  getLessonsByTutor,
  updateLesson,
} from "../../services/api";

const LessonManager = ({ tutorId }) => {
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    description: "",
    grade: "",
    notes: "",
    resources: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Debug: Check tutorId loaded correctly
  useEffect(() => {
    console.log("Tutor ID received:", tutorId);
  }, [tutorId]);

  // Fetch lessons ONLY if tutorId exists
  useEffect(() => {
    if (!tutorId) return; // prevent undefined request

    const fetchLessons = async () => {
      try {
        const { data } = await getLessonsByTutor(tutorId);
        setLessons(data);
      } catch (err) {
        alert("Error fetching lessons: " + err.message);
      }
    };

    fetchLessons();
  }, [tutorId]);

  // Handle input changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Create or update lesson
  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateLesson(editingId, form);
        alert("Lesson updated");
      } else {
        await createLesson({ ...form, tutorId });
        alert("Lesson created");
      }

      // refresh
      const { data } = await getLessonsByTutor(tutorId);
      setLessons(data);

      // reset form
      setForm({
        title: "",
        subject: "",
        description: "",
        grade: "",
        notes: "",
        resources: "",
      });
      setEditingId(null);
    } catch (err) {
      alert("Error saving lesson: " + err.message);
    }
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      {/* Form */}
      <div className="bg-white shadow-lg border border-blue-200 rounded-lg mb-8 p-6">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          {editingId ? "Edit Lesson" : "Create Lesson"}
        </h2>

        <input
          type="text"
          placeholder="Lesson Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Grade"
          name="grade"
          value={form.grade}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Notes (Markdown supported)"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Resources (comma-separated URLs)"
          name="resources"
          value={form.resources}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-4 transition-colors"
        >
          {editingId ? "Update Lesson" : "Create Lesson"}
        </button>
      </div>

      {/* Lessons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson) => (
          <div
            key={lesson._id}
            className="bg-white shadow-md border border-green-200 rounded-lg p-6 transform transition hover:scale-105 hover:shadow-xl"
          >
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-blue-600">
                {lesson.title}
              </h3>
              <p className="text-sm text-gray-500">
                {lesson.subject} • Grade {lesson.grade}
              </p>
            </div>

            <p className="text-sm text-gray-700 line-clamp-2">
              {lesson.description}
            </p>

            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              Notes: {lesson.notes}
            </p>

            <button
              onClick={() => {
                setForm({
                  title: lesson.title,
                  subject: lesson.subject,
                  description: lesson.description,
                  grade: lesson.grade,
                  notes: lesson.notes,
                  resources: lesson.resources?.join(","),
                });
                setEditingId(lesson._id);
              }}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-1 px-3 rounded mt-3 transition-colors"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonManager;

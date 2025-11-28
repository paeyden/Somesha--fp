import React, { useState, useEffect } from "react";
import { createLesson, getLessonsByTutor, updateLesson } from "../../services/api";

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

  // Fetch lessons
  useEffect(() => {
    if (!tutorId) return;

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

      // refresh lessons
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
    <div className="p-4 sm:p-6 bg-blue-50 min-h-screen flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Form */}
        <div
          className="bg-white shadow-lg border border-blue-200 rounded-lg mb-8 p-4 sm:p-6"
          aria-label={editingId ? "Edit lesson form" : "Create lesson form"}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-4">
            {editingId ? "Edit Lesson" : "Create Lesson"}
          </h2>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Lesson Title"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Lesson title"
          />

          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Subject"
          />

          <input
            type="text"
            name="grade"
            value={form.grade}
            onChange={handleChange}
            placeholder="Grade"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Grade"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Lesson description"
          />

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Notes (Markdown supported)"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Lesson notes"
          />

          <input
            type="text"
            name="resources"
            value={form.resources}
            onChange={handleChange}
            placeholder="Resources (comma-separated URLs)"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Lesson resources"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-4 transition-colors"
            aria-label={editingId ? "Update lesson" : "Create lesson"}
          >
            {editingId ? "Update Lesson" : "Create Lesson"}
          </button>
        </div>

        {/* Lessons List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="bg-white shadow-md border border-green-200 rounded-lg p-4 sm:p-6 transform transition hover:scale-105 hover:shadow-xl"
              aria-label={`Lesson card: ${lesson.title}, Subject: ${lesson.subject}, Grade: ${lesson.grade}`}
            >
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-blue-600">{lesson.title}</h3>
                <p className="text-sm text-gray-500">{lesson.subject} • Grade {lesson.grade}</p>
              </div>

              <p className="text-sm text-gray-700 line-clamp-2">{lesson.description}</p>
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
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded mt-3 w-full transition-colors"
                aria-label={`Edit lesson ${lesson.title}`}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonManager;

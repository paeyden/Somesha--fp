import React, { useState, useEffect } from "react";
import {
  createCourse,
  getCourses,
  updateCourse,
  addLessonsToCourse,
  getLessonsByTutor,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

const CourseManager = ({ tutorId }) => {
  const { user } = useAuth();
  const finalTutorId = tutorId || user?.id || user?._id;

  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    description: "",
    grade: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [savingCourse, setSavingCourse] = useState(false);
  const [savingLessons, setSavingLessons] = useState(false);

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const { data } = await getCourses();
        setCourses(data.sort((a, b) => a.title.localeCompare(b.title)));
      } catch (err) {
        alert("Error fetching courses: " + err.message);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch tutor lessons
  useEffect(() => {
    const fetchLessons = async () => {
      if (!finalTutorId) return;
      setLoadingLessons(true);
      try {
        const { data } = await getLessonsByTutor(finalTutorId);
        setLessons(data.sort((a, b) => a.title.localeCompare(b.title)));
      } catch (err) {
        alert("Error fetching lessons: " + err.message);
      } finally {
        setLoadingLessons(false);
      }
    };
    fetchLessons();
  }, [finalTutorId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleLesson = (lessonId) => {
    setSelectedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const handleSubmit = async () => {
    setSavingCourse(true);
    try {
      if (editingId) {
        await updateCourse(editingId, form);
        alert("Course updated");
      } else {
        await createCourse(form);
        alert("Course created");
      }

      const { data } = await getCourses();
      setCourses(data);
      setForm({ title: "", subject: "", description: "", grade: "" });
      setEditingId(null);
    } catch (err) {
      alert("Error saving course: " + err.message);
    } finally {
      setSavingCourse(false);
    }
  };

  const handleAttachLessons = async (courseId) => {
    if (!selectedLessons.length) {
      alert("Please select at least one lesson to attach.");
      return;
    }

    if (!window.confirm("Attach selected lessons to this course?")) return;

    setSavingLessons(true);
    try {
      await addLessonsToCourse(courseId, selectedLessons);
      alert("Lessons attached!");

      const { data } = await getCourses();
      setCourses(data);
      setSelectedLessons([]);
    } catch (err) {
      alert("Error attaching lessons: " + err.message);
    } finally {
      setSavingLessons(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-blue-50 p-6">
      <div className="w-full max-w-4xl">
        {/* FORM */}
        <div className="bg-white shadow-lg border border-blue-200 rounded-lg mb-8 p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            {editingId ? "Edit Course" : "Create Course"}
          </h2>

          <input
            type="text"
            placeholder="Course Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          />

          <input
            type="text"
            placeholder="Subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          />

          <input
            type="text"
            placeholder="Grade"
            name="grade"
            value={form.grade}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          />

          <textarea
            placeholder="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          />

          <button
            onClick={handleSubmit}
            disabled={savingCourse}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:opacity-50"
          >
            {savingCourse
              ? editingId
                ? "Updating..."
                : "Creating..."
              : editingId
              ? "Update Course"
              : "Create Course"}
          </button>
        </div>

        {/* COURSE LIST */}
        {loadingCourses ? (
          <p className="text-center text-gray-500">Loading courses...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white shadow-md border border-green-200 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                  {course.title}
                </h3>

                <p className="text-sm text-gray-500 mb-2">
                  {course.subject} • Grade {course.grade}
                </p>

                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                  {course.description}
                </p>

                <button
                  onClick={() => {
                    setForm({
                      title: course.title,
                      subject: course.subject,
                      description: course.description,
                      grade: course.grade,
                    });
                    setEditingId(course._id);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3 rounded mb-3"
                >
                  Edit
                </button>

                {/* LESSON ATTACH */}
                {!finalTutorId ? (
                  <p className="text-red-500 text-sm mt-3">
                    ⚠ Cannot load lessons — no tutor ID found.
                  </p>
                ) : (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">
                      Attach Lessons:
                    </h4>

                    {/* Select/Deselect All */}
                    <div className="flex justify-between mb-2">
                      <button
                        onClick={() =>
                          setSelectedLessons(lessons.map((l) => l._id))
                        }
                        className="text-sm text-blue-600 underline"
                      >
                        Select All
                      </button>
                      <button
                        onClick={() => setSelectedLessons([])}
                        className="text-sm text-red-600 underline"
                      >
                        Deselect All
                      </button>
                    </div>

                    <div className="max-h-32 overflow-y-auto border rounded p-2">
                      {loadingLessons ? (
                        <p className="text-gray-500 text-sm">
                          Loading lessons...
                        </p>
                      ) : lessons.length === 0 ? (
                        <p className="text-gray-500 text-sm">No lessons found.</p>
                      ) : (
                        lessons.map((lesson) => (
                          <label key={lesson._id} className="block text-sm">
                            <input
                              type="checkbox"
                              checked={selectedLessons.includes(lesson._id)}
                              onChange={() => toggleLesson(lesson._id)}
                              className="mr-2"
                            />
                            {lesson.title} ({lesson.subject} - Grade{" "}
                            {lesson.grade})
                          </label>
                        ))
                      )}
                    </div>

                    <button
                      onClick={() => handleAttachLessons(course._id)}
                      disabled={savingLessons}
                      className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded disabled:opacity-50"
                    >
                      {savingLessons ? "Saving..." : "Save Lessons"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManager;

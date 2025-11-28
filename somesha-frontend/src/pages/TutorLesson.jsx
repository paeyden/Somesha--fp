import React from "react";
import LessonManager from "../components/lessons/LessonManager";
import CourseManager from "@/components/CourseManager";

const TutorLessons = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700" id="tutor-lessons-heading">
          Tutor Lessons
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your lessons, resources, and schedules here.
        </p>
      </header>

      {/* Lesson Manager Section */}
      <section
        className="bg-white shadow-md rounded-lg p-4 md:p-6 mb-6"
        aria-labelledby="lesson-manager-heading"
      >
        <h2 id="lesson-manager-heading" className="text-xl font-semibold text-blue-600 mb-3">
          Lesson Manager
        </h2>
        <LessonManager />
      </section>

      {/* Course Manager Section */}
      <section
        className="bg-white shadow-md rounded-lg p-4 md:p-6"
        aria-labelledby="course-manager-heading"
      >
        <h2 id="course-manager-heading" className="text-xl font-semibold text-blue-600 mb-3">
          Course Manager
        </h2>
        <CourseManager />
      </section>

      {/* Future Enhancements */}
      <section className="mt-6 text-gray-500 text-sm" aria-label="Future enhancements">
        {/* TODO: Add filters, search, or analytics here */}
      </section>
    </div>
  );
};

export default TutorLessons;

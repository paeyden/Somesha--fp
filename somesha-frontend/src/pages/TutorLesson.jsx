import React from "react";
import LessonManager from "../components/lessons/LessonManager";
import CourseManager from "@/components/CourseManager";

const TutorLessons = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Tutor Lessons</h1>
        <p className="text-gray-600">
          Manage your lessons, resources, and schedules here.
        </p>
      </header>

      {/* Lesson Manager Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex flex-col">
        <LessonManager />
      </div>


      {/* Course Manager Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <CourseManager />
      </div>

      {/* Future: Add filters, search, or analytics */}
    </div>
  );
};

export default TutorLessons;
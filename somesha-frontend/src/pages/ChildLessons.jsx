import React, { useEffect, useState } from "react";
import { getEnrollmentsByChild, getProgressByChild } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ChildLessons = () => {
  const { user } = useAuth(); // child user with admissionNumber
  const [assignedLessons, setAssignedLessons] = useState([]);
  const [progressEntries, setProgressEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get enrollments → courses → lessons
        const enrollRes = await getEnrollmentsByChild(user.id);
        const lessons = enrollRes.data.flatMap(
          (enroll) => enroll.course?.lessons || []
        );
        setAssignedLessons(lessons);

        // 2. Get progress entries
        const progressRes = await getProgressByChild(user.id);
        setProgressEntries(progressRes.data);
      } catch (err) {
        console.error("Error fetching child lessons:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  if (loading) {
    return (
      <div className="p-4 md:p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto" aria-label="Loading spinner"></div>
        <p className="mt-3 text-gray-600">Loading your lessons...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-blue-50 min-h-screen">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-1">My Lessons</h1>
        <p className="text-sm md:text-base text-gray-600">
          Admission #: {user.admissionNumber}
        </p>
      </header>

      {assignedLessons.length === 0 ? (
        <p className="text-gray-600">No lessons assigned yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {assignedLessons.map((lesson) => {
            const progress = progressEntries.find(
              (p) => p.lesson?._id === lesson._id
            );

            return (
              <article
                key={lesson._id}
                role="article"
                aria-labelledby={`lesson-title-${lesson._id}`}
                className="bg-white shadow-md border border-green-200 rounded-lg p-4 md:p-6 transform transition hover:scale-105 hover:shadow-xl"
              >
                {/* Lesson Title */}
                <h2
                  id={`lesson-title-${lesson._id}`}
                  className="text-lg md:text-xl font-semibold text-blue-600 mb-1"
                >
                  {lesson.title}
                </h2>

                {/* Subject & Grade */}
                <p className="text-sm md:text-base text-gray-500">
                  {lesson.subject} • Grade {lesson.grade}
                </p>

                {/* Notes */}
                <p className="text-sm md:text-base text-gray-700 mt-2 line-clamp-2 overflow-hidden">
                  {lesson.notes}
                </p>

                {/* Progress */}
                {progress && (
                  <div className="mt-4">
                    <p className="text-xs md:text-sm text-gray-500 mb-1">
                      Status: {progress.status}
                    </p>
                    <div
                      className="w-full bg-gray-200 rounded-full h-2"
                      role="progressbar"
                      aria-valuenow={progress.score || 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className={`h-2 rounded-full ${
                          progress.status === "completed"
                            ? "bg-blue-600 w-full"
                            : progress.status === "in-progress"
                            ? "bg-blue-400 w-1/2"
                            : "bg-gray-400 w-0"
                        }`}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Badge */}
                {progress?.badgeEarned && (
                  <span className="inline-block mt-3 px-2 py-1 text-xs md:text-sm font-medium rounded bg-green-100 text-green-700">
                    {progress.badgeEarned}
                  </span>
                )}

                {/* Score */}
                {progress?.score !== undefined && (
                  <p className="mt-2 text-sm md:text-base text-green-600">
                    Score: {progress.score}%
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChildLessons;

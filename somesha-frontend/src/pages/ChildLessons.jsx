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
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto"></div>
        <p className="mt-3 text-gray-600">Loading your lessons...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-2 text-blue-700">My Lessons</h1>
      <p className="text-sm text-gray-600 mb-6">
        Admission #: {user.admissionNumber}
      </p>

      {assignedLessons.length === 0 ? (
        <p className="text-gray-600">No lessons assigned yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignedLessons.map((lesson) => {
            const progress = progressEntries.find(
              (p) => p.lesson?._id === lesson._id
            );

            return (
              <div
                key={lesson._id}
                className="bg-white shadow-md border border-green-200 rounded-lg p-6 transform transition hover:scale-105 hover:shadow-xl"
              >
                {/* Lesson Header */}
                <h2 className="text-lg font-semibold text-blue-600 mb-1">
                  {lesson.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {lesson.subject} • Grade {lesson.grade}
                </p>

                {/* Notes */}
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                  {lesson.notes}
                </p>

                {/* Progress */}
                {progress && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-1">
                      Status: {progress.status}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
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
                  <span className="inline-block mt-3 px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                    {progress.badgeEarned}
                  </span>
                )}

                {/* Score */}
                {progress?.score !== undefined && (
                  <p className="mt-2 text-sm text-green-600">
                    Score: {progress.score}%
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChildLessons;
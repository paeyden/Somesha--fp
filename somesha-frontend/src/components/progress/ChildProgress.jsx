import React, { useEffect, useState } from "react";
import { getProgressByChild } from "../../services/api"; // API client

const ChildProgress = ({ childId }) => {
  const [progressEntries, setProgressEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await getProgressByChild(childId);
        setProgressEntries(data);
      } catch (err) {
        console.error("Error fetching child progress:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [childId]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto"></div>
        <p className="mt-3 text-gray-600">Loading child progress...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">
        Child Progress Overview
      </h1>

      {progressEntries.length === 0 ? (
        <p className="text-gray-600">No progress tracked yet for this child.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {progressEntries.map((entry) => (
            <div
              key={entry._id}
              className="bg-white shadow-md border border-green-200 rounded-lg p-6 transform transition hover:scale-105 hover:shadow-xl"
            >
              {/* Header */}
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-blue-600">
                  {entry.lesson?.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {entry.course?.title} • {entry.course?.subject}
                </p>
              </div>

              <hr className="my-2" />

              {/* Progress Bar */}
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">
                  Status: {entry.status}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      entry.status === "completed"
                        ? "bg-blue-600 w-full"
                        : entry.status === "in-progress"
                        ? "bg-blue-400 w-1/2"
                        : "bg-gray-400 w-0"
                    }`}
                  ></div>
                </div>
              </div>

              {/* Badge for achievements */}
              {entry.badgeEarned && (
                <span className="inline-block mt-3 px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                  {entry.badgeEarned}
                </span>
              )}

              {/* Score */}
              {entry.score !== undefined && (
                <p className="mt-2 text-sm text-green-600">
                  Score: {entry.score}%
                </p>
              )}

              {/* Tutor Feedback */}
              {entry.feedback && (
                <p className="mt-2 text-xs text-gray-600 italic">
                  Feedback: {entry.feedback}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChildProgress;
import React, { useEffect, useState } from "react";
import { getAllTutors } from "../../services/api";

const TutorList = () => {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await getAllTutors();
        setTutors(res.data || []);
      } catch (err) {
        console.error("Error fetching tutors:", err);
      }
    };

    fetchTutors();
  }, []);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-6 text-center">
        Available Tutors
      </h2>

      {tutors.length === 0 ? (
        <p className="text-gray-600 text-center">No tutors available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tutors.map((tutor) => (
            <div
              key={tutor._id}
              className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition transform hover:scale-105"
              role="region"
              aria-label={`Tutor card for ${tutor.user?.name || "Unnamed Tutor"}`}
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {tutor.user?.name || "Unnamed Tutor"}
              </h3>

              <p className="text-sm mt-1 text-gray-600">
                Status:{" "}
                <span
                  className={
                    tutor.status === "active" ? "text-green-600" : "text-yellow-600"
                  }
                  aria-label={`Tutor status: ${tutor.status}`}
                >
                  {tutor.status}
                </span>
              </p>

              <p className="text-sm text-gray-600 mt-2">
                <strong>Subjects:</strong>{" "}
                <span aria-label={`Subjects taught: ${tutor.subjects?.join(", ") || "Not listed"}`}>
                  {tutor.subjects?.length ? tutor.subjects.join(", ") : "Not listed"}
                </span>
              </p>

              <p className="text-sm text-gray-600 mt-1">
                <strong>Grades:</strong>{" "}
                <span aria-label={`Grades: ${tutor.grades?.join(", ") || "Not listed"}`}>
                  {tutor.grades?.length ? tutor.grades.join(", ") : "Not listed"}
                </span>
              </p>

              <p
                className="text-sm text-gray-600 mt-2 line-clamp-4"
                aria-label={tutor.bio ? `Bio: ${tutor.bio}` : "No bio provided"}
              >
                {tutor.bio || "No bio provided."}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorList;

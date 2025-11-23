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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-blue-600 mb-4">Available Tutors</h2>

      {tutors.length === 0 ? (
        <p className="text-gray-600">No tutors available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tutors.map((tutor) => (
            <div
              key={tutor._id}
              className="border border-gray-300 rounded-lg p-4 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {tutor.user?.name || "Unnamed Tutor"}
              </h3>

              <p className="text-sm text-gray-600">
                Status:{" "}
                <span
                  className={
                    tutor.status === "active"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {tutor.status}
                </span>
              </p>

              <p className="text-sm text-gray-600 mt-2">
                <strong>Subjects:</strong>{" "}
                {tutor.subjects?.length
                  ? tutor.subjects.join(", ")
                  : "Not listed"}
              </p>

              <p className="text-sm text-gray-600">
                <strong>Grades:</strong>{" "}
                {tutor.grades?.length ? tutor.grades.join(", ") : "Not listed"}
              </p>

              <p className="text-sm text-gray-600 mt-2">
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

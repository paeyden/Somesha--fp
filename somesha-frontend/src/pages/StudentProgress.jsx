import React, { useState, useEffect } from "react";
import { getProgressByChild } from "../services/api"; // backend endpoint

const TutorStudentProgress = () => {
  const [students, setStudents] = useState([]);
  const [grade, setGrade] = useState("7");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      try {
        const { data } = await getProgressByChild(grade); // API returns array of students + progress
        setStudents(data);
      } catch (err) {
        console.error("Error fetching student progress:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [grade]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Student Progress</h1>
        <p className="text-gray-600">Monitor how your students are performing in lessons.</p>
      </header>

      {/* Grade Filter */}
      <div className="mb-6">
        <label htmlFor="grade-select" className="mr-2 font-medium">
          Grade:
        </label>
        <select
          id="grade-select"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="border px-3 py-2 rounded focus:ring focus:ring-blue-300"
          aria-label="Select grade to filter students"
        >
          <option value="7">Grade 7</option>
          <option value="8">Grade 8</option>
          <option value="9">Grade 9</option>
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto"
            aria-label="Loading student progress"
          ></div>
          <p className="mt-3 text-gray-600">Loading student progress...</p>
        </div>
      ) : (
        <section
          aria-labelledby="student-progress-heading"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <h2 id="student-progress-heading" className="sr-only">
            Student Progress List
          </h2>

          {students.length === 0 ? (
            <p className="text-gray-600 col-span-full">No students found for this grade.</p>
          ) : (
            students.map((student) => (
              <article
                key={student._id}
                role="region"
                aria-label={`Progress for ${student.name}, Grade ${student.grade}`}
                tabIndex={0}
                className="bg-white shadow rounded-lg p-4 md:p-6 border hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <h3 className="text-lg md:text-xl font-bold text-blue-600">{student.name}</h3>
                <p className="text-sm text-gray-600 mb-2">Grade {student.grade}</p>

                <div className="space-y-1">
                  <p className="text-sm">
                    Completed Lessons: <span className="font-medium">{student.completedLessons}</span>
                  </p>
                  <p className="text-sm">
                    Upcoming Lessons: <span className="font-medium">{student.upcomingLessons}</span>
                  </p>
                  <p className="text-sm">
                    Average Score: <span className="font-medium text-green-600">{student.averageScore}%</span>
                  </p>
                </div>

                {/* Progress bar */}
                <div
                  className="mt-3 bg-gray-200 rounded-full h-3"
                  role="progressbar"
                  aria-valuenow={student.averageScore || 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Average score for ${student.name}`}
                >
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${student.averageScore}%` }}
                  ></div>
                </div>
              </article>
            ))
          )}
        </section>
      )}
    </div>
  );
};

export default TutorStudentProgress;

import React, { useState, useEffect } from "react";
import { getProgressByChild } from "../services/api"; // backend endpoint

const TutorStudentProgress = () => {
  const [students, setStudents] = useState([]);
  const [grade, setGrade] = useState("7");

  useEffect(() => {
    const fetchProgress = async () => {
      const { data } = await getProgressByChild(grade); // API returns array of students + progress
      setStudents(data);
    };
    fetchProgress();
  }, [grade]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Student Progress</h1>
        <p className="text-gray-600">Monitor how your students are performing in lessons.</p>
      </header>

      {/* Filter */}
      <div className="mb-6">
        <label className="mr-2 font-medium">Grade:</label>
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="border px-3 py-2 rounded focus:ring focus:ring-blue-300"
        >
          <option value="7">Grade 7</option>
          <option value="8">Grade 8</option>
          <option value="9">Grade 9</option>
        </select>
      </div>

      {/* Student Progress Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {students.map((student) => (
          <div
            key={student._id}
            className="bg-white shadow rounded-lg p-4 border hover:shadow-lg transition"
          >
            <h4 className="text-lg font-bold text-blue-600">{student.name}</h4>
            <p className="text-sm text-gray-600">Grade {student.grade}</p>

            <div className="mt-2">
              <p className="text-sm">
                Completed Lessons: <span className="font-medium">{student.completedLessons}</span>
              </p>
              <p className="text-sm">
                Upcoming Lessons: <span className="font-medium">{student.upcomingLessons}</span>
              </p>
              <p className="text-sm">
                Average Score:{" "}
                <span className="font-medium text-green-600">{student.averageScore}%</span>
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-3 bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${student.averageScore}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorStudentProgress;
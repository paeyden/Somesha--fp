import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import AssignedLessons from "../components/lessons/AssignedLessons";
import MyProgress from "../components/progress/MyProgress";
import BadgeBoard from "../components/BadgeBoard";

const ChildDashboard = ({ childId }) => {
  return (
    <DashboardLayout role="child">
      {/* Page heading */}
      <h1 className="text-3xl font-bold mb-8 text-blue-700">
        My Dashboard
      </h1>

      {/* Main grid: lessons + progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-600 mb-3">
            Assigned Lessons
          </h2>
          <AssignedLessons childId={childId} />
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-600 mb-3">
            My Progress
          </h2>
          <MyProgress childId={childId} />
        </div>
      </div>

      {/* Badges section */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-600 mb-3">
          Badges Earned
        </h2>
        <BadgeBoard childId={childId} />
      </div>
    </DashboardLayout>
  );
};

export default ChildDashboard;
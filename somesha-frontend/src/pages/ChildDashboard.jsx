import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import AssignedLessons from "../components/lessons/AssignedLessons";
import MyProgress from "../components/progress/MyProgress";
import BadgeBoard from "../components/BadgeBoard";

const ChildDashboard = ({ childId }) => {
  return (
    <DashboardLayout role="child">
      {/* Page heading */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">
          My Dashboard
        </h1>
      </header>

      {/* Main grid: lessons + progress */}
      <section
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
        aria-label="Assigned lessons and progress overview"
      >
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-600 mb-3">
            Assigned Lessons
          </h2>
          <AssignedLessons childId={childId} />
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-600 mb-3">
            My Progress
          </h2>
          <MyProgress childId={childId} />
        </div>
      </section>

      {/* Badges section */}
      <section
        className="mt-6 sm:mt-8 bg-white shadow-md rounded-lg p-4 sm:p-6"
        aria-label="Earned badges"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-blue-600 mb-3">
          Badges Earned
        </h2>
        <BadgeBoard childId={childId} />
      </section>
    </DashboardLayout>
  );
};

export default ChildDashboard;

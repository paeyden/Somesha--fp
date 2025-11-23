import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ChildLessons from "./ChildLessons";
import TutorList from "../components/tutors/TutorList";
import BookingManager from "../components/bookings/BookingManager";
import EnrollmentManager from "@/components/EnrollmentManager";
import AddChildToParent from "@/components/AddChildToParent";
import { getUserProfile } from "../services/api";

const ParentDashboard = () => {
  const [children, setChildren] = useState([]);

  const fetchChildren = async () => {
    try {
      const res = await getUserProfile(); // parent profile includes children
      setChildren(res.data.children || []);
    } catch (err) {
      console.error("Error fetching children:", err);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  return (
    <DashboardLayout role="parent">
      <h1 className="text-2xl font-bold mb-6">Parent Dashboard</h1>

      {/* Children Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.length === 0 ? (
          <p className="text-gray-600">No children linked to your account yet.</p>
        ) : (
          children.map((child) => (
            <div
              key={child._id}
              className="bg-white shadow-md rounded-lg p-4"
            >
              <h2 className="text-lg font-semibold text-blue-600 mb-2">
                {child.name} • Admission #: {child.admissionNumber}
              </h2>
              <p className="text-sm text-gray-600 mb-3">Grade {child.grade}</p>

              {/* Render lessons + progress for this child */}
              <ChildLessons childId={child._id} />
            </div>
          ))
        )}
      </div>

      {/* Tutor List */}
      <div className="mt-6">
        <TutorList />
      </div>

      {/* Booking Manager */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-600 mb-3">
          Book a Tutor & Course
        </h2>
        <BookingManager />
      </div>

      {/* Add Child Section */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-600 mb-3">
          Link a Child
        </h2>
        <AddChildToParent onChildAdded={fetchChildren} />
      </div>

      {/* Enrollment Manager */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-600 mb-3">
          Enroll Your Child
        </h2>
        <EnrollmentManager role="parent" />
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;

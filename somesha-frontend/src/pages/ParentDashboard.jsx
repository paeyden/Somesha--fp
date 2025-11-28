import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ChildLessons from "./ChildLessons";
import TutorList from "../components/tutors/TutorList";
import BookingManager from "../components/bookings/BookingManager";
import EnrollmentManager from "@/components/EnrollmentManager";
import AddChildToParent from "@/components/AddChildToParent";
import { getUserProfile } from "../services/api";

// Reusable card component
const Card = ({ title, children }) => (
  <div className="bg-white shadow-md rounded-lg p-4">
    {title && <h2 className="text-lg font-semibold text-blue-600 mb-3">{title}</h2>}
    {children}
  </div>
);

const ParentDashboard = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const res = await getUserProfile(); // parent profile includes children
      setChildren(res.data.children || []);
    } catch (err) {
      console.error("Error fetching children:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  return (
    <DashboardLayout role="parent">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Parent Dashboard</h1>

      <div className="space-y-6">
        {/* Children Progress Section */}
        {loading ? (
          <p className="text-gray-600">Loading children...</p>
        ) : children.length === 0 ? (
          <p className="text-gray-600">
            No children linked to your account yet.{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => document.getElementById("add-child-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              Add a child
            </span>
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children.map((child) => (
              <Card
                key={child._id}
                title={`${child.name} • Admission #: ${child.admissionNumber}`}
              >
                <p className="text-sm text-gray-600 mb-3">Grade {child.grade}</p>
                <ChildLessons childId={child._id} />
              </Card>
            ))}
          </div>
        )}

        {/* Tutor List */}
        <Card title="Available Tutors">
          <TutorList />
        </Card>

        {/* Booking Manager */}
        <Card title="Book a Tutor & Course">
          <BookingManager />
        </Card>

        {/* Add Child Section */}
        <Card title="Link a Child" id="add-child-section">
          <AddChildToParent onChildAdded={fetchChildren} />
        </Card>

        {/* Enrollment Manager */}
        <Card title="Enroll Your Child">
          <EnrollmentManager role="parent" />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;

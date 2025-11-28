import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main role="main" className="flex-1 bg-gray-100 px-4 py-6 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

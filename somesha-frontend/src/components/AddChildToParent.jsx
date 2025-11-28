import React, { useEffect, useState } from "react";
import { getUserProfile, addParentToChild } from "../services/api";

const AddChildToParent = () => {
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [manualEntry, setManualEntry] = useState(false);
  const [admissionNumber, setAdmissionNumber] = useState("");

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await getUserProfile(); // fetch parent profile with children
        setChildren(res.data.children || []);
      } catch (err) {
        console.error("Error fetching children:", err);
      }
    };
    fetchChildren();
  }, []);

  const handleSubmit = async () => {
    try {
      const payload = manualEntry
        ? { admissionNumber }
        : { childId: selectedChildId };

      await addParentToChild(payload);
      alert("Child successfully linked to your account!");

      const res = await getUserProfile();
      setChildren(res.data.children || []);

      setSelectedChildId("");
      setAdmissionNumber("");
      setManualEntry(false);
    } catch (err) {
      alert("Error linking child: " + err.message);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mt-6">
      <h3 className="text-xl font-semibold text-blue-600 mb-4 text-center">
        Link a Child to Your Account
      </h3>

      {/* Dropdown selection */}
      {!manualEntry && (
        <>
          <label htmlFor="child-select" className="sr-only">
            Select a child
          </label>
          <select
            id="child-select"
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select a child from your account"
          >
            <option value="">Select a child</option>
            {children.map((child) => (
              <option key={child._id} value={child._id}>
                {child.name} ({child.admissionNumber})
              </option>
            ))}
          </select>
          <p
            className="text-sm text-blue-500 cursor-pointer underline"
            onClick={() => setManualEntry(true)}
            aria-label="Switch to manual entry for admission number"
          >
            Can’t find your child? Enter admission number
          </p>
        </>
      )}

      {/* Manual entry */}
      {manualEntry && (
        <>
          <label htmlFor="admission-number" className="sr-only">
            Enter child admission number
          </label>
          <input
            id="admission-number"
            type="text"
            placeholder="Enter child admission number"
            value={admissionNumber}
            onChange={(e) => setAdmissionNumber(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Enter child admission number manually"
          />
          <p
            className="text-sm text-blue-500 cursor-pointer underline"
            onClick={() => setManualEntry(false)}
            aria-label="Go back to child dropdown"
          >
            Go back to child dropdown
          </p>
        </>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selectedChildId && !admissionNumber}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-4 transition-colors disabled:opacity-50"
        aria-disabled={!selectedChildId && !admissionNumber}
        aria-label="Link child to your account"
      >
        Link Child
      </button>
    </div>
  );
};

export default AddChildToParent;

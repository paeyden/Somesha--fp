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
      // Build payload depending on selection or manual entry
      const payload = manualEntry
        ? { admissionNumber }
        : { childId: selectedChildId };

      await addParentToChild(payload);
      alert("Child successfully linked to your account!");
      // Optionally, refresh children list
      const res = await getUserProfile();
      setChildren(res.data.children || []);
      // Reset form
      setSelectedChildId("");
      setAdmissionNumber("");
      setManualEntry(false);
    } catch (err) {
      alert("Error linking child: " + err.message);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-blue-600 mb-3">
        Link a Child to Your Account
      </h3>

      {/* Dropdown */}
      {!manualEntry && (
        <>
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          >
            Can’t find your child? Enter admission number
          </p>
        </>
      )}

      {/* Manual entry */}
      {manualEntry && (
        <>
          <input
            type="text"
            placeholder="Enter child admission number"
            value={admissionNumber}
            onChange={(e) => setAdmissionNumber(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p
            className="text-sm text-blue-500 cursor-pointer underline"
            onClick={() => setManualEntry(false)}
          >
            Go back to child dropdown
          </p>
        </>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selectedChildId && !admissionNumber}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-4 transition-colors disabled:opacity-50"
      >
        Link Child
      </button>
    </div>
  );
};

export default AddChildToParent;

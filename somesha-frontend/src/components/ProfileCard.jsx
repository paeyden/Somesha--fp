import React from "react";

const ProfileCard = ({ role, name, email, admissionNumber, verified }) => {
  return (
    <section
      className="bg-white p-4 rounded shadow max-w-sm mx-auto"
      aria-labelledby="profile-card-title"
      role="region"
    >
      <h2 id="profile-card-title" className="text-lg font-bold mb-2">
        Profile
      </h2>

      <ul className="space-y-1 text-gray-700">
        {name && <li><strong>Name:</strong> {name}</li>}
        {email && <li><strong>Email:</strong> {email}</li>}
        {role && <li><strong>Role:</strong> {role}</li>}
        {admissionNumber && <li><strong>Admission #:</strong> {admissionNumber}</li>}
        {verified !== undefined && (
          <li>
            <strong>Status:</strong>{" "}
            <span
              className={verified ? "text-green-600" : "text-yellow-600"}
              aria-label={verified ? "Verified" : "Not Verified"}
            >
              {verified ? "Verified" : "Not Verified"}
            </span>
          </li>
        )}
      </ul>

      <p className="mt-2 text-sm text-gray-500">
        Your verification status and other details will appear here.
      </p>
    </section>
  );
};

export default ProfileCard;

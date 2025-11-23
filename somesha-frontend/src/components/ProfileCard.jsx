import React from "react";

const ProfileCard = ({ role }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Profile</h2>
      <p>Role: {role}</p>
      <p>Your verification status and details will show here.</p>
    </div>
  );
};

export default ProfileCard;
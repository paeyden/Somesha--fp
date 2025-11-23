import React from "react";

const NotificationsPanel = ({ role }) => {
  // Mock notifications for now
  const mockNotifications = [
    { id: 1, message: "Welcome to your dashboard!", time: "Just now" },
    { id: 2, message: "New lesson created successfully.", time: "5 mins ago" },
    { id: 3, message: "System update scheduled for tomorrow.", time: "1 hr ago" },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Notifications</h2>
      <ul className="space-y-2">
        {mockNotifications.map((n) => (
          <li key={n.id} className="border-b pb-1">
            <p>{n.message}</p>
            <span className="text-xs text-gray-500">{n.time}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-400 mt-2">
        (Real-time notifications will appear here once implemented.)
      </p>
    </div>
  );
};

export default NotificationsPanel;
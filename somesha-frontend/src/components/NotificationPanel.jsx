import React from "react";
import { BellIcon } from "@heroicons/react/24/outline"; // Using Heroicons

const NotificationsPanel = ({ role }) => {
  // Mock notifications with read/unread status
  const mockNotifications = [
    { id: 1, message: "Welcome to your dashboard!", time: "Just now", unread: true },
    { id: 2, message: "New lesson created successfully.", time: "5 mins ago", unread: true },
    { id: 3, message: "System update scheduled for tomorrow.", time: "1 hr ago", unread: false },
    { id: 4, message: "Your profile has been updated.", time: "2 hrs ago", unread: false },
    { id: 5, message: "New tutor verified.", time: "1 day ago", unread: false },
  ];

  return (
    <section
      className="bg-white p-4 rounded shadow max-w-md mx-auto h-96 overflow-y-auto"
      aria-labelledby="notifications-title"
      role="region"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 id="notifications-title" className="text-lg font-bold">
          Notifications
        </h2>
        {/* Unread badge */}
        {mockNotifications.some((n) => n.unread) && (
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {mockNotifications.filter((n) => n.unread).length} New
          </span>
        )}
      </div>

      {mockNotifications.length > 0 ? (
        <ul className="space-y-2">
          {mockNotifications.map((n) => (
            <li
              key={n.id}
              className={`flex items-start gap-2 p-2 border-b last:border-b-0 rounded transition ${
                n.unread ? "bg-blue-50" : "bg-white"
              }`}
              role="listitem"
              aria-label={`Notification: ${n.message}, received ${n.time}, ${n.unread ? "unread" : "read"}`}
            >
              <BellIcon
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  n.unread ? "text-blue-600" : "text-gray-400"
                }`}
                aria-hidden="true"
              />
              <div>
                <p className="text-gray-800">{n.message}</p>
                <time className="text-xs text-gray-500">{n.time}</time>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No notifications yet.</p>
      )}

      <p className="text-sm text-gray-400 mt-2">
        (Real-time notifications will appear here once implemented.)
      </p>
    </section>
  );
};

export default NotificationsPanel;

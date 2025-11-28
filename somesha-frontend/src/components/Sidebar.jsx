import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ArrowRightIcon as LoginIcon,
  UserPlusIcon as UserAddIcon,
  Squares2X2Icon as DashboardIcon,
  UserCircleIcon as ProfileIcon,
  BookOpenIcon as LessonsIcon,
  ChartBarIcon as StatsIcon,
  UserGroupIcon as UsersIcon,
  CheckBadgeIcon as VerifyIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // mobile toggle
  const [collapsed, setCollapsed] = useState(false); // desktop toggle

  const storedUser = localStorage.getItem("someshaUser");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = user?.token;
  const role = user?.role;

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const toggleCollapsed = () => setCollapsed((prev) => !prev);

  const MenuButton = ({ onClick, label, Icon }) => (
    <button
      onClick={onClick}
      className="flex items-center w-full text-left px-2 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
      role="menuitem"
      aria-label={label}
    >
      {Icon && <Icon className="h-5 w-5 mr-2" />}
      {!collapsed && label}
    </button>
  );

  const menuItems = !token
    ? [
        { label: "Home", path: "/", Icon: HomeIcon },
        { label: "Login", path: "/login", Icon: LoginIcon },
        { label: "Register", path: "/register", Icon: UserAddIcon },
      ]
    : role === "parent"
    ? [
        { label: "Dashboard", path: "/parent", Icon: DashboardIcon },
        { label: "Profile", path: "/profile", Icon: ProfileIcon },
      ]
    : role === "tutor"
    ? [
        { label: "Dashboard", path: "/tutor", Icon: DashboardIcon },
        { label: "Lessons", path: "/tutor/lessons", Icon: LessonsIcon },
        { label: "Student Progress", path: "/tutor/student-progress", Icon: StatsIcon },
        { label: "Profile", path: "/profile", Icon: ProfileIcon },
      ]
    : role === "child"
    ? [
        { label: "Dashboard", path: "/child", Icon: DashboardIcon },
        { label: "Assigned Lessons", path: "/child/lessons", Icon: LessonsIcon },
        { label: "Profile", path: "/profile", Icon: ProfileIcon },
      ]
    : role === "admin"
    ? [
        { label: "Dashboard", path: "/admin-dashboard", Icon: DashboardIcon },
        { label: "Manage Users", path: "/admin/users", Icon: UsersIcon },
        { label: "Verify Tutors", path: "/admin/unverified-tutors", Icon: VerifyIcon },
        { label: "System Stats", path: "/system-stats", Icon: StatsIcon },
        { label: "Profile", path: "/profile", Icon: ProfileIcon },
      ]
    : [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 sm:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="sm:hidden fixed top-4 left-4 z-40 p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-white"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
        aria-controls="main-sidebar"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <aside
        id="main-sidebar"
        className={`
          fixed top-0 left-0 h-full bg-gray-800 text-white z-40
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0
          ${collapsed ? "w-20" : "w-64"}
        `}
        role="navigation"
        aria-label="Main sidebar"
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4">
          <h2 className={`text-xl font-semibold ${collapsed ? "hidden" : ""}`}>Somesha</h2>
          <button
            className="hidden sm:block p-1 hover:bg-gray-700 rounded"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        {/* Menu */}
        <ul className="space-y-2" role="menu">
          {menuItems.map((item, i) => (
            <li key={i}>
              <MenuButton
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                label={item.label}
                Icon={item.Icon}
              />
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;

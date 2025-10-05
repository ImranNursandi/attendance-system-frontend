// src/components/Layout/Sidebar.js
import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { role, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Menu configuration
  const menuConfig = {
    // Common menus for all roles
    common: [
      {
        path: "/",
        icon: "🏠",
        label: "Dashboard",
        description: "Overview and quick stats",
      },
      {
        path: "/profile",
        icon: "👤",
        label: "My Profile",
        description: "View and update profile",
      },
      {
        path: "/attendance/clock-in",
        icon: "⏰",
        label: "Clock In/Out",
        description: "Record your attendance",
      },
      {
        path: "/my-attendance",
        icon: "📅",
        label: "My Attendance",
        description: "View your attendance history",
      },
    ],

    // Manager & Admin menus
    management: [
      {
        path: "/employees",
        icon: "👥",
        label: "Employees",
        description: "Manage team members",
        roles: ["admin", "manager"],
      },
      {
        path: "/attendance/log",
        icon: "📊",
        label: "Attendance Log",
        description: "View team attendance",
        roles: ["admin", "manager"],
      },
    ],

    // Admin only menus
    admin: [
      {
        path: "/departments",
        icon: "🏢",
        label: "Departments",
        description: "Manage departments",
      },
      {
        path: "/admin/dashboard",
        icon: "⚙️",
        label: "Admin Panel",
        description: "System administration",
      },
    ],

    // Manager only menus
    manager: [
      {
        path: "/manager/dashboard",
        icon: "📈",
        label: "Manager Panel",
        description: "Team management",
      },
    ],
  };

  // Get menu items based on user role
  const getMenuItems = () => {
    let items = [...menuConfig.common];

    // Add management items for managers and admins
    if (["admin", "manager"].includes(role)) {
      items = items.concat(
        menuConfig.management.filter(
          (item) => !item.roles || item.roles.includes(role)
        )
      );
    }

    // Add role-specific items
    if (role === "admin") {
      items = items.concat(menuConfig.admin);
    } else if (role === "manager") {
      items = items.concat(menuConfig.manager);
    }

    return items;
  };

  const menuItems = getMenuItems();

  if (!sidebarOpen) return null;

  return (
    <div className="w-64 bg-base-200 h-full shadow-xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-base-300">
        <h2 className="text-xl font-bold text-center">Navigation</h2>
        <div className="flex flex-col items-center mt-3 space-y-2">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center text-lg font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-sm">
              {user?.username || "User"}
            </div>
            <div className="text-xs opacity-75 truncate max-w-[180px]">
              {user?.email}
            </div>
            <div className="mt-1">
              <span
                className={`badge badge-sm ${
                  role === "admin"
                    ? "badge-primary"
                    : role === "manager"
                    ? "badge-secondary"
                    : "badge-accent"
                }`}
              >
                {role?.toUpperCase() || "USER"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all group ${
                  location.pathname === item.path
                    ? "bg-primary text-primary-content shadow-lg"
                    : "hover:bg-base-300 hover:shadow-md"
                }`}
                title={item.description}
              >
                <span className="text-xl transition-transform group-hover:scale-110">
                  {item.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.label}</div>
                  {item.description && (
                    <div className="text-xs opacity-75 truncate">
                      {item.description}
                    </div>
                  )}
                </div>
                {location.pathname === item.path && (
                  <div className="w-2 h-2 bg-primary-content rounded-full"></div>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Settings Section */}
        <div className="mt-8 pt-4 border-t border-base-300">
          <Link
            to="/change-password"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all group ${
              location.pathname === "/change-password"
                ? "bg-info text-info-content"
                : "hover:bg-base-300"
            }`}
          >
            <span className="text-xl">🔒</span>
            <span className="font-medium">Change Password</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;

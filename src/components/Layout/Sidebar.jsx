// src/components/Layout/Sidebar.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";

const Sidebar = () => {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { role, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  // Menu configuration
  const menuConfig = {
    // Common menus for all roles
    common: [
      {
        path: "/",
        icon: "🏠",
        label: "Dashboard",
        description: "Overview and quick stats",
        gradient: "from-blue-500 to-blue-600",
      },
      {
        path: "/profile",
        icon: "👤",
        label: "My Profile",
        description: "View and update profile",
        gradient: "from-purple-500 to-purple-600",
      },
      {
        path: "/attendance/clock-in",
        icon: "⏰",
        label: "Clock In/Out",
        description: "Record your attendance",
        gradient: "from-green-500 to-green-600",
      },
      {
        path: "/my-attendance",
        icon: "📅",
        label: "My Attendance",
        description: "View your attendance history",
        gradient: "from-orange-500 to-orange-600",
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
        gradient: "from-cyan-500 to-cyan-600",
      },
      {
        path: "/attendance/log",
        icon: "📊",
        label: "Attendance Log",
        description: "View team attendance",
        roles: ["admin", "manager"],
        gradient: "from-indigo-500 to-indigo-600",
      },
    ],

    // Admin only menus
    admin: [
      {
        path: "/departments",
        icon: "🏢",
        label: "Departments",
        description: "Manage departments",
        gradient: "from-violet-500 to-violet-600",
      },
      {
        path: "/admin/dashboard",
        icon: "⚙️",
        label: "Admin Panel",
        description: "System administration",
        gradient: "from-red-500 to-red-600",
      },
    ],

    // Manager only menus
    manager: [
      {
        path: "/manager/dashboard",
        icon: "📈",
        label: "Manager Panel",
        description: "Team management",
        gradient: "from-pink-500 to-pink-600",
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
    <div className="w-80 bg-gradient-to-b from-gray-900 to-gray-800 h-full shadow-2xl border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
            Navigation Menu
          </h2>
        </div>

        {/* User Profile Card */}
        <div className="bg-gray-800/80 rounded-2xl p-4 border border-gray-700 hover:border-gray-600 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-sm truncate">
                {user?.username || "User"}
              </div>
              <div className="text-xs text-gray-400 truncate mt-1">
                {user?.email}
              </div>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    role === "admin"
                      ? "bg-red-900/50 text-red-300 border-red-800/50"
                      : role === "manager"
                      ? "bg-purple-900/50 text-purple-300 border-purple-800/50"
                      : "bg-blue-900/50 text-blue-300 border-blue-800/50"
                  }`}
                >
                  {role?.toUpperCase() || "USER"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-6 space-y-2">
        {/* Main Navigation */}
        <div className="space-y-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group relative overflow-hidden ${
                  isActive
                    ? `bg-gradient-to-r ${item.gradient} shadow-lg shadow-blue-500/25 text-white`
                    : "bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white border border-transparent hover:border-gray-600"
                }`}
                title={item.description}
              >
                {/* Background gradient for active state */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                )}

                {/* Icon with gradient background */}
                <div
                  className={`p-3 rounded-xl transition-all duration-200 group-hover:scale-110 z-10 ${
                    isActive
                      ? "bg-white/20 backdrop-blur-sm"
                      : `bg-gradient-to-r ${item.gradient} shadow-md`
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0 z-10">
                  <div
                    className={`font-semibold transition-colors ${
                      isActive ? "text-white" : "group-hover:text-gray-100"
                    }`}
                  >
                    {item.label}
                  </div>
                  {item.description && (
                    <div
                      className={`text-xs transition-colors ${
                        isActive
                          ? "text-white/80"
                          : "text-gray-500 group-hover:text-gray-400"
                      }`}
                    >
                      {item.description}
                    </div>
                  )}
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full z-10"></div>
                )}

                {/* Hover arrow */}
                {!isActive && (
                  <div className="text-gray-500 group-hover:text-gray-300 transition-colors z-10 opacity-0 group-hover:opacity-100">
                    →
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-700"></div>

        {/* Settings Section */}
        <div className="space-y-3">
          <Link
            to="/change-password"
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group ${
              location.pathname === "/change-password"
                ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25"
                : "bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white border border-transparent hover:border-gray-600"
            }`}
          >
            <div
              className={`p-3 rounded-xl transition-all duration-200 group-hover:scale-110 ${
                location.pathname === "/change-password"
                  ? "bg-white/20 backdrop-blur-sm"
                  : "bg-gradient-to-r from-cyan-500 to-cyan-600 shadow-md"
              }`}
            >
              <span className="text-xl">🔒</span>
            </div>
            <div className="flex-1">
              <div
                className={`font-semibold ${
                  location.pathname === "/change-password"
                    ? "text-white"
                    : "group-hover:text-gray-100"
                }`}
              >
                Change Password
              </div>
              <div
                className={`text-xs ${
                  location.pathname === "/change-password"
                    ? "text-white/80"
                    : "text-gray-500 group-hover:text-gray-400"
                }`}
              >
                Update your account security
              </div>
            </div>
            {location.pathname === "/change-password" ? (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            ) : (
              <div className="text-gray-500 group-hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100">
                →
              </div>
            )}
          </Link>

          {/* Logout Button */}
          <button
            onClick={() => {
              handleLogout;
            }}
            className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group w-full bg-gray-800/50 hover:bg-red-900/50 text-gray-300 hover:text-white border border-transparent hover:border-red-800/50"
          >
            <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 shadow-md group-hover:scale-110 transition-transform duration-200">
              <span className="text-xl">🚪</span>
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold group-hover:text-red-100">
                Logout
              </div>
              <div className="text-xs text-gray-500 group-hover:text-red-300/80">
                Sign out of your account
              </div>
            </div>
            <div className="text-gray-500 group-hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100">
              →
            </div>
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 bg-gray-800/50">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">System Status</div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

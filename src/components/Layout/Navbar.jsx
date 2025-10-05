// src/components/Layout/Navbar.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { toggleSidebar } from "../../store/slices/uiSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Role badge configuration
  const getRoleConfig = (role) => {
    const config = {
      admin: {
        gradient: "from-red-500 to-red-600",
        bgColor: "bg-red-900/50",
        borderColor: "border-red-800/50",
        textColor: "text-red-300",
      },
      manager: {
        gradient: "from-purple-500 to-purple-600",
        bgColor: "bg-purple-900/50",
        borderColor: "border-purple-800/50",
        textColor: "text-purple-300",
      },
      employee: {
        gradient: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-900/50",
        borderColor: "border-blue-800/50",
        textColor: "text-blue-300",
      },
    };
    return config[role] || config.employee;
  };

  const roleConfig = getRoleConfig(role);

  return (
    <div className="navbar bg-gradient-to-r from-gray-900 to-gray-800 shadow-2xl border-b border-gray-700 px-6 py-4">
      {/* Left Section */}
      <div className="flex-1 flex items-center gap-6">
        {/* Sidebar Toggle Button */}
        <button
          className="btn btn-ghost btn-circle hover:bg-gray-700/50 border border-gray-600 hover:border-gray-500 transition-all duration-200 group"
          onClick={() => dispatch(toggleSidebar())}
        >
          <svg
            className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">AS</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
              Attendance System
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {role === "admin" && "Administrator Panel"}
              {role === "manager" && "Management Panel"}
              {role === "employee" && "Employee Portal"}
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-none flex items-center gap-6">
        {/* Current Time */}
        <div className="hidden md:flex flex-col items-end">
          <div className="text-sm font-semibold text-gray-300">
            {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
          <div className="text-xs text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>

        {/* User Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost rounded-2xl p-2 hover:bg-gray-700/50 border border-gray-600 hover:border-gray-500 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              {/* User Info */}
              <div className="hidden sm:flex flex-col items-end">
                <div className="font-semibold text-gray-200 text-sm max-w-32 truncate">
                  {user?.username || user?.name || "User"}
                </div>
                <div className="text-xs text-gray-400 capitalize">
                  {role || "user"}
                </div>
              </div>

              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform">
                  {user?.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>

              {/* Dropdown Arrow */}
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </label>

          {/* Dropdown Menu */}
          <ul
            tabIndex={0}
            className="dropdown-content mt-3 p-4 shadow-2xl bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl border border-gray-700 w-80 space-y-3"
          >
            {/* User Header */}
            <li className="pb-3 border-b border-gray-700">
              <div className="flex items-center gap-4 p-2">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user?.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-lg truncate">
                    {user?.username || user?.name || "User"}
                  </div>
                  <div className="text-sm text-gray-400 truncate mt-1">
                    {user?.email}
                  </div>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${roleConfig.bgColor} ${roleConfig.borderColor} ${roleConfig.textColor}`}
                    >
                      {role?.toUpperCase() || "USER"}
                    </span>
                  </div>
                </div>
              </div>
            </li>

            {/* Quick Actions */}
            <li>
              <div className="grid grid-cols-2 gap-2 p-2">
                <a
                  href="/profile"
                  className="flex flex-col items-center p-3 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 hover:border-gray-500 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <span className="text-white text-sm">👤</span>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">
                    Profile
                  </span>
                </a>
                <a
                  href="/change-password"
                  className="flex flex-col items-center p-3 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 hover:border-gray-500 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <span className="text-white text-sm">🔒</span>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">
                    Security
                  </span>
                </a>
              </div>
            </li>

            {/* User Details */}
            <li className="space-y-2 p-2">
              {user?.employee_id && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-400">Employee ID</span>
                  <span className="text-sm font-mono text-blue-400 bg-blue-900/30 px-2 py-1 rounded border border-blue-800/50">
                    {user.employee_id}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-400">Status</span>
                <span className="text-sm text-green-400 bg-green-900/30 px-2 py-1 rounded border border-green-800/50">
                  Active
                </span>
              </div>
              {user?.last_login && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-400">Last Login</span>
                  <span className="text-sm text-gray-300">
                    {new Date(user.last_login).toLocaleDateString()}
                  </span>
                </div>
              )}
            </li>

            {/* Divider */}
            <li className="border-t border-gray-700 pt-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-red-900/20 hover:bg-red-900/30 border border-red-800/30 hover:border-red-700/50 text-red-300 hover:text-red-200 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white text-sm">🚪</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Logout</div>
                    <div className="text-xs text-red-400/80">
                      Sign out of your account
                    </div>
                  </div>
                </div>
                <svg
                  className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

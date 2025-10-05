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

  return (
    <div className="navbar bg-base-100 shadow-lg border-b">
      <div className="flex-1">
        <button
          className="btn btn-ghost btn-circle"
          onClick={() => dispatch(toggleSidebar())}
        >
          <svg
            className="w-5 h-5"
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
        <h1 className="text-xl font-semibold ml-4">Attendance System</h1>
      </div>
      <div className="flex-none gap-4">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
              {user?.name?.charAt(0) || "U"}
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <span className="text-sm opacity-75">{user?.name || "User"}</span>
            </li>
            <li>
              <span className="text-xs opacity-50">{user?.email || ""}</span>
            </li>
            <li>
              <span className="text-xs opacity-50 capitalize">
                {role || "user"}
              </span>
            </li>
            <li className="divider mt-0 mb-0"></li>
            <li>
              <button onClick={handleLogout} className="text-error">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

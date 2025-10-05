// src/pages/EmployeeView.js
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEmployee } from "../hooks/useEmployees";
import {
  useEmployeeAttendance,
  useAttendanceLogs,
  useTodayAttendance,
} from "../hooks/useAttendance";
import { useSelector } from "react-redux";

const EmployeeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);

  const { data: employeeResponse, isLoading: employeeLoading } =
    useEmployee(id);
  const today = new Date().toLocaleDateString("en-CA");

  // Get today's attendance
  const { data: todayAttendanceResponse } = useTodayAttendance({
    start_date: today,
    end_date: today,
  });

  // Get attendance stats for the current month
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const { data: statsResponse } = useAttendanceLogs(id, currentMonth);

  const employee = employeeResponse?.data?.data;
  const todayAttendance = todayAttendanceResponse?.data?.attendances?.[0];
  const stats = statsResponse?.data?.data;

  if (employeeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-blue-400"></div>
            <p className="text-gray-400 mt-3">Loading employee data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-4xl mx-auto flex justify-center items-center min-h-64">
          <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8 text-center">
            <div className="text-6xl mb-4 opacity-50">😕</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Employee Not Found
            </h2>
            <p className="text-gray-400 mb-6">
              The employee you're looking for doesn't exist.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/employees"
                className="btn bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white hover:from-blue-600 hover:to-purple-700"
              >
                Back to Employees
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate working duration for today
  const calculateWorkingHours = () => {
    if (!todayAttendance?.clock_in) return "N/A";

    const clockIn = new Date(todayAttendance.clock_in);
    const clockOut = todayAttendance.clock_out
      ? new Date(todayAttendance.clock_out)
      : new Date();

    const diffMs = clockOut - clockIn;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      active: {
        label: "Active",
        color: "bg-green-900/50 text-green-300 border-green-800/50",
      },
      inactive: {
        label: "Inactive",
        color: "bg-red-900/50 text-red-300 border-red-800/50",
      },
      suspended: {
        label: "Suspended",
        color: "bg-orange-900/50 text-orange-300 border-orange-800/50",
      },
    };

    const config = statusConfig[status] || {
      label: status,
      color: "bg-gray-700 text-gray-300 border-gray-600",
    };

    return (
      <span className={`badge badge-lg border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Attendance status badge
  const AttendanceStatusBadge = ({ status }) => {
    const statusConfig = {
      present: {
        label: "Present",
        color: "bg-green-900/50 text-green-300 border-green-800/50",
      },
      late: {
        label: "Late",
        color: "bg-orange-900/50 text-orange-300 border-orange-800/50",
      },
      absent: {
        label: "Absent",
        color: "bg-red-900/50 text-red-300 border-red-800/50",
      },
      on_time: {
        label: "On Time",
        color: "bg-green-900/50 text-green-300 border-green-800/50",
      },
      half_day: {
        label: "Half Day",
        color: "bg-blue-900/50 text-blue-300 border-blue-800/50",
      },
    };

    const config = statusConfig[status] || {
      label: "Unknown",
      color: "bg-gray-700 text-gray-300 border-gray-600",
    };

    return (
      <span className={`badge badge-lg border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {employee.name?.charAt(0)?.toUpperCase() || "E"}
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  {employee.name}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-gray-400">
                    {employee.position} •{" "}
                    {employee.department?.name || "No Department"}
                  </p>
                  <StatusBadge status={employee.status} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to="/employees"
              className="btn btn-outline border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 px-6"
            >
              ← Back to List
            </Link>
            {role === "admin" && (
              <Link
                to={`/employees/edit/${id}`}
                className="btn bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white hover:from-blue-600 hover:to-purple-700 px-6"
              >
                Edit Employee
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Employee Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-400">
                      Employee ID
                    </label>
                    <p className="font-mono text-lg font-bold text-blue-400 bg-blue-900/30 px-3 py-2 rounded-lg border border-blue-800/50">
                      {employee.employee_id}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-400">
                      Full Name
                    </label>
                    <p className="text-white text-lg">{employee.name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-400">
                      Email Address
                    </label>
                    <p className="text-white text-lg">{employee.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-400">
                      Phone Number
                    </label>
                    <p className="text-white text-lg">
                      {employee.phone || (
                        <span className="text-gray-500">Not provided</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-400">
                      Department
                    </label>
                    <p className="text-white text-lg">
                      {employee.department?.name || (
                        <span className="text-gray-500">Not assigned</span>
                      )}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-400">
                      Position
                    </label>
                    <p className="text-white text-lg">
                      {employee.position || (
                        <span className="text-gray-500">Not specified</span>
                      )}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-400">
                      Join Date
                    </label>
                    <p className="text-white text-lg">
                      {employee.join_date
                        ? new Date(employee.join_date).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-400">
                      Employment Status
                    </label>
                    <div className="mt-1">
                      <StatusBadge status={employee.status} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              {employee.address && (
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <label className="block text-sm font-semibold text-gray-400 mb-3">
                    Address
                  </label>
                  <p className="text-white bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                    {employee.address}
                  </p>
                </div>
              )}
            </div>

            {/* Additional Information Section */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">
                  Additional Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                  <div className="text-2xl mb-3 text-blue-400">📅</div>
                  <div className="font-semibold text-white">Member Since</div>
                  <div className="text-sm text-gray-400 mt-1">
                    {employee.created_at
                      ? new Date(employee.created_at).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                  <div className="text-2xl mb-3 text-green-400">🔄</div>
                  <div className="font-semibold text-white">Last Updated</div>
                  <div className="text-sm text-gray-400 mt-1">
                    {employee.updated_at
                      ? new Date(employee.updated_at).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                  <div className="text-2xl mb-3 text-purple-400">👥</div>
                  <div className="font-semibold text-white">Department</div>
                  <div className="text-sm text-gray-400 mt-1">
                    {employee.department?.name || "Not assigned"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Attendance & Stats */}
          <div className="space-y-6">
            {/* Today's Attendance Card */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">
                  Today's Attendance
                </h2>
                <div className="badge bg-blue-900/50 text-blue-300 border-blue-800/50">
                  {new Date().toLocaleDateString()}
                </div>
              </div>

              {todayAttendance ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-300">Status:</span>
                    <AttendanceStatusBadge status={todayAttendance.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                      <div className="text-sm text-gray-400">Clock In</div>
                      <div className="font-bold text-white text-lg mt-1">
                        {formatTime(todayAttendance.clock_in)}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                      <div className="text-sm text-gray-400">Clock Out</div>
                      <div className="font-bold text-white text-lg mt-1">
                        {todayAttendance.clock_out
                          ? formatTime(todayAttendance.clock_out)
                          : "Not out"}
                      </div>
                    </div>
                  </div>

                  <div className="text-center p-4 bg-blue-900/50 rounded-xl border border-blue-800/50">
                    <div className="text-sm text-blue-300">Working Hours</div>
                    <div className="font-bold text-blue-400 text-lg mt-1">
                      {calculateWorkingHours()}
                    </div>
                  </div>

                  {todayAttendance.notes && (
                    <div className="mt-3 p-4 bg-orange-900/30 rounded-xl border border-orange-800/50">
                      <div className="text-sm font-semibold text-orange-300">
                        Notes:
                      </div>
                      <div className="text-sm text-orange-200 mt-1">
                        {todayAttendance.notes}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4 opacity-50">⏰</div>
                  <p className="text-gray-400 font-medium">
                    No attendance recorded today
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Employee hasn't clocked in yet
                  </p>
                </div>
              )}
            </div>

            {/* Monthly Stats Card */}
            {stats && (
              <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                  <h2 className="text-xl font-bold text-white">This Month</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Days Present:</span>
                    <span className="font-bold text-green-400">
                      {stats.days_present || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Days Late:</span>
                    <span className="font-bold text-orange-400">
                      {stats.days_late || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Days Absent:</span>
                    <span className="font-bold text-red-400">
                      {stats.days_absent || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <span className="font-semibold text-white">
                      Total Working Days:
                    </span>
                    <span className="font-bold text-blue-400">
                      {stats.total_working_days || 0}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions Card */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-cyan-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">Quick Actions</h2>
              </div>
              <div className="space-y-3">
                {/* <Link
                  to={`/attendance/employee/${employee.employee_id}`}
                  className="btn btn-outline border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 w-full justify-start"
                >
                  <span className="text-lg mr-2">📊</span>
                  View Full Attendance
                </Link> */}
                {role === "admin" && (
                  <>
                    <Link
                      to={`/employees/edit/${id}`}
                      className="btn btn-outline border-blue-600 text-blue-300 hover:bg-blue-900/50 hover:border-blue-500 w-full justify-start"
                    >
                      <span className="text-lg mr-2">✏️</span>
                      Edit Employee
                    </Link>
                    {/* <button
                      className="btn btn-outline border-red-600 text-red-300 hover:bg-red-900/50 hover:border-red-500 w-full justify-start"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete ${employee.name}? This action cannot be undone.`
                          )
                        ) {
                          // Add delete functionality here
                        }
                      }}
                    >
                      <span className="text-lg mr-2">🗑️</span>
                      Delete Employee
                    </button> */}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeView;

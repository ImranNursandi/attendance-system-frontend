// src/pages/MyAttendance.js
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useEmployeeAttendance,
  useAttendanceStats,
} from "../hooks/useAttendance";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";

const MyAttendance = () => {
  const { user } = useSelector((state) => state.auth);
  const [dateRange, setDateRange] = useState({
    start_date: startOfMonth(new Date()).toISOString().split("T")[0],
    end_date: endOfMonth(new Date()).toISOString().split("T")[0],
  });

  // Check if user has employee data
  const hasEmployeeData = user?.employee_id && user?.employee;

  // Only fetch attendance data if user has employee data
  const { data: attendanceResponse, isLoading } = useEmployeeAttendance(
    hasEmployeeData ? user.employee_id : null,
    hasEmployeeData ? dateRange : null
  );

  // Get stats for the current month only if user has employee data
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const { data: statsResponse } = useAttendanceStats(
    hasEmployeeData ? user.employee_id : null,
    hasEmployeeData ? { month: currentMonth, year: currentYear } : null
  );

  // Extract data from responses
  const attendanceRecords = attendanceResponse?.data || [];
  const stats = statsResponse?.data || {};

  const handleDateChange = (key, value) => {
    setDateRange((prev) => ({ ...prev, [key]: value }));
  };

  // Calculate summary statistics
  const calculateSummary = () => {
    const presentDays = attendanceRecords.filter(
      (record) => record.clock_in && record.status !== "absent"
    ).length;

    const lateDays = attendanceRecords.filter(
      (record) => record.status === "late"
    ).length;

    const earlyLeaveDays = attendanceRecords.filter(
      (record) => record.is_early_leave
    ).length;

    const totalHours = attendanceRecords.reduce((total, record) => {
      return total + (record.work_hours || 0);
    }, 0);

    return {
      presentDays,
      lateDays,
      earlyLeaveDays,
      totalHours: totalHours.toFixed(1),
      workingDays: attendanceRecords.length,
    };
  };

  const summary = calculateSummary();

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "-";
    return format(parseISO(timeString), "hh:mm a");
  };

  // Format date for display
  const formatDate = (dateString) => {
    return format(parseISO(dateString), "EEE, MMM dd, yyyy");
  };

  // Get status badge color
  const getStatusColor = (record) => {
    if (record.status === "late")
      return "bg-orange-900/50 text-orange-300 border-orange-800/50";
    if (record.status === "absent")
      return "bg-red-900/50 text-red-300 border-red-800/50";
    if (record.is_early_leave)
      return "bg-yellow-900/50 text-yellow-300 border-yellow-800/50";
    return "bg-green-900/50 text-green-300 border-green-800/50";
  };

  // Get status display text
  const getStatusText = (record) => {
    if (record.status === "late") return "Late";
    if (record.status === "absent") return "Absent";
    if (record.is_early_leave) return "Early Leave";
    if (!record.clock_out) return "Active";
    return "On Time";
  };

  // Show loading state only when we have employee data and it's actually loading
  if (hasEmployeeData && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="loading loading-spinner loading-lg text-blue-400"></div>
              <p className="text-gray-400 mt-4">
                Loading attendance records...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              My Attendance
            </h1>
            <p className="text-gray-400 mt-2">
              View and track your attendance history
            </p>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-gray-700">
            <div className="text-sm text-gray-400">Employee ID</div>
            <div className="font-bold text-white text-lg">
              {user?.employee_id || "Not assigned"}
            </div>
          </div>
        </div>

        {/* Show message for admins without employee data */}
        {!hasEmployeeData && (
          <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8">
            <div className="text-center py-8">
              <div className="text-6xl mb-4 opacity-50">👑</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Administrator Account
              </h2>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {user?.role === "admin"
                  ? "As an administrator, your account is not linked to an employee record. Attendance tracking is available for employees only."
                  : "Your account is not linked to an employee record. Please contact your administrator."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {user?.role === "admin" && (
                  <>
                    <button
                      className="btn bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white hover:from-blue-600 hover:to-purple-700"
                      onClick={() => (window.location.href = "/attendance/log")}
                    >
                      View All Attendance
                    </button>
                    <button
                      className="btn btn-outline border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
                      onClick={() => (window.location.href = "/")}
                    >
                      Go to Dashboard
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Only show attendance data if user has employee data */}
        {hasEmployeeData && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                <div className="text-sm text-gray-400">Present Days</div>
                <div className="text-2xl font-bold text-white">
                  {summary.presentDays}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  out of {summary.workingDays}
                </div>
              </div>
              <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                <div className="text-sm text-gray-400">Late Days</div>
                <div className="text-2xl font-bold text-orange-400">
                  {summary.lateDays}
                </div>
                <div className="text-xs text-gray-500 mt-1">this period</div>
              </div>
              <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                <div className="text-sm text-gray-400">Early Leaves</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {summary.earlyLeaveDays}
                </div>
                <div className="text-xs text-gray-500 mt-1">this period</div>
              </div>
              <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                <div className="text-sm text-gray-400">Total Hours</div>
                <div className="text-2xl font-bold text-green-400">
                  {summary.totalHours}h
                </div>
                <div className="text-xs text-gray-500 mt-1">worked</div>
              </div>
            </div>

            {/* Date Filter */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">Filter Records</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Start Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered bg-gray-700 border-gray-600 text-white"
                    value={dateRange.start_date}
                    onChange={(e) =>
                      handleDateChange("start_date", e.target.value)
                    }
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">End Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered bg-gray-700 border-gray-600 text-white"
                    value={dateRange.end_date}
                    onChange={(e) =>
                      handleDateChange("end_date", e.target.value)
                    }
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">
                      Records Found
                    </span>
                  </label>
                  <div className="text-2xl font-bold text-white mt-2">
                    {attendanceRecords.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Records Table */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                  <h2 className="text-xl font-bold text-white">
                    Attendance History
                  </h2>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="bg-gray-750 text-gray-300 font-semibold">
                        Date
                      </th>
                      <th className="bg-gray-750 text-gray-300 font-semibold">
                        Clock In
                      </th>
                      <th className="bg-gray-750 text-gray-300 font-semibold">
                        Clock Out
                      </th>
                      <th className="bg-gray-750 text-gray-300 font-semibold">
                        Work Hours
                      </th>
                      <th className="bg-gray-750 text-gray-300 font-semibold">
                        Status
                      </th>
                      <th className="bg-gray-750 text-gray-300 font-semibold">
                        Punctuality
                      </th>
                      <th className="bg-gray-750 text-gray-300 font-semibold">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b border-gray-700 hover:bg-gray-750/50 transition-colors"
                      >
                        <td className="text-white font-medium">
                          {formatDate(record.clock_in_date || record.clock_in)}
                        </td>
                        <td className="text-gray-300">
                          {formatTime(record.clock_in)}
                        </td>
                        <td className="text-gray-300">
                          {record.clock_out ? (
                            formatTime(record.clock_out)
                          ) : (
                            <span className="text-orange-400">
                              Not clocked out
                            </span>
                          )}
                        </td>
                        <td className="text-gray-300">
                          {record.work_hours ? (
                            <span className="font-semibold text-green-400">
                              {parseFloat(record.work_hours).toFixed(2)}h
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge badge-sm border ${getStatusColor(
                              record
                            )}`}
                          >
                            {getStatusText(record)}
                          </span>
                        </td>
                        <td>
                          {record.punctuality &&
                            record.punctuality !== "on_time" && (
                              <div className="flex flex-col gap-1 text-xs">
                                {record.is_late && (
                                  <span className="text-orange-400">
                                    Late: {record.late_minutes}m
                                  </span>
                                )}
                                {record.is_early_leave && (
                                  <span className="text-yellow-400">
                                    Early: {record.early_minutes}m
                                  </span>
                                )}
                              </div>
                            )}
                        </td>
                        <td className="text-gray-400 max-w-xs truncate">
                          {record.notes || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {attendanceRecords.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 opacity-50">📊</div>
                    <p className="text-lg text-gray-400 mb-2">
                      No attendance records found
                    </p>
                    <p className="text-sm text-gray-500">
                      No records found for the selected period (
                      {dateRange.start_date} to {dateRange.end_date})
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            {stats && Object.keys(stats).length > 0 && (
              <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                  <h2 className="text-xl font-bold text-white">
                    Monthly Statistics
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {stats.total_present || 0}
                    </div>
                    <div className="text-sm text-gray-400">Present Days</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400">
                      {stats.total_late || 0}
                    </div>
                    <div className="text-sm text-gray-400">Late Days</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">
                      {stats.total_absent || 0}
                    </div>
                    <div className="text-sm text-gray-400">Absent Days</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {stats.avg_work_hours?.toFixed(1) || 0}h
                    </div>
                    <div className="text-sm text-gray-400">Avg Hours/Day</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyAttendance;

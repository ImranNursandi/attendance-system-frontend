// src/pages/AttendanceLog.js
import React, { useState } from "react";
import { useAttendanceLogs } from "../hooks/useAttendance";
import { useDepartments } from "../hooks/useDepartments";
import { format, parseISO } from "date-fns";

const AttendanceLog = () => {
  const [filters, setFilters] = useState({
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
    department_id: "",
  });

  const { data: logsResponse, isLoading, error } = useAttendanceLogs(filters);
  const { data: departmentsResponse } = useDepartments();

  // Extract data from responses
  const logsData = logsResponse?.data || {};
  const departmentsData = departmentsResponse?.data?.data || {};

  const logs = logsData.attendances || [];
  const departments = departmentsData.departments || [];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getStatusBadge = (log) => {
    const statusConfig = {
      late: {
        class: "bg-orange-900/50 text-orange-300 border-orange-800/50",
        text: "Late",
      },
      on_time: {
        class: "bg-green-900/50 text-green-300 border-green-800/50",
        text: "On Time",
      },
      early_leave: {
        class: "bg-blue-900/50 text-blue-300 border-blue-800/50",
        text: "Early Leave",
      },
      absent: {
        class: "bg-red-900/50 text-red-300 border-red-800/50",
        text: "Absent",
      },
    };

    const config = statusConfig[log.status] || {
      class: "bg-gray-700 text-gray-300 border-gray-600",
      text: log.status || "Unknown",
    };

    return (
      <span className={`badge badge-lg border ${config.class}`}>
        {config.text}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-blue-400"></div>
            <p className="text-gray-400 mt-3">Loading attendance logs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-4xl mx-auto flex justify-center items-center min-h-64">
          <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8 text-center">
            <div className="text-6xl mb-4 opacity-50">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Error Loading Data
            </h2>
            <p className="text-gray-400 mb-6">
              There was an error loading the attendance logs. Please try again.
            </p>
            <button
              className="btn bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white hover:from-blue-600 hover:to-purple-700"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                📊
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  Attendance Log
                </h1>
                <p className="text-gray-400 mt-2">
                  Track and monitor employee attendance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-white">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-300 font-semibold">
                  Start Date
                </span>
              </label>
              <input
                type="date"
                className="input input-bordered bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={filters.start_date}
                onChange={(e) =>
                  handleFilterChange("start_date", e.target.value)
                }
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-300 font-semibold">
                  End Date
                </span>
              </label>
              <input
                type="date"
                className="input input-bordered bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={filters.end_date}
                onChange={(e) => handleFilterChange("end_date", e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-300 font-semibold">
                  Department
                </span>
              </label>
              <select
                className="select select-bordered bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={filters.department_id}
                onChange={(e) =>
                  handleFilterChange("department_id", e.target.value)
                }
              >
                <option value="" className="bg-gray-700">
                  All Departments
                </option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id} className="bg-gray-700">
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        {logs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6 text-center">
              <div className="text-3xl mb-3 text-blue-400">📈</div>
              <div className="stat-title text-gray-400">Total Records</div>
              <div className="text-2xl font-bold text-blue-400 mt-2">
                {logs.length}
              </div>
            </div>
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6 text-center">
              <div className="text-3xl mb-3 text-green-400">✅</div>
              <div className="stat-title text-gray-400">Present</div>
              <div className="text-2xl font-bold text-green-400 mt-2">
                {logs.filter((log) => log.clock_in).length}
              </div>
            </div>
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6 text-center">
              <div className="text-3xl mb-3 text-orange-400">⏰</div>
              <div className="stat-title text-gray-400">Late</div>
              <div className="text-2xl font-bold text-orange-400 mt-2">
                {logs.filter((log) => log.status === "late").length}
              </div>
            </div>
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6 text-center">
              <div className="text-3xl mb-3 text-cyan-400">🔄</div>
              <div className="stat-title text-gray-400">Pending Check-out</div>
              <div className="text-2xl font-bold text-cyan-400 mt-2">
                {logs.filter((log) => log.clock_in && !log.clock_out).length}
              </div>
            </div>
          </div>
        )}

        {/* Attendance Log Table */}
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-white">Attendance Records</h2>
            <span className="badge bg-purple-900/50 text-purple-300 border-purple-800/50">
              {logs.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="bg-gray-750 text-gray-300 font-semibold">
                    Employee
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold">
                    Department
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold">
                    Clock In
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold">
                    Clock Out
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold">
                    Working Hours
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold">
                    Punctuality
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold">
                    Status
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  // Calculate working hours
                  let workingHours = "-";
                  if (log.clock_in && log.clock_out) {
                    const start = parseISO(log.clock_in);
                    const end = parseISO(log.clock_out);
                    const diffMs = end - start;
                    const hours = Math.floor(diffMs / (1000 * 60 * 60));
                    const minutes = Math.floor(
                      (diffMs % (1000 * 60 * 60)) / (1000 * 60)
                    );
                    workingHours = `${hours}h ${minutes}m`;
                  }

                  return (
                    <tr
                      key={log.id}
                      className="border-b border-gray-700 hover:bg-gray-750/50 transition-colors"
                    >
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar placeholder flex-shrink-0">
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl w-10 h-10 flex items-center justify-center font-bold shadow-lg">
                              <span className="font-bold text-sm">
                                {log.employee?.name?.charAt(0)?.toUpperCase() ||
                                  "U"}
                              </span>
                            </div>
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-white truncate">
                              {log.employee?.name || "Unknown Employee"}
                            </div>
                            <div className="text-sm text-gray-400 font-mono">
                              {log.employee_id ||
                                log.employee?.employee_id ||
                                "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {log.employee?.position || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-outline border-gray-600 text-gray-300">
                          {log.employee?.department?.name || "No Department"}
                        </span>
                      </td>
                      <td>
                        {log.clock_in ? (
                          <div className="space-y-1">
                            <div className="font-mono text-sm text-white">
                              {format(parseISO(log.clock_in), "HH:mm:ss")}
                            </div>
                            <div className="text-xs text-gray-400">
                              {format(parseISO(log.clock_in), "MMM dd, yyyy")}
                            </div>
                          </div>
                        ) : (
                          <span className="badge bg-red-900/50 text-red-300 border-red-800/50 text-xs">
                            Not Clocked In
                          </span>
                        )}
                      </td>
                      <td>
                        {log.clock_out ? (
                          <div className="space-y-1">
                            <div className="font-mono text-sm text-white">
                              {format(parseISO(log.clock_out), "HH:mm:ss")}
                            </div>
                            <div className="text-xs text-gray-400">
                              {format(parseISO(log.clock_out), "MMM dd, yyyy")}
                            </div>
                          </div>
                        ) : (
                          <span className="badge bg-orange-900/50 text-orange-300 border-orange-800/50 text-xs">
                            Not Clocked Out
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="font-mono text-sm text-white bg-gray-700/50 px-2 py-1 rounded border border-gray-600">
                          {workingHours}
                        </span>
                      </td>
                      <td>
                        {log.punctuality && log.punctuality !== "on_time" && (
                          <div className="flex justify-between gap-4">
                            <span>Status:</span>
                            <span
                              className={`${
                                log.punctuality === "late"
                                  ? "text-orange-400"
                                  : log.punctuality === "early_leave"
                                  ? "text-yellow-400"
                                  : "text-green-400"
                              } font-semibold`}
                            >
                              {log.punctuality.replace("_", " ").toUpperCase()}
                            </span>
                          </div>
                        )}
                      </td>
                      <td>{getStatusBadge(log)}</td>
                      <td>
                        <div className="max-w-xs">
                          <span className="text-sm text-gray-300">
                            {log.notes || "-"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {logs.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 opacity-50">📊</div>
                <p className="text-lg text-gray-300 font-medium mb-2">
                  No attendance records found
                </p>
                <p className="text-sm text-gray-500">
                  Try adjusting your filters or check back later
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceLog;

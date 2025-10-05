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
      late: { class: "badge-warning", text: "Late" },
      on_time: { class: "badge-success", text: "On Time" },
      early_leave: { class: "badge-info", text: "Early Leave" },
      absent: { class: "badge-error", text: "Absent" },
    };

    const config = statusConfig[log.status] || {
      class: "badge-info",
      text: log.status || "Unknown",
    };

    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  if (isLoading)
    return (
      <div className="flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  if (error)
    return (
      <div className="alert alert-error">Error loading attendance logs</div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Attendance Log</h1>

      {/* Filters */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Start Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={filters.start_date}
                onChange={(e) =>
                  handleFilterChange("start_date", e.target.value)
                }
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">End Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={filters.end_date}
                onChange={(e) => handleFilterChange("end_date", e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Department</span>
              </label>
              <select
                className="select select-bordered"
                value={filters.department_id}
                onChange={(e) =>
                  handleFilterChange("department_id", e.target.value)
                }
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {logs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Total Records</div>
            <div className="stat-value text-primary">{logs.length}</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Present</div>
            <div className="stat-value text-success">
              {logs.filter((log) => log.clock_in).length}
            </div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Late</div>
            <div className="stat-value text-warning">
              {logs.filter((log) => log.status === "late").length}
            </div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">Pending Check-out</div>
            <div className="stat-value text-info">
              {logs.filter((log) => log.clock_in && !log.clock_out).length}
            </div>
          </div>
        </div>
      )}

      {/* Attendance Log Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Working Hours</th>
                  <th>Status</th>
                  <th>Notes</th>
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
                    <tr key={log.id}>
                      <td className="font-mono text-sm">
                        {log.employee_id || log.employee?.employee_id || "N/A"}
                      </td>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-10 h-10 bg-primary text-primary-content flex items-center justify-center text-sm">
                              {log.employee?.name?.charAt(0) || "U"}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">
                              {log.employee?.name || "Unknown Employee"}
                            </div>
                            <div className="text-sm opacity-50">
                              {log.employee?.position || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-outline">
                          {log.employee?.department?.name || "No Department"}
                        </span>
                      </td>
                      <td>
                        {log.clock_in ? (
                          <div className="space-y-1">
                            <div className="font-mono text-sm">
                              {format(parseISO(log.clock_in), "HH:mm:ss")}
                            </div>
                            <div className="text-xs opacity-50">
                              {format(parseISO(log.clock_in), "MMM dd")}
                            </div>
                          </div>
                        ) : (
                          <span className="text-error text-sm">
                            Not Clocked In
                          </span>
                        )}
                      </td>
                      <td>
                        {log.clock_out ? (
                          <div className="space-y-1">
                            <div className="font-mono text-sm">
                              {format(parseISO(log.clock_out), "HH:mm:ss")}
                            </div>
                            <div className="text-xs opacity-50">
                              {format(parseISO(log.clock_out), "MMM dd")}
                            </div>
                          </div>
                        ) : (
                          <span className="text-warning text-sm">
                            Not Clocked Out
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="font-mono text-sm">
                          {workingHours}
                        </span>
                      </td>
                      <td>{getStatusBadge(log)}</td>
                      <td>
                        <div className="max-w-xs">
                          <span className="text-sm">{log.notes || "-"}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {logs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-lg opacity-75 mb-2">
                  No attendance records found
                </p>
                <p className="text-sm opacity-50">
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

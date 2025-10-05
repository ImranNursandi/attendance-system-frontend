// src/pages/EmployeeView.js
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEmployee } from "../hooks/useEmployees";
import {
  useEmployeeAttendance,
  useAttendanceLogs,
} from "../hooks/useAttendance";
import { useSelector } from "react-redux";

const EmployeeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);

  const { data: employeeResponse, isLoading: employeeLoading } =
    useEmployee(id);
  const today = new Date().toISOString().split("T")[0];

  // Get today's attendance
  const { data: todayAttendanceResponse } = useEmployeeAttendance(id, {
    start_date: today,
    end_date: today,
  });

  // Get attendance stats for the current month
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const { data: statsResponse } = useAttendanceLogs(id, currentMonth);

  const employee = employeeResponse?.data?.data;
  const todayAttendance = todayAttendanceResponse?.data?.data?.[0];
  const stats = statsResponse?.data?.data;

  if (employeeLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="card-title justify-center">Employee Not Found</h2>
            <p>The employee you're looking for doesn't exist.</p>
            <div className="card-actions justify-center mt-4">
              <Link to="/employees" className="btn btn-primary">
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

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      active: { label: "Active", color: "badge-success" },
      inactive: { label: "Inactive", color: "badge-error" },
      suspended: { label: "Suspended", color: "badge-warning" },
    };

    const config = statusConfig[status] || {
      label: status,
      color: "badge-info",
    };

    return (
      <span className={`badge ${config.color} badge-lg`}>{config.label}</span>
    );
  };

  // Attendance status badge
  const AttendanceStatusBadge = ({ status }) => {
    const statusConfig = {
      present: { label: "Present", color: "badge-success" },
      late: { label: "Late", color: "badge-warning" },
      absent: { label: "Absent", color: "badge-error" },
      on_time: { label: "On Time", color: "badge-success" },
      half_day: { label: "Half Day", color: "badge-info" },
    };

    const config = statusConfig[status] || {
      label: "Unknown",
      color: "badge-info",
    };

    return (
      <span className={`badge ${config.color} badge-lg`}>{config.label}</span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{employee.name}</h1>
            <StatusBadge status={employee.status} />
          </div>
          <p className="text-gray-600 mt-1">
            {employee.position} • {employee.department?.name || "No Department"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/employees" className="btn btn-outline">
            ← Back to List
          </Link>
          {role === "admin" && (
            <Link to={`/employees/edit/${id}`} className="btn btn-primary">
              Edit Employee
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Employee Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                👤 Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="label-text font-semibold text-gray-500">
                      Employee ID
                    </label>
                    <p className="font-mono text-lg font-bold text-primary">
                      {employee.employee_id}
                    </p>
                  </div>
                  <div>
                    <label className="label-text font-semibold text-gray-500">
                      Full Name
                    </label>
                    <p className="text-lg">{employee.name}</p>
                  </div>
                  <div>
                    <label className="label-text font-semibold text-gray-500">
                      Email Address
                    </label>
                    <p className="text-lg">{employee.email}</p>
                  </div>
                  <div>
                    <label className="label-text font-semibold text-gray-500">
                      Phone Number
                    </label>
                    <p className="text-lg">
                      {employee.phone || (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="label-text font-semibold text-gray-500">
                      Department
                    </label>
                    <p className="text-lg">
                      {employee.department?.name || (
                        <span className="text-gray-400">Not assigned</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="label-text font-semibold text-gray-500">
                      Position
                    </label>
                    <p className="text-lg">
                      {employee.position || (
                        <span className="text-gray-400">Not specified</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="label-text font-semibold text-gray-500">
                      Join Date
                    </label>
                    <p className="text-lg">
                      {employee.join_date
                        ? new Date(employee.join_date).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="label-text font-semibold text-gray-500">
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
                <div className="mt-6 pt-6 border-t">
                  <label className="label-text font-semibold text-gray-500">
                    Address
                  </label>
                  <p className="mt-2 text-lg">{employee.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                📞 Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label-text font-semibold text-gray-500">
                    Primary Email
                  </label>
                  <p className="text-lg">{employee.email}</p>
                </div>
                <div>
                  <label className="label-text font-semibold text-gray-500">
                    Phone Number
                  </label>
                  <p className="text-lg">
                    {employee.phone || (
                      <span className="text-gray-400">Not provided</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Attendance & Stats */}
        <div className="space-y-6">
          {/* Today's Attendance Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                📅 Today's Attendance
                <div className="badge badge-primary badge-sm">
                  {new Date().toLocaleDateString()}
                </div>
              </h2>

              {todayAttendance ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Status:</span>
                    <AttendanceStatusBadge status={todayAttendance.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-base-200 rounded-lg">
                      <div className="text-sm text-gray-500">Clock In</div>
                      <div className="font-bold text-lg">
                        {todayAttendance.clock_in
                          ? new Date(
                              todayAttendance.clock_in
                            ).toLocaleTimeString()
                          : "N/A"}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-base-200 rounded-lg">
                      <div className="text-sm text-gray-500">Clock Out</div>
                      <div className="font-bold text-lg">
                        {todayAttendance.clock_out
                          ? new Date(
                              todayAttendance.clock_out
                            ).toLocaleTimeString()
                          : "Not out"}
                      </div>
                    </div>
                  </div>

                  <div className="text-center p-3 bg-info text-info-content rounded-lg">
                    <div className="text-sm">Working Hours</div>
                    <div className="font-bold text-lg">
                      {calculateWorkingHours()}
                    </div>
                  </div>

                  {todayAttendance.notes && (
                    <div className="mt-3 p-3 bg-warning bg-opacity-10 rounded-lg">
                      <div className="text-sm font-semibold">Notes:</div>
                      <div className="text-sm mt-1">
                        {todayAttendance.notes}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">⏰</div>
                  <p className="text-gray-500">No attendance recorded today</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Employee hasn't clocked in yet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Monthly Stats Card */}
          {stats && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  📊 This Month
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Days Present:</span>
                    <span className="font-bold text-success">
                      {stats.days_present || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Days Late:</span>
                    <span className="font-bold text-warning">
                      {stats.days_late || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Days Absent:</span>
                    <span className="font-bold text-error">
                      {stats.days_absent || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold">Total Working Days:</span>
                    <span className="font-bold text-primary">
                      {stats.total_working_days || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                ⚡ Quick Actions
              </h2>
              <div className="space-y-2">
                <Link
                  to={`/attendance/employee/${employee.employee_id}`}
                  className="btn btn-outline btn-sm w-full justify-start"
                >
                  📊 View Full Attendance
                </Link>
                {role === "admin" && (
                  <>
                    <Link
                      to={`/employees/edit/${id}`}
                      className="btn btn-outline btn-sm w-full justify-start"
                    >
                      ✏️ Edit Employee
                    </Link>
                    <button
                      className="btn btn-outline btn-error btn-sm w-full justify-start"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete ${employee.name}?`
                          )
                        ) {
                          // Add delete functionality here
                        }
                      }}
                    >
                      🗑️ Delete Employee
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2">
            ℹ️ Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-base-200 rounded-lg">
              <div className="text-2xl mb-2">📅</div>
              <div className="font-semibold">Member Since</div>
              <div className="text-sm text-gray-600">
                {employee.created_at
                  ? new Date(employee.created_at).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
            <div className="text-center p-4 bg-base-200 rounded-lg">
              <div className="text-2xl mb-2">🔄</div>
              <div className="font-semibold">Last Updated</div>
              <div className="text-sm text-gray-600">
                {employee.updated_at
                  ? new Date(employee.updated_at).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
            <div className="text-center p-4 bg-base-200 rounded-lg">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-semibold">Department</div>
              <div className="text-sm text-gray-600">
                {employee.department?.name || "Not assigned"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeView;

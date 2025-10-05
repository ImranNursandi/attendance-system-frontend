// src/pages/ManagerDashboard.js
import React from "react";
import { Link } from "react-router-dom";
import { useEmployees } from "../hooks/useEmployees";
import { useAttendanceLogs } from "../hooks/useAttendance";

const ManagerDashboard = () => {
  const today = new Date().toISOString().split("T")[0];
  const { data: employeesResponse } = useEmployees();
  const { data: todayLogsResponse } = useAttendanceLogs({
    start_date: today,
    end_date: today,
  });

  const employees = employeesResponse?.data?.data?.employees || [];
  const todayLogs = todayLogsResponse?.data?.data?.attendances || [];

  // Manager-specific calculations
  const presentEmployees = todayLogs.filter((log) => log.clock_in).length;
  const absentEmployees = employees.length - presentEmployees;
  const lateEmployees = todayLogs.filter((log) => log.status === "late").length;
  const pendingApprovals = todayLogs.filter(
    (log) => log.clock_in && !log.clock_out
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <p className="text-gray-600">Team management and oversight</p>
        </div>
      </div>

      {/* Manager-specific stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{employees.length}</div>
                <div className="text-sm opacity-75">Team Size</div>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold text-success">
                  {presentEmployees}
                </div>
                <div className="text-sm opacity-75">Present Today</div>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold text-warning">
                  {lateEmployees}
                </div>
                <div className="text-sm opacity-75">Late Today</div>
              </div>
              <div className="text-4xl">⏰</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold text-error">
                  {absentEmployees}
                </div>
                <div className="text-sm opacity-75">Absent Today</div>
              </div>
              <div className="text-4xl">❌</div>
            </div>
          </div>
        </div>
      </div>

      {/* Manager Quick Actions */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Team Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/employees" className="btn btn-primary btn-outline">
              👥 Manage Employees
            </Link>
            <Link
              to="/attendance/log"
              className="btn btn-secondary btn-outline"
            >
              📊 View Attendance
            </Link>
            <Link to="/employees/new" className="btn btn-accent btn-outline">
              ➕ Add Employee
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

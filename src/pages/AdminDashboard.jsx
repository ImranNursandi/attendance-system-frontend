// src/pages/AdminDashboard.js
import React from "react";
import { Link } from "react-router-dom";
import { useEmployees } from "../hooks/useEmployees";
import { useDepartments } from "../hooks/useDepartments";
import { useAttendanceLogs } from "../hooks/useAttendance";

const AdminDashboard = () => {
  const { data: employeesResponse } = useEmployees();
  const { data: departmentsResponse } = useDepartments();
  const today = new Date().toISOString().split("T")[0];
  const { data: todayLogsResponse } = useAttendanceLogs({
    start_date: today,
    end_date: today,
  });

  const employeesData = employeesResponse?.data?.data || {};
  const departmentsData = departmentsResponse?.data?.data || {};
  const todayLogsData = todayLogsResponse?.data?.data || {};

  const employees = employeesData.employees || [];
  const departments = departmentsData.departments || [];
  const todayLogs = todayLogsData.attendances || [];

  const adminStats = [
    {
      title: "Total Employees",
      value: employeesData.pagination?.total || employees.length,
      icon: "👥",
      color: "primary",
      link: "/employees",
    },
    {
      title: "Total Departments",
      value: departmentsData.pagination?.total || departments.length,
      icon: "🏢",
      color: "secondary",
      link: "/departments",
    },
    {
      title: "Today's Attendance",
      value: todayLogs.filter((log) => log.clock_in).length,
      icon: "⏰",
      color: "accent",
      link: "/attendance/log",
    },
    {
      title: "Late Today",
      value: todayLogs.filter((log) => log.status === "late").length,
      icon: "⚠️",
      color: "warning",
      link: "/attendance/log",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="badge badge-primary badge-lg">ADMIN</div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm opacity-75">{stat.title}</div>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Admin Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Management</h2>
            <div className="flex flex-wrap gap-4">
              <Link to="/employees/new" className="btn btn-primary">
                Add Employee
              </Link>
              <Link to="/departments/new" className="btn btn-secondary">
                Add Department
              </Link>
              <Link to="/employees" className="btn btn-outline">
                Manage Employees
              </Link>
              <Link to="/departments" className="btn btn-outline">
                Manage Departments
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Reports & Analytics</h2>
            <div className="flex flex-wrap gap-4">
              <Link to="/attendance/log" className="btn btn-outline">
                Attendance Reports
              </Link>
              <button className="btn btn-outline">Export Data</button>
              <button className="btn btn-outline">System Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

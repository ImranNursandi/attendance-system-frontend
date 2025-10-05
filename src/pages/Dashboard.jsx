// src/pages/Dashboard.js
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEmployees } from "../hooks/useEmployees";
import { useDepartments } from "../hooks/useDepartments";
import { useAttendanceLogs } from "../hooks/useAttendance";

const Dashboard = () => {
  const { role, user } = useSelector((state) => state.auth);
  const { data: employeesResponse } = useEmployees();
  const { data: departmentsResponse } = useDepartments();
  const today = new Date().toISOString().split("T")[0];
  const { data: todayLogsResponse } = useAttendanceLogs({
    start_date: today,
    end_date: today,
  });

  // Extract data from API responses
  const employeesData = employeesResponse?.data?.data || {};
  const departmentsData = departmentsResponse?.data?.data || {};
  const todayLogsData = todayLogsResponse?.data?.data || {};

  const employees = employeesData.employees || [];
  const departments = departmentsData.departments || [];
  const todayLogs = todayLogsData.attendances || [];

  const totalEmployees = employeesData.pagination?.total || employees.length;
  const totalDepartments =
    departmentsData.pagination?.total || departments.length;

  // Calculate stats
  const presentCount = todayLogs.filter((log) => log.clock_in).length;
  const pendingClockOutCount = todayLogs.filter(
    (log) => log.clock_in && !log.clock_out
  ).length;
  const lateCount = todayLogs.filter((log) => log.status === "late").length;

  // Role-based stats
  const getStats = () => {
    const baseStats = [
      {
        title: "Total Employees",
        value: totalEmployees,
        icon: "👥",
        color: "primary",
        link: "/employees",
        roles: ["admin", "manager"],
      },
      {
        title: "Total Departments",
        value: totalDepartments,
        icon: "🏢",
        color: "secondary",
        link: "/departments",
        roles: ["admin"],
      },
      {
        title: "Present Today",
        value: presentCount,
        icon: "✅",
        color: "success",
        link: role === "employee" ? "/my-attendance" : "/attendance/log",
      },
      {
        title: "Pending Clock Out",
        value: pendingClockOutCount,
        icon: "⏳",
        color: "warning",
        link: role === "employee" ? "/my-attendance" : "/attendance/log",
      },
    ];

    // Add employee-specific stats
    if (role === "employee") {
      const myAttendance = todayLogs.find(
        (log) => log.employee_id === user?.employee_id
      );
      baseStats.push({
        title: "My Status",
        value: myAttendance?.clock_in
          ? myAttendance.clock_out
            ? "Clocked Out"
            : "Clocked In"
          : "Not Clocked In",
        icon: myAttendance?.clock_in
          ? myAttendance.clock_out
            ? "🚪"
            : "🏢"
          : "❌",
        color: myAttendance?.clock_in
          ? myAttendance.clock_out
            ? "info"
            : "success"
          : "error",
        link: "/attendance/clock-in",
      });
    }

    return baseStats.filter((stat) => !stat.roles || stat.roles.includes(role));
  };

  const stats = getStats();

  // Role-based quick actions
  const getQuickActions = () => {
    const actions = [
      {
        label: "Clock In/Out",
        path: "/attendance/clock-in",
        icon: "⏰",
        color: "primary",
      },
      {
        label: "My Attendance",
        path: "/my-attendance",
        icon: "📅",
        color: "secondary",
      },
    ];

    if (["admin", "manager"].includes(role)) {
      actions.push(
        {
          label: "Add Employee",
          path: "/employees/new",
          icon: "👥",
          color: "accent",
        },
        {
          label: "View Reports",
          path: "/attendance/log",
          icon: "📊",
          color: "info",
        }
      );
    }

    if (role === "admin") {
      actions.push(
        {
          label: "Add Department",
          path: "/departments/new",
          icon: "🏢",
          color: "warning",
        },
        {
          label: "Admin Panel",
          path: "/admin/dashboard",
          icon: "⚙️",
          color: "primary",
        }
      );
    }

    if (role === "manager") {
      actions.push({
        label: "Manager Panel",
        path: "/manager/dashboard",
        icon: "📈",
        color: "secondary",
      });
    }

    return actions;
  };

  const quickActions = getQuickActions();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.username || "User"}!
          </h1>
          <p className="text-gray-600 mt-1">
            {role === "admin" && "System Administrator Dashboard"}
            {role === "manager" && "Team Management Dashboard"}
            {role === "employee" && "Employee Dashboard"}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Today is</div>
          <div className="font-semibold">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-l-${stat.color}`}
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.title}</div>
                </div>
                <div className="text-4xl opacity-80">{stat.icon}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.path}
                    className={`btn btn-${action.color} btn-outline justify-start w-full`}
                  >
                    <span className="text-lg mr-3">{action.icon}</span>
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title">Today's Activity</h2>
                <span className="badge badge-primary">
                  {todayLogs.length} records
                </span>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {todayLogs.slice(0, 10).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-12">
                          <span className="text-lg">
                            {log.employee?.name?.charAt(0) || "U"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">
                          {log.employee?.name || "Unknown Employee"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {log.clock_in &&
                            `In: ${new Date(
                              log.clock_in
                            ).toLocaleTimeString()}`}
                          {log.clock_out &&
                            ` | Out: ${new Date(
                              log.clock_out
                            ).toLocaleTimeString()}`}
                        </div>
                        {log.status && (
                          <div className="text-xs mt-1">
                            <span
                              className={`badge ${
                                log.status === "late"
                                  ? "badge-warning"
                                  : log.status === "present"
                                  ? "badge-success"
                                  : "badge-info"
                              }`}
                            >
                              {log.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      className={`badge badge-lg ${
                        !log.clock_in
                          ? "badge-error"
                          : log.clock_out
                          ? "badge-secondary"
                          : "badge-success"
                      }`}
                    >
                      {!log.clock_in
                        ? "Absent"
                        : log.clock_out
                        ? "Completed"
                        : "Active"}
                    </div>
                  </div>
                ))}
                {todayLogs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📊</div>
                    <p>No activity recorded today</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

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
  const today = new Date().toLocaleDateString("en-CA");
  const { data: todayLogsResponse } = useAttendanceLogs({
    start_date: today,
    end_date: today,
  });

  // Extract data from API responses
  const employeesData = employeesResponse?.data?.data || {};
  const departmentsData = departmentsResponse?.data?.data || {};
  const todayLogsData = todayLogsResponse?.data || {};

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
  const absentCount = totalEmployees - presentCount;

  // Role-based stats
  const getStats = () => {
    const baseStats = [
      {
        title: "Total Employees",
        value: totalEmployees,
        icon: "👥",
        color: "primary",
        gradient: "from-blue-500 to-blue-600",
        link: "/employees",
        roles: ["admin", "manager"],
        trend: "+5%",
      },
      {
        title: "Total Departments",
        value: totalDepartments,
        icon: "🏢",
        color: "secondary",
        gradient: "from-purple-500 to-purple-600",
        link: "/departments",
        roles: ["admin"],
      },
      {
        title: "Present Today",
        value: presentCount,
        icon: "✅",
        color: "success",
        gradient: "from-green-500 to-green-600",
        link: role === "employee" ? "/my-attendance" : "/attendance/log",
        percentage:
          totalEmployees > 0
            ? Math.round((presentCount / totalEmployees) * 100)
            : 0,
      },
      {
        title: "Late Today",
        value: lateCount,
        icon: "⏰",
        color: "warning",
        gradient: "from-orange-500 to-orange-600",
        link: "/attendance/log",
      },
      {
        title: "Pending Clock Out",
        value: pendingClockOutCount,
        icon: "⏳",
        color: "info",
        gradient: "from-cyan-500 to-cyan-600",
        link: role === "employee" ? "/my-attendance" : "/attendance/log",
      },
      {
        title: "Absent Today",
        value: absentCount,
        icon: "❌",
        color: "error",
        gradient: "from-red-500 to-red-600",
        link: "/attendance/log",
        roles: ["admin", "manager"],
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
        gradient: myAttendance?.clock_in
          ? myAttendance.clock_out
            ? "from-cyan-500 to-cyan-600"
            : "from-green-500 to-green-600"
          : "from-red-500 to-red-600",
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
        description: "Record your attendance",
        bgColor: "bg-gradient-to-br from-blue-900/50 to-blue-800/30",
        borderColor: "border-blue-800/50",
      },
      {
        label: "My Attendance",
        path: "/my-attendance",
        icon: "📅",
        color: "secondary",
        description: "View your attendance history",
        bgColor: "bg-gradient-to-br from-purple-900/50 to-purple-800/30",
        borderColor: "border-purple-800/50",
      },
    ];

    if (["admin", "manager"].includes(role)) {
      actions.push(
        {
          label: "Add Employee",
          path: "/employees/new",
          icon: "👥",
          color: "accent",
          description: "Register new employee",
          bgColor: "bg-gradient-to-br from-emerald-900/50 to-emerald-800/30",
          borderColor: "border-emerald-800/50",
        },
        {
          label: "View Reports",
          path: "/attendance/log",
          icon: "📊",
          color: "info",
          description: "Analytics & insights",
          bgColor: "bg-gradient-to-br from-cyan-900/50 to-cyan-800/30",
          borderColor: "border-cyan-800/50",
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
          description: "Create new department",
          bgColor: "bg-gradient-to-br from-orange-900/50 to-orange-800/30",
          borderColor: "border-orange-800/50",
        },
        {
          label: "Admin Panel",
          path: "/admin/dashboard",
          icon: "⚙️",
          color: "primary",
          description: "System administration",
          bgColor: "bg-gradient-to-br from-blue-900/50 to-blue-800/30",
          borderColor: "border-blue-800/50",
        }
      );
    }

    if (role === "manager") {
      actions.push({
        label: "Manager Panel",
        path: "/manager/dashboard",
        icon: "📈",
        color: "secondary",
        description: "Team management",
        bgColor: "bg-gradient-to-br from-purple-900/50 to-purple-800/30",
        borderColor: "border-purple-800/50",
      });
    }

    return actions;
  };

  const quickActions = getQuickActions();

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                {getGreeting()}, {user?.username || "User"}!
              </h1>
            </div>
            <p className="text-gray-400 text-lg">
              {role === "admin" &&
                "System Administrator Dashboard - Manage your organization efficiently"}
              {role === "manager" &&
                "Team Management Dashboard - Monitor your team's performance"}
              {role === "employee" &&
                "Employee Dashboard - Track your attendance and schedule"}
            </p>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-gray-700">
            <div className="text-sm text-gray-400 font-medium">Today is</div>
            <div className="font-bold text-gray-100 text-lg">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Link key={index} to={stat.link} className="group">
              <div className="bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-gray-600 overflow-hidden group-hover:scale-105">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}
                    >
                      <span className="text-2xl text-white">{stat.icon}</span>
                    </div>
                    {stat.percentage && (
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-400">
                          {stat.percentage}%
                        </div>
                        <div className="text-xs text-gray-400">attendance</div>
                      </div>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-300">
                    {stat.title}
                  </div>
                  {stat.trend && (
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-green-400 text-xs">
                        ↑ {stat.trend}
                      </span>
                      <span className="text-gray-500 text-xs">
                        from last week
                      </span>
                    </div>
                  )}
                </div>
                <div className={`h-1 bg-gradient-to-r ${stat.gradient}`}></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">Quick Actions</h2>
              </div>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.path}
                    className={`flex items-center gap-4 p-4 rounded-xl border ${action.borderColor} hover:border-${action.color}-400 transition-all duration-200 hover:shadow-lg group ${action.bgColor}`}
                  >
                    <div
                      className={`p-3 rounded-lg bg-${action.color}-900/50 group-hover:scale-110 transition-transform duration-200 border border-${action.color}-800/50`}
                    >
                      <span className="text-2xl text-white">{action.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white group-hover:text-gray-100">
                        {action.label}
                      </div>
                      <div className="text-sm text-gray-400">
                        {action.description}
                      </div>
                    </div>
                    <div className="text-gray-500 group-hover:text-gray-300 transition-colors">
                      →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                  <h2 className="text-xl font-bold text-white">
                    Today's Activity
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm font-medium border border-blue-800/50">
                    {todayLogs.length} records
                  </span>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {todayLogs.slice(0, 10).map((log, index) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-all duration-200 border border-transparent hover:border-gray-600 group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg">
                          {log.employee?.name?.charAt(0) || "U"}
                        </div>
                        {log.clock_in && !log.clock_out && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white truncate">
                          {log.employee?.name || "Unknown Employee"}
                        </div>
                        <div className="text-sm text-gray-300 flex flex-wrap gap-2 mt-1">
                          {log.clock_in && (
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              In:{" "}
                              {new Date(log.clock_in).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                          {log.clock_out && (
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              Out:{" "}
                              {new Date(log.clock_out).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>
                        {log.status && (
                          <div className="mt-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                log.status === "late"
                                  ? "bg-orange-900/50 text-orange-300 border border-orange-800/50"
                                  : log.status === "present"
                                  ? "bg-green-900/50 text-green-300 border border-green-800/50"
                                  : "bg-blue-900/50 text-blue-300 border border-blue-800/50"
                              }`}
                            >
                              {log.status.charAt(0).toUpperCase() +
                                log.status.slice(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          !log.clock_in
                            ? "bg-red-900/50 text-red-300 border-red-800/50"
                            : log.clock_out
                            ? "bg-gray-700 text-gray-300 border-gray-600/50"
                            : "bg-green-900/50 text-green-300 border-green-800/50"
                        }`}
                      >
                        {!log.clock_in
                          ? "Absent"
                          : log.clock_out
                          ? "Completed"
                          : "Active"}
                      </div>
                      {log.work_hours && (
                        <div className="text-sm text-gray-400 font-medium">
                          {parseFloat(log.work_hours).toFixed(1)}h
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {todayLogs.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-6xl mb-4 opacity-50">📊</div>
                    <p className="text-lg font-medium text-gray-400">
                      No activity recorded today
                    </p>
                    <p className="text-sm mt-1 text-gray-500">
                      Attendance records will appear here once employees clock
                      in
                    </p>
                  </div>
                )}
              </div>

              {todayLogs.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <Link
                    to="/attendance/log"
                    className="flex items-center justify-center gap-2 w-full py-3 text-gray-400 hover:text-gray-300 transition-colors font-medium"
                  >
                    View All Attendance Records
                    <span>→</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Status */}
          {/* <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-6 bg-green-500 rounded-full"></div>
              <h3 className="text-lg font-bold text-white">System Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">API Status</span>
                <span className="px-2 py-1 bg-green-900/50 text-green-300 rounded text-xs border border-green-800/50">
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Database</span>
                <span className="px-2 py-1 bg-green-900/50 text-green-300 rounded text-xs border border-green-800/50">
                  Connected
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Last Sync</span>
                <span className="text-gray-300 text-sm">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div> */}

          {/* Quick Tips */}
          <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
              <h3 className="text-lg font-bold text-white">Quick Tips</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Remember to clock in when you start work</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Clock out when leaving for accurate hours</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Contact admin for attendance corrections</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// src/pages/AdminDashboard.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEmployees } from "../hooks/useEmployees";
import { useDepartments } from "../hooks/useDepartments";
import { useAttendanceLogs } from "../hooks/useAttendance";
import ExportModal from "../components/ExportModal";

const AdminDashboard = () => {
  const [exportModal, setExportModal] = useState({
    isOpen: false,
    type: null,
    filters: null,
    departmentId: null,
  });

  const { data: employeesResponse } = useEmployees();
  const { data: departmentsResponse } = useDepartments();
  const today = new Date().toISOString().split("T")[0];
  const { data: todayLogsResponse } = useAttendanceLogs({
    start_date: today,
    end_date: today,
  });

  const employeesData = employeesResponse?.data?.data || {};
  const departmentsData = departmentsResponse?.data?.data || {};
  const todayLogsData = todayLogsResponse?.data || {};

  const employees = employeesData.employees || [];
  const departments = departmentsData.departments || [];
  const todayLogs = todayLogsData.attendances || [];

  const handleExport = (type) => {
    const currentDate = new Date();
    const defaultFilters = {
      start_date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        .toISOString()
        .split("T")[0],
      end_date: currentDate.toISOString().split("T")[0],
    };

    // For department export, we need to set default department ID or let user select
    if (type === "department") {
      // If there are departments, use the first one as default, otherwise null
      const defaultDepartmentId =
        departments.length > 0 ? departments[0].id : null;

      setExportModal({
        isOpen: true,
        type: type,
        filters: {
          ...defaultFilters,
          month: currentDate.getMonth() + 1, // Add month for department reports
          year: currentDate.getFullYear(), // Add year for department reports
        },
        departmentId: defaultDepartmentId,
      });
    } else {
      setExportModal({
        isOpen: true,
        type: type,
        filters: defaultFilters,
        departmentId: null,
      });
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                ⚙️
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400 mt-2">
                  System administration and management
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700">
            <span className="badge bg-red-900/50 text-red-300 border-red-800/50 text-sm">
              ADMINISTRATOR
            </span>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6 hover:border-gray-600 transition-all duration-200 hover:scale-105 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    {stat.title}
                  </div>
                </div>
                <div className="text-4xl opacity-80 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Admin Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Management Actions */}
          <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-white">Management</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/employees/new"
                className="btn bg-gradient-to-r from-blue-500 to-blue-600 border-none text-white hover:from-blue-600 hover:to-blue-700 h-14 flex flex-col items-center justify-center"
              >
                <span className="text-lg">👥</span>
                <span className="text-xs mt-1">Add Employee</span>
              </Link>
              <Link
                to="/departments/new"
                className="btn bg-gradient-to-r from-purple-500 to-purple-600 border-none text-white hover:from-purple-600 hover:to-purple-700 h-14 flex flex-col items-center justify-center"
              >
                <span className="text-lg">🏢</span>
                <span className="text-xs mt-1">Add Department</span>
              </Link>
              <Link
                to="/employees"
                className="btn btn-outline border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 h-14 flex flex-col items-center justify-center"
              >
                <span className="text-lg">📋</span>
                <span className="text-xs mt-1">Manage Employees</span>
              </Link>
              <Link
                to="/departments"
                className="btn btn-outline border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 h-14 flex flex-col items-center justify-center"
              >
                <span className="text-lg">📊</span>
                <span className="text-xs mt-1">Manage Departments</span>
              </Link>
            </div>
          </div>

          {/* Reports & Analytics */}
          <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-6 bg-green-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-white">
                Reports & Analytics
              </h2>
            </div>
            <div className="space-y-4">
              <Link
                to="/attendance/log"
                className="btn bg-gradient-to-r from-cyan-500 to-cyan-600 border-none text-white hover:from-cyan-600 hover:to-cyan-700 w-full justify-start h-12"
              >
                <span className="text-lg mr-3">📊</span>
                Attendance Reports
              </Link>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleExport("attendance")}
                  className="btn bg-gradient-to-r from-green-500 to-green-600 border-none text-white hover:from-green-600 hover:to-green-700 h-14 flex flex-col items-center justify-center p-8"
                >
                  <span className="text-lg">📥</span>
                  <span className="text-xs mt-1">Export Attendance</span>
                </button>
                <button
                  onClick={() => handleExport("summary")}
                  className="btn bg-gradient-to-r from-orange-500 to-orange-600 border-none text-white hover:from-orange-600 hover:to-orange-700 h-14 flex flex-col items-center justify-center p-8"
                >
                  <span className="text-lg">📈</span>
                  <span className="text-xs mt-1">Export Summary</span>
                </button>
              </div>

              {/* <button
                onClick={() => handleExport("department")}
                className="btn btn-outline border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 w-full justify-start h-12"
                disabled={departments.length === 0}
              >
                <span className="text-lg mr-3">🏢</span>
                Export Department Report
                {departments.length === 0 && (
                  <span className="badge badge-warning badge-xs ml-2">
                    No departments
                  </span>
                )}
              </button> */}
            </div>
          </div>
        </div>

        {/* Export Modal */}
        <ExportModal
          isOpen={exportModal.isOpen}
          onClose={() =>
            setExportModal({
              isOpen: false,
              type: null,
              filters: null,
              departmentId: null,
            })
          }
          type={exportModal.type}
          filters={exportModal.filters}
          departmentId={exportModal.departmentId}
          departments={departments}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

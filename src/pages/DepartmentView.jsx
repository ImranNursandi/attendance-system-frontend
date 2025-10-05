// src/pages/DepartmentView.js
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useDepartment } from "../hooks/useDepartments";
import { useEmployees } from "../hooks/useEmployees";

const DepartmentView = () => {
  const { id } = useParams();
  const { data: departmentResponse, isLoading: departmentLoading } =
    useDepartment(id);
  const { data: employeesResponse, isLoading: employeesLoading } =
    useEmployees();

  const department = departmentResponse?.data?.data;
  const employeesData = employeesResponse?.data?.data || {};
  const allEmployees = employeesData.employees || [];

  // Filter employees by this department
  const departmentEmployees = allEmployees.filter(
    (emp) => emp.department_id === parseInt(id)
  );

  if (departmentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-blue-400"></div>
            <p className="text-gray-400 mt-3">Loading department...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-4xl mx-auto flex justify-center items-center min-h-64">
          <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8 text-center">
            <div className="text-6xl mb-4 opacity-50">😕</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Department Not Found
            </h2>
            <p className="text-gray-400 mb-6">
              The department you're looking for doesn't exist.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/departments"
                className="btn bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white hover:from-blue-600 hover:to-purple-700"
              >
                Back to Departments
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format time from "08:30:00" to "08:30"
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString.slice(0, 5); // Takes only HH:MM
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
    };

    const config = statusConfig[status] || {
      label: status || "Unknown",
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
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {department.name?.charAt(0)?.toUpperCase() || "D"}
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  {department.name}
                </h1>
                <p className="text-gray-400 mt-2">Department Details</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to="/departments"
              className="btn btn-outline border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 px-6"
            >
              ← Back to List
            </Link>
            <Link
              to={`/departments/edit/${id}`}
              className="btn bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white hover:from-blue-600 hover:to-purple-700 px-6"
            >
              Edit Department
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">
                  Department Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-400">
                      Department Name
                    </label>
                    <p className="text-xl font-bold text-white bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                      {department.name}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-400">
                      Max Clock In
                    </label>
                    <div className="badge bg-blue-900/50 text-blue-300 border-blue-800/50 font-mono text-lg p-4">
                      {formatTime(department.max_clock_in)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-400">
                      Late Tolerance
                    </label>
                    <p className="text-white text-lg bg-orange-900/30 p-3 rounded-lg border border-orange-800/50">
                      {department.late_tolerance || 0} minutes
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-400">
                      Status
                    </label>
                    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                      <StatusBadge status={department.status} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-400">
                      Max Clock Out
                    </label>
                    <div className="badge bg-blue-900/50 text-blue-300 border-blue-800/50 font-mono text-lg p-4">
                      {formatTime(department.max_clock_out)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-400">
                      Early Leave Penalty
                    </label>
                    <p className="text-white text-lg bg-orange-900/30 p-3 rounded-lg border border-orange-800/50">
                      {department.early_leave_penalty || 0} minutes
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {department.description && (
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <label className="block text-sm font-semibold text-gray-400 mb-3">
                    Description
                  </label>
                  <p className="text-white bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                    {department.description}
                  </p>
                </div>
              )}
            </div>

            {/* Additional Information Card */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">
                  Additional Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-6 bg-gray-700/50 rounded-xl border border-gray-600">
                  <div className="text-3xl mb-3 text-purple-400">👥</div>
                  <div className="font-semibold text-white">
                    Total Employees
                  </div>
                  <div className="text-2xl font-bold text-purple-400 mt-2">
                    {department.employee_count || departmentEmployees.length}
                  </div>
                </div>
                <div className="text-center p-6 bg-gray-700/50 rounded-xl border border-gray-600">
                  <div className="text-3xl mb-3 text-blue-400">📅</div>
                  <div className="font-semibold text-white">Created</div>
                  <div className="text-sm text-gray-400 mt-2">
                    {department.created_at
                      ? new Date(department.created_at).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
                <div className="text-center p-6 bg-gray-700/50 rounded-xl border border-gray-600">
                  <div className="text-3xl mb-3 text-green-400">🔄</div>
                  <div className="font-semibold text-white">Last Updated</div>
                  <div className="text-sm text-gray-400 mt-2">
                    {department.updated_at
                      ? new Date(department.updated_at).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Department Employees Card */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">
                  Department Employees
                </h2>
                <span className="badge bg-purple-900/50 text-purple-300 border-purple-800/50">
                  {departmentEmployees.length}
                </span>
              </div>

              {employeesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="loading loading-spinner loading-md text-purple-400"></div>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {departmentEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-xl border border-gray-600 hover:bg-gray-700 transition-colors group"
                    >
                      <div className="avatar placeholder flex-shrink-0">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl w-12 h-12 flex items-center justify-center font-bold shadow-lg">
                          <span className="font-bold text-sm">
                            {employee.name?.charAt(0)?.toUpperCase() || "E"}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white truncate group-hover:text-gray-100">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-400 truncate">
                          {employee.position || "No position"}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {employee.employee_id}
                        </div>
                      </div>
                      <Link
                        to={`/employees/view/${employee.id}`}
                        className="btn btn-ghost btn-sm text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="View Employee"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  ))}

                  {departmentEmployees.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4 opacity-50">👥</div>
                      <p className="text-gray-400 font-medium">
                        No employees in this department
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Assign employees to this department
                      </p>
                      <Link
                        to="/employees"
                        className="btn btn-outline border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 mt-4"
                      >
                        Manage Employees
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-cyan-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">Quick Actions</h2>
              </div>
              <div className="space-y-3">
                <Link
                  to={`/departments/edit/${id}`}
                  className="btn btn-outline border-blue-600 text-blue-300 hover:bg-blue-900/50 hover:border-blue-500 w-full justify-start"
                >
                  <span className="text-lg mr-2">✏️</span>
                  Edit Department
                </Link>
                <Link
                  to="/employees"
                  className="btn btn-outline border-purple-600 text-purple-300 hover:bg-purple-900/50 hover:border-purple-500 w-full justify-start"
                >
                  <span className="text-lg mr-2">👥</span>
                  Manage Employees
                </Link>
                {/* <button
                  className="btn btn-outline border-red-600 text-red-300 hover:bg-red-900/50 hover:border-red-500 w-full justify-start"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete "${department.name}"? This action cannot be undone.`
                      )
                    ) {
                      // Add delete functionality here
                    }
                  }}
                >
                  <span className="text-lg mr-2">🗑️</span>
                  Delete Department
                </button> */}
              </div>
            </div>

            {/* Attendance Rules Summary */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">
                  Attendance Rules
                </h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Work Day Starts</span>
                  <span className="text-white font-semibold">
                    {formatTime(department.max_clock_in)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Work Day Ends</span>
                  <span className="text-white font-semibold">
                    {formatTime(department.max_clock_out)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Late Tolerance</span>
                  <span className="text-orange-400 font-semibold">
                    {department.late_tolerance || 0} min
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Early Leave Penalty</span>
                  <span className="text-orange-400 font-semibold">
                    {department.early_leave_penalty || 0} min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentView;

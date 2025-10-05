// src/pages/DepartmentList.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDepartments, useDeleteDepartment } from "../hooks/useDepartments";
import { toast } from "react-toastify";

const DepartmentList = () => {
  const { data: departmentsResponse, isLoading, error } = useDepartments();
  const deleteMutation = useDeleteDepartment();
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Extract departments from response
  const departmentsData = departmentsResponse?.data?.data || {};
  const departments = departmentsData.departments || [];
  const pagination = departmentsData.pagination || {};

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <span className={`badge border ${config.color}`}>{config.label}</span>
    );
  };

  const handleDelete = async (dept) => {
    // Check if department has employees
    if (dept.employee_count > 0) {
      toast.error(
        `Cannot delete "${dept.name}" - it has ${dept.employee_count} employees assigned`
      );
      return;
    }

    // Confirm deletion
    if (
      window.confirm(
        `Are you sure you want to delete the "${dept.name}" department? This action cannot be undone.`
      )
    ) {
      setDeletingId(dept.id);
      try {
        await deleteMutation.mutateAsync(dept.id);
      } catch (error) {
        // Error handling is done in the mutation
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-blue-400"></div>
            <p className="text-gray-400 mt-3">Loading departments...</p>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/50 border border-red-800/50 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="text-2xl">⚠️</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Error loading departments</h3>
                <p className="text-red-200 mt-1">{error.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Department Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage departments and their attendance rules
            </p>
          </div>
          <Link
            to="/departments/new"
            className="btn bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white hover:from-blue-600 hover:to-purple-700 px-6"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Department
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm font-semibold">
              Total Departments
            </div>
            <div className="text-3xl font-bold text-blue-400 mt-2">
              {pagination.total || departments.length}
            </div>
            <div className="text-gray-500 text-sm mt-1">All departments</div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm font-semibold">Active</div>
            <div className="text-3xl font-bold text-green-400 mt-2">
              {departments.filter((dept) => dept.status === "active").length}
            </div>
            <div className="text-gray-500 text-sm mt-1">Currently active</div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm font-semibold">
              Total Employees
            </div>
            <div className="text-3xl font-bold text-purple-400 mt-2">
              {departments.reduce(
                (sum, dept) => sum + (dept.employee_count || 0),
                0
              )}
            </div>
            <div className="text-gray-500 text-sm mt-1">
              Across all departments
            </div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm font-semibold">
              Avg Employees
            </div>
            <div className="text-3xl font-bold text-cyan-400 mt-2">
              {departments.length > 0
                ? Math.round(
                    departments.reduce(
                      (sum, dept) => sum + (dept.employee_count || 0),
                      0
                    ) / departments.length
                  )
                : 0}
            </div>
            <div className="text-gray-500 text-sm mt-1">Per department</div>
          </div>
        </div>

        {/* Search Card */}
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex flex-col lg:flex-row gap-4 flex-1 w-full">
              <div className="form-control flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search departments by name or description..."
                    className="w-full input input-bordered bg-gray-700 border-gray-600 text-white placeholder-gray-500 pl-10 h-12"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-gray-400 text-sm bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-600">
              {filteredDepartments.length} of {departments.length} departments
            </div>
          </div>
        </div>

        {/* Departments Table Card */}
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-green-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-white">Departments</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="bg-gray-750 text-gray-300 font-semibold w-16">
                    ID
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold min-w-[200px]">
                    Department
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold min-w-[120px] text-center">
                    Max Clock In
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold min-w-[120px] text-center">
                    Max Clock Out
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold min-w-[120px] text-center">
                    Late Tolerance
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold min-w-[140px] text-center">
                    Early Leave Penalty
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold min-w-[120px] text-center">
                    Employees
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold min-w-[100px] text-center">
                    Status
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold min-w-[140px] text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.map((dept) => (
                  <tr
                    key={dept.id}
                    className="border-b border-gray-700 hover:bg-gray-750/50 transition-colors"
                  >
                    <td className="text-gray-300 font-medium">{dept.id}</td>
                    <td>
                      <div className="flex items-center space-x-4 min-w-0">
                        <div className="avatar placeholder flex-shrink-0">
                          <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl w-12 h-12 flex items-center justify-center font-bold shadow-lg">
                            <span className="font-bold">
                              {dept.name?.charAt(0)?.toUpperCase() || "D"}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-white truncate">
                            {dept.name}
                          </div>
                          {dept.description && (
                            <div className="text-sm text-gray-400 truncate">
                              {dept.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        <span className="badge bg-blue-900/50 text-blue-300 border-blue-800/50 font-mono whitespace-nowrap">
                          {dept.max_clock_in
                            ? dept.max_clock_in.slice(0, 5)
                            : "09:00"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        <span className="badge bg-blue-900/50 text-blue-300 border-blue-800/50 font-mono whitespace-nowrap">
                          {dept.max_clock_out
                            ? dept.max_clock_out.slice(0, 5)
                            : "17:00"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        <span className="badge bg-orange-900/50 text-orange-300 border-orange-800/50 whitespace-nowrap">
                          {dept.late_tolerance || 0} mins
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        <span className="badge bg-orange-900/50 text-orange-300 border-orange-800/50 whitespace-nowrap">
                          {dept.early_leave_penalty || 0} mins
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col items-center space-y-2 min-w-0">
                        <span
                          className={`badge border whitespace-nowrap ${
                            dept.employee_count > 0
                              ? "bg-purple-900/50 text-purple-300 border-purple-800/50"
                              : "bg-gray-700 text-gray-300 border-gray-600"
                          }`}
                        >
                          {dept.employee_count || 0} employees
                        </span>
                        {dept.employee_count > 0 && (
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {Math.round(
                              (dept.employee_count /
                                departments.reduce(
                                  (sum, d) => sum + (d.employee_count || 0),
                                  0
                                )) *
                                100
                            )}
                            % of total
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        <StatusBadge status={dept.status} />
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center space-x-2 min-w-0">
                        <Link
                          to={`/departments/view/${dept.id}`}
                          className="btn btn-sm btn-ghost bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500"
                          title="View Details"
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </Link>

                        <Link
                          to={`/departments/edit/${dept.id}`}
                          className="btn btn-sm btn-ghost bg-blue-900/50 border-blue-800/50 text-blue-300 hover:bg-blue-800/50"
                          title="Edit Department"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Link>

                        <button
                          onClick={() => handleDelete(dept)}
                          className={`btn btn-sm btn-ghost flex-shrink-0 ${
                            dept.employee_count > 0
                              ? "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
                              : "bg-red-900/50 border-red-800/50 text-red-300 hover:bg-red-800/50"
                          }`}
                          title={
                            dept.employee_count > 0
                              ? `Cannot delete - ${dept.employee_count} employees assigned`
                              : "Delete Department"
                          }
                          disabled={
                            deleteMutation.isLoading ||
                            dept.employee_count > 0 ||
                            deletingId === dept.id
                          }
                        >
                          {deleteMutation.isLoading &&
                          deletingId === dept.id ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredDepartments.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 opacity-50">🏢</div>
                <h3 className="text-xl font-bold text-gray-300 mb-3">
                  No departments found
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {searchTerm
                    ? "Try adjusting your search terms to find what you're looking for."
                    : "No departments have been created in the system yet."}
                </p>
                <Link
                  to="/departments/new"
                  className="btn bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white hover:from-blue-600 hover:to-purple-700"
                >
                  Create Your First Department
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentList;

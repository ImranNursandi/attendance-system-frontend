// src/pages/EmployeeList.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useEmployees, useDeleteEmployee } from "../hooks/useEmployees";
import { useDepartments } from "../hooks/useDepartments";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { role } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  // Get departments data
  const { data: departmentsResponse } = useDepartments();
  const departmentsData = departmentsResponse?.data?.data || {};
  const allDepartments = departmentsData.departments || [];

  // Build query parameters for the API
  const queryParams = {
    page: currentPage,
    limit: 10,
  };

  // Add search if provided
  if (debouncedSearch) {
    queryParams.search = debouncedSearch;
  }

  // Add status filter if not "all"
  if (statusFilter !== "all") {
    queryParams.status = statusFilter;
  }

  // Add department filter if not "all" - use department ID
  if (departmentFilter !== "all") {
    queryParams.department_id = departmentFilter;
  }

  // Use the hook with pagination and filters
  const {
    data: employeesResponse,
    isLoading,
    error,
    refetch,
  } = useEmployees(queryParams);

  const deleteMutation = useDeleteEmployee();

  // Extract data from response
  const employeesData = employeesResponse?.data?.data || {};
  const employees = employeesData.employees || [];
  const pagination = employeesData.pagination || {};

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, departmentFilter]);

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
      suspended: {
        label: "Suspended",
        color: "bg-orange-900/50 text-orange-300 border-orange-800/50",
      },
    };

    const config = statusConfig[status] || {
      label: status || "Unknown",
      color: "bg-gray-700 text-gray-300 border-gray-600",
    };

    return (
      <span className={`badge badge-sm border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const totalPages = pagination.total_page || 1;
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          className="join-item btn btn-sm bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <button
            key="ellipsis1"
            className="join-item btn btn-sm bg-gray-700 border-gray-600 text-gray-400"
          >
            ...
          </button>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`join-item btn btn-sm border-gray-600 ${
            currentPage === i
              ? "bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <button
            key="ellipsis2"
            className="join-item btn btn-sm bg-gray-700 border-gray-600 text-gray-400"
          >
            ...
          </button>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          className="join-item btn btn-sm bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-blue-400"></div>
            <p className="text-gray-400 mt-3">Loading employees...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/50 border border-red-800/50 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="text-2xl">⚠️</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Error loading employees</h3>
                <p className="text-red-200 mt-1">{error.message}</p>
              </div>
              <button
                onClick={() => refetch()}
                className="btn btn-outline border-red-700 text-red-300 hover:bg-red-800/50"
              >
                Retry
              </button>
            </div>
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
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Employee Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage your team members and their information
            </p>
          </div>
          {role === "admin" && (
            <Link
              to="/employees/new"
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
              Add Employee
            </Link>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm font-semibold">
              Total Employees
            </div>
            <div className="text-3xl font-bold text-blue-400 mt-2">
              {pagination.total || 0}
            </div>
            <div className="text-gray-500 text-sm mt-1">All team members</div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm font-semibold">Active</div>
            <div className="text-3xl font-bold text-green-400 mt-2">
              {
                employees.filter(
                  (emp) => emp.is_active || emp.status === "active"
                ).length
              }
            </div>
            <div className="text-gray-500 text-sm mt-1">Currently working</div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm font-semibold">
              Departments
            </div>
            <div className="text-3xl font-bold text-purple-400 mt-2">
              {allDepartments.length}
            </div>
            <div className="text-gray-500 text-sm mt-1">
              Across organization
            </div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm font-semibold">This Page</div>
            <div className="text-3xl font-bold text-cyan-400 mt-2">
              {employees.length}
            </div>
            <div className="text-gray-500 text-sm mt-1">
              Page {currentPage} of {pagination.total_page || 1}
            </div>
          </div>
        </div>

        {/* Filters and Search Card */}
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex flex-col lg:flex-row gap-4 flex-1 w-full">
              {/* Search Input */}
              <div className="form-control flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, employee ID, or position..."
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

              {/* Status Filter */}
              <div className="form-control">
                <select
                  className="select select-bordered bg-gray-700 border-gray-600 text-white h-12 min-w-40"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {/* Department Filter */}
              {allDepartments.length > 0 && (
                <div className="form-control">
                  <select
                    className="select select-bordered bg-gray-700 border-gray-600 text-white h-12 min-w-48"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="all">All Departments</option>
                    {allDepartments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="text-gray-400 text-sm bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-600">
              {pagination.total || 0} total employees
            </div>
          </div>
        </div>

        {/* Employees Table Card */}
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-green-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-white">Employees</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="bg-gray-750 text-gray-300 font-semibold w-16">
                    #
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold">
                    Employee
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold">
                    Employee ID
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold">
                    Department
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold">
                    Position
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold">
                    Status
                  </th>
                  <th className="bg-gray-750 text-gray-300 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr
                    key={employee.id}
                    className="border-b border-gray-700 hover:bg-gray-750/50 transition-colors"
                  >
                    <td className="text-gray-300 font-medium">
                      {(currentPage - 1) * (pagination.limit || 10) + index + 1}
                    </td>
                    <td>
                      <div className="flex items-center space-x-4">
                        <div className="avatar placeholder">
                          <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl w-12 h-12 flex items-center justify-center font-bold shadow-lg">
                            {employee.name?.charAt(0)?.toUpperCase() || "E"}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-white">
                            {employee.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {employee.phone || "No phone"}
                          </div>
                          {employee.email && (
                            <div className="text-xs text-gray-500">
                              {employee.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-mono badge bg-blue-900/50 text-blue-300 border-blue-800/50">
                        {employee.employee_id}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-gray-700 text-gray-300 border-gray-600">
                        {employee.department?.name || (
                          <span className="text-gray-400">No Department</span>
                        )}
                      </span>
                    </td>
                    <td className="text-gray-300">
                      {employee.position || (
                        <span className="text-gray-500">Not specified</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={employee.status} />
                    </td>
                    <td>
                      <div className="flex justify-center space-x-2">
                        {/* View Button - All roles */}
                        <Link
                          to={`/employees/view/${employee.id}`}
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

                        {/* Edit Button - Admin only */}
                        {role === "admin" && (
                          <>
                            <Link
                              to={`/employees/edit/${employee.id}`}
                              className="btn btn-sm btn-ghost bg-blue-900/50 border-blue-800/50 text-blue-300 hover:bg-blue-800/50"
                              title="Edit Employee"
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

                            {/* Delete Button - Admin only */}
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Are you sure you want to delete ${employee.name}? This action cannot be undone.`
                                  )
                                ) {
                                  deleteMutation.mutate(employee.id, {
                                    onSuccess: () => {
                                      // Reset filters and pagination
                                      setSearchTerm("");
                                      setDebouncedSearch("");
                                      setStatusFilter("all");
                                      setDepartmentFilter("all");
                                      setCurrentPage(1);

                                      queryClient.invalidateQueries([
                                        "employees",
                                      ]);
                                    },
                                  });
                                }
                              }}
                              className="btn btn-sm btn-ghost bg-red-900/50 border-red-800/50 text-red-300 hover:bg-red-800/50"
                              title="Delete Employee"
                              disabled={deleteMutation.isLoading}
                            >
                              {deleteMutation.isLoading ? (
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
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {employees.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 opacity-50">👥</div>
                <h3 className="text-xl font-bold text-gray-300 mb-3">
                  No employees found
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {searchTerm ||
                  statusFilter !== "all" ||
                  departmentFilter !== "all"
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "No employees have been added to the system yet."}
                </p>
                {role === "admin" && (
                  <Link
                    to="/employees/new"
                    className="btn bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white hover:from-blue-600 hover:to-purple-700"
                  >
                    Add Your First Employee
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.total_page > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center p-6 border-t border-gray-700 gap-4">
              <div className="text-gray-400 text-sm">
                Showing {(currentPage - 1) * (pagination.limit || 10) + 1} to{" "}
                {Math.min(
                  currentPage * (pagination.limit || 10),
                  pagination.total
                )}{" "}
                of {pagination.total} employees
              </div>

              <div className="join">
                <button
                  className="join-item btn btn-sm bg-gray-700 border-gray-600 text-white hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  «
                </button>

                {renderPaginationButtons()}

                <button
                  className="join-item btn btn-sm bg-gray-700 border-gray-600 text-white hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500"
                  disabled={currentPage === pagination.total_page}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;

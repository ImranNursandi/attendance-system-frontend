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

  // Get unique departments from current employees for display
  const currentDepartments = [
    ...new Set(employees.map((emp) => emp.department?.name).filter(Boolean)),
  ];

  // Status badge component
  const StatusBadge = ({ isActive, status }) => {
    if (status) {
      const statusConfig = {
        active: { label: "Active", color: "badge-success" },
        inactive: { label: "Inactive", color: "badge-error" },
        suspended: { label: "Suspended", color: "badge-warning" },
      };

      const config = statusConfig[status] || {
        label: status,
        color: "badge-info",
      };
      return <span className={`badge ${config.color}`}>{config.label}</span>;
    }

    return (
      <span className={`badge ${isActive ? "badge-success" : "badge-error"}`}>
        {isActive ? "Active" : "Inactive"}
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
          className="join-item btn btn-sm"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <button key="ellipsis1" className="join-item btn btn-sm btn-disabled">
            ...
          </button>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`join-item btn btn-sm ${
            currentPage === i ? "btn-active btn-primary" : ""
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
          <button key="ellipsis2" className="join-item btn btn-sm btn-disabled">
            ...
          </button>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          className="join-item btn btn-sm"
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
      <div className="flex justify-center items-center min-h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <span className="ml-3">Loading employees...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error loading employees: {error.message}</span>
        </div>
        <div className="flex-none">
          <button onClick={() => refetch()} className="btn btn-sm btn-ghost">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your team members and their information
          </p>
        </div>
        {role === "admin" && (
          <Link to="/employees/new" className="btn btn-primary">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Total Employees</div>
          <div className="stat-value text-primary">{pagination.total || 0}</div>
          <div className="stat-desc">All team members</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Active</div>
          <div className="stat-value text-success">
            {
              employees.filter(
                (emp) => emp.is_active || emp.status === "active"
              ).length
            }
          </div>
          <div className="stat-desc">Currently working</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Departments</div>
          <div className="stat-value text-secondary">
            {allDepartments.length}
          </div>
          <div className="stat-desc">Across organization</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">This Page</div>
          <div className="stat-value text-accent">{employees.length}</div>
          <div className="stat-desc">
            Page {currentPage} of {pagination.total_page || 1}
          </div>
        </div>
      </div>

      {/* Filters and Search Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col lg:flex-row gap-4 flex-1">
              {/* Search Input */}
              <div className="form-control flex-1">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Search by name, employee ID, or position..."
                    className="input input-bordered flex-1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-square">
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Status Filter */}
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Department Filter - Now using IDs */}
              {allDepartments.length > 0 && (
                <div className="form-control">
                  <select
                    className="select select-bordered"
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

            <div className="text-sm opacity-75">
              {pagination.total || 0} total employees
            </div>
          </div>
        </div>
      </div>

      {/* Employees Table Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr className="bg-base-200">
                  <th className="w-16">#</th>
                  <th>Employee</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-base-200 transition-colors"
                  >
                    <td className="font-semibold">
                      {(currentPage - 1) * (pagination.limit || 10) + index + 1}
                    </td>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-12">
                            <span className="font-bold">
                              {employee.name?.charAt(0)?.toUpperCase() || "E"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{employee.name}</div>
                          <div className="text-sm opacity-75">
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
                      <span className="font-mono badge badge-outline">
                        {employee.employee_id}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-ghost">
                        {employee.department?.name || (
                          <span className="text-gray-400">No Department</span>
                        )}
                      </span>
                    </td>
                    <td>
                      {employee.position || (
                        <span className="text-gray-400">Not specified</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge
                        isActive={employee.is_active}
                        status={employee.status}
                      />
                    </td>
                    <td>
                      <div className="flex justify-center space-x-1">
                        {/* View Button - All roles */}
                        <Link
                          to={`/employees/view/${employee.id}`}
                          className="btn btn-sm btn-ghost btn-square"
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
                              className="btn btn-sm btn-ghost btn-square"
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
                              className="btn btn-sm btn-ghost btn-square text-error"
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
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-lg font-semibold mb-2">
                  No employees found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ||
                  statusFilter !== "all" ||
                  departmentFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "No employees have been added yet"}
                </p>
                {role === "admin" && (
                  <Link to="/employees/new" className="btn btn-primary">
                    Add Your First Employee
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.total_page > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t gap-4">
              <div className="text-sm opacity-75">
                Showing {(currentPage - 1) * (pagination.limit || 10) + 1} to{" "}
                {Math.min(
                  currentPage * (pagination.limit || 10),
                  pagination.total
                )}{" "}
                of {pagination.total} employees
              </div>

              <div className="join">
                <button
                  className="join-item btn btn-sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  «
                </button>

                {renderPaginationButtons()}

                <button
                  className="join-item btn btn-sm"
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

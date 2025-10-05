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
  const StatusBadge = ({ status, isActive }) => {
    if (status) {
      const statusConfig = {
        active: { label: "Active", color: "badge-success" },
        inactive: { label: "Inactive", color: "badge-error" },
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
      <div className="flex justify-center items-center min-h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <span className="ml-3">Loading departments...</span>
      </div>
    );

  if (error)
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
          <span>Error loading departments: {error.message}</span>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Department Management</h1>
          <p className="text-gray-600 mt-1">
            Manage departments and their attendance rules
          </p>
        </div>
        <Link to="/departments/new" className="btn btn-primary">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Total Departments</div>
          <div className="stat-value text-primary">
            {pagination.total || departments.length}
          </div>
          <div className="stat-desc">All departments</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Active</div>
          <div className="stat-value text-success">
            {departments.filter((dept) => dept.status === "active").length}
          </div>
          <div className="stat-desc">Currently active</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Total Employees</div>
          <div className="stat-value text-secondary">
            {departments.reduce(
              (sum, dept) => sum + (dept.employee_count || 0),
              0
            )}
          </div>
          <div className="stat-desc">Across all departments</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Avg Employees</div>
          <div className="stat-value text-accent">
            {departments.length > 0
              ? Math.round(
                  departments.reduce(
                    (sum, dept) => sum + (dept.employee_count || 0),
                    0
                  ) / departments.length
                )
              : 0}
          </div>
          <div className="stat-desc">Per department</div>
        </div>
      </div>

      {/* Search Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col lg:flex-row gap-4 flex-1">
              <div className="form-control flex-1">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Search departments by name or description..."
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
            </div>
            <div className="text-sm opacity-75">
              {filteredDepartments.length} of {departments.length} departments
            </div>
          </div>
        </div>
      </div>

      {/* Departments Table Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr className="bg-base-200">
                  <th className="w-16">ID</th>
                  <th className="min-w-[200px]">Department</th>
                  <th className="min-w-[120px]">Max Clock In</th>
                  <th className="min-w-[120px]">Max Clock Out</th>
                  <th className="min-w-[120px]">Late Tolerance</th>
                  <th className="min-w-[140px]">Early Leave Penalty</th>
                  <th className="min-w-[120px]">Employees</th>
                  <th className="min-w-[100px]">Status</th>
                  <th className="min-w-[140px] text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.map((dept) => (
                  <tr
                    key={dept.id}
                    className="hover:bg-base-200 transition-colors"
                  >
                    <td className="font-semibold">{dept.id}</td>
                    <td>
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="avatar placeholder flex-shrink-0">
                          <div className="bg-secondary text-secondary-content rounded-full w-12">
                            <span className="font-bold">
                              {dept.name?.charAt(0)?.toUpperCase() || "D"}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold truncate">{dept.name}</div>
                          {dept.description && (
                            <div className="text-sm text-gray-600 truncate">
                              {dept.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        <span className="badge badge-info badge-lg font-mono whitespace-nowrap">
                          {dept.max_clock_in
                            ? dept.max_clock_in.slice(0, 5)
                            : "09:00"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        <span className="badge badge-info badge-lg font-mono whitespace-nowrap">
                          {dept.max_clock_out
                            ? dept.max_clock_out.slice(0, 5)
                            : "17:00"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        <span className="badge badge-warning whitespace-nowrap">
                          {dept.late_tolerance || 0} mins
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        <span className="badge badge-warning whitespace-nowrap">
                          {dept.early_leave_penalty || 0} mins
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col items-center space-y-1 min-w-0">
                        <span
                          className={`badge ${
                            dept.employee_count > 0
                              ? "badge-primary"
                              : "badge-outline"
                          } whitespace-nowrap`}
                        >
                          {dept.employee_count || 0} employees
                        </span>
                        {dept.employee_count > 0 && (
                          <span className="text-xs text-gray-500 whitespace-nowrap">
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
                        <StatusBadge
                          status={dept.status}
                          isActive={dept.is_active}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center space-x-1 min-w-0">
                        <Link
                          to={`/departments/view/${dept.id}`}
                          className="btn btn-sm btn-ghost btn-square flex-shrink-0"
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
                          className="btn btn-sm btn-ghost btn-square flex-shrink-0"
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
                          className={`btn btn-sm btn-ghost btn-square flex-shrink-0 ${
                            dept.employee_count > 0
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-error"
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
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏢</div>
                <h3 className="text-lg font-semibold mb-2">
                  No departments found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "No departments have been created yet"}
                </p>
                <Link to="/departments/new" className="btn btn-primary">
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

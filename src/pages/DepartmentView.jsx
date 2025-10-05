// src/pages/DepartmentView.js
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useDepartment } from "../hooks/useDepartments"; // You need to create this hook
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

  console.log("Department data:", department);
  console.log("All employees:", allEmployees);

  if (departmentLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="ml-3">Loading department...</span>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="card-title justify-center">Department Not Found</h2>
            <p>The department you're looking for doesn't exist.</p>
            <div className="card-actions justify-center mt-4">
              <Link to="/departments" className="btn btn-primary">
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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{department.name}</h1>
          <p className="text-gray-600 mt-1">Department Details</p>
        </div>
        <div className="flex gap-2">
          <Link to="/departments" className="btn btn-outline">
            ← Back to List
          </Link>
          <Link to={`/departments/edit/${id}`} className="btn btn-primary">
            Edit Department
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                🏢 Department Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="label-text font-semibold text-gray-500">
                      Department Name
                    </label>
                    <p className="text-lg font-bold">{department.name}</p>
                  </div>
                  <div>
                    <label className="label-text font-semibold text-gray-500">
                      Max Clock In
                    </label>
                    <div className="badge badge-info badge-lg font-mono">
                      {formatTime(department.max_clock_in)}
                    </div>
                  </div>
                  <div>
                    <label className="label-text font-semibold text-gray-500">
                      Late Tolerance
                    </label>
                    <p className="text-lg">
                      {department.late_tolerance || 0} minutes
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="label-text font-semibold text-gray-500">
                      Status
                    </label>
                    <div className="mt-1">
                      <span
                        className={`badge badge-lg ${
                          department.status === "active"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {department.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="label-text font-semibold text-gray-500">
                      Max Clock Out
                    </label>
                    <div className="badge badge-info badge-lg font-mono">
                      {formatTime(department.max_clock_out)}
                    </div>
                  </div>
                  <div>
                    <label className="label-text font-semibold text-gray-500">
                      Early Leave Penalty
                    </label>
                    <p className="text-lg">
                      {department.early_leave_penalty || 0} minutes
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {department.description && (
                <div className="mt-6 pt-6 border-t">
                  <label className="label-text font-semibold text-gray-500">
                    Description
                  </label>
                  <p className="mt-2 text-lg">{department.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                📊 Additional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-base-200 rounded-lg">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="font-semibold">Total Employees</div>
                  <div className="text-2xl font-bold text-primary">
                    {department.employee_count || departmentEmployees.length}
                  </div>
                </div>
                <div className="text-center p-4 bg-base-200 rounded-lg">
                  <div className="text-2xl mb-2">📅</div>
                  <div className="font-semibold">Created</div>
                  <div className="text-sm text-gray-600">
                    {department.created_at
                      ? new Date(department.created_at).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
                <div className="text-center p-4 bg-base-200 rounded-lg">
                  <div className="text-2xl mb-2">🔄</div>
                  <div className="font-semibold">Last Updated</div>
                  <div className="text-sm text-gray-600">
                    {department.updated_at
                      ? new Date(department.updated_at).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Employees Card */}
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                👥 Department Employees
                <span className="badge badge-primary">
                  {departmentEmployees.length}
                </span>
              </h2>

              {employeesLoading ? (
                <div className="flex justify-center py-4">
                  <span className="loading loading-spinner loading-sm"></span>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {departmentEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                    >
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-10">
                          <span className="font-bold text-sm">
                            {employee.name?.charAt(0)?.toUpperCase() || "E"}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {employee.name}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {employee.position || "No position"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {employee.employee_id}
                        </div>
                      </div>
                    </div>
                  ))}

                  {departmentEmployees.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">👥</div>
                      <p className="text-gray-500">
                        No employees in this department
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Assign employees to this department
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                ⚡ Quick Actions
              </h2>
              <div className="space-y-2">
                <Link
                  to={`/departments/edit/${id}`}
                  className="btn btn-outline btn-sm w-full justify-start"
                >
                  ✏️ Edit Department
                </Link>
                <Link
                  to="/employees"
                  className="btn btn-outline btn-sm w-full justify-start"
                >
                  👥 Manage Employees
                </Link>
                <button
                  className="btn btn-outline btn-error btn-sm w-full justify-start"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete ${department.name}?`
                      )
                    ) {
                      // Add delete functionality here
                    }
                  }}
                >
                  🗑️ Delete Department
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentView;

// src/pages/DepartmentForm.js
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDepartment,
  useCreateDepartment,
  useUpdateDepartment,
} from "../hooks/useDepartments";
import { toast } from "react-toastify";

const DepartmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const toastId = React.useRef(null);

  const { data: departmentResponse, isLoading: departmentLoading } =
    useDepartment(id);
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();

  const department = departmentResponse?.data?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      max_clock_in: "09:00",
      max_clock_out: "17:00",
      late_tolerance: 15,
      early_leave_penalty: 15,
      status: "active",
    },
  });

  // Populate form when department data loads
  useEffect(() => {
    if (isEdit && department) {
      reset({
        name: department.name || "",
        description: department.description || "",
        max_clock_in: department.max_clock_in
          ? department.max_clock_in.slice(0, 5)
          : "09:00",
        max_clock_out: department.max_clock_out
          ? department.max_clock_out.slice(0, 5)
          : "17:00",
        late_tolerance: department.late_tolerance || 15,
        early_leave_penalty: department.early_leave_penalty || 15,
        status: department.status || "active",
      });
    }
  }, [isEdit, department, reset]);

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      late_tolerance: parseInt(data.late_tolerance),
      early_leave_penalty: parseInt(data.early_leave_penalty),
    };

    if (isEdit) {
      updateMutation.mutate(
        { id, data: formattedData },
        {
          onSuccess: () => {
            toast.success("Department updated successfully");
            navigate("/departments");
          },
          onError: (error) => {
            if (!toast.isActive(toastId.current)) {
              toastId.current = toast.error(
                error.response?.data?.error || "Failed to update department"
              );
            }
          },
        }
      );
    } else {
      createMutation.mutate(formattedData, {
        onSuccess: () => {
          toast.success("Department created successfully");
          navigate("/departments");
        },
        onError: (error) => {
          if (!toast.isActive(toastId.current)) {
            toastId.current = toast.error(
              error.response?.data?.error || "Failed to create department"
            );
          }
        },
      });
    }
  };

  if (isEdit && departmentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-4xl mx-auto flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-blue-400"></div>
            <p className="text-gray-400 mt-3">Loading department data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {isEdit ? "Edit Department" : "Add New Department"}
            </h1>
            <p className="text-gray-400 mt-2">
              {isEdit
                ? "Update department details and rules"
                : "Create a new department with attendance rules"}
            </p>
          </div>
          <button
            onClick={() => navigate("/departments")}
            className="btn btn-outline border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 px-6"
          >
            ← Back to List
          </button>
        </div>

        {/* Information Card */}
        <div
          className={`bg-gradient-to-r ${
            isEdit
              ? "from-blue-900/50 to-blue-800/30"
              : "from-green-900/50 to-green-800/30"
          } rounded-2xl shadow-lg border ${
            isEdit ? "border-blue-800/50" : "border-green-800/50"
          } p-6`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-xl ${
                isEdit ? "bg-blue-900/50" : "bg-green-900/50"
              } border ${
                isEdit ? "border-blue-800/50" : "border-green-800/50"
              }`}
            >
              <span className="text-2xl">{isEdit ? "📝" : "🏢"}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg mb-3">
                {isEdit ? "Editing Department" : "New Department Information"}
              </h3>
              <div className="text-gray-300 text-sm">
                {isEdit
                  ? "Update department details, attendance rules, and policies. Changes will affect all employees in this department."
                  : "Create a new department with specific attendance rules and policies. These settings will determine punctuality calculations for all assigned employees."}
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-white">
                Department Details
              </h2>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6 pb-8 border-b border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                  <h3 className="text-lg font-bold text-white">
                    Basic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Department Name *
                    </label>
                    <input
                      type="text"
                      className="w-full input input-bordered bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 h-12"
                      {...register("name", {
                        required: "Department name is required",
                      })}
                      placeholder="Engineering Department"
                    />
                    {errors.name && (
                      <div className="text-red-400 text-sm flex items-center gap-2 mt-1">
                        <span>⚠️</span>
                        {errors.name.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Status
                    </label>
                    <select
                      className="w-full select select-bordered bg-gray-700 border-gray-600 text-white focus:border-blue-500 h-12"
                      {...register("status")}
                    >
                      <option value="active" className="text-green-400">
                        Active
                      </option>
                      <option value="inactive" className="text-red-400">
                        Inactive
                      </option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300">
                    Description
                  </label>
                  <textarea
                    className="w-full textarea textarea-bordered bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 h-24 resize-none"
                    placeholder="Describe the department's purpose, responsibilities, and any specific notes..."
                    {...register("description")}
                  />
                </div>
              </div>

              {/* Attendance Rules Section */}
              <div className="space-y-6 pb-8 border-b border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                  <h3 className="text-lg font-bold text-white">
                    Attendance Rules
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Max Clock In Time *
                    </label>
                    <input
                      type="time"
                      className="w-full input input-bordered bg-gray-700 border-gray-600 text-white focus:border-blue-500 h-12"
                      {...register("max_clock_in", {
                        required: "Max clock in time is required",
                      })}
                    />
                    {errors.max_clock_in && (
                      <div className="text-red-400 text-sm flex items-center gap-2 mt-1">
                        <span>⚠️</span>
                        {errors.max_clock_in.message}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 bg-gray-700/50 p-2 rounded border border-gray-600 mt-2">
                      Latest allowed clock-in time before being marked as late
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Max Clock Out Time *
                    </label>
                    <input
                      type="time"
                      className="w-full input input-bordered bg-gray-700 border-gray-600 text-white focus:border-blue-500 h-12"
                      {...register("max_clock_out", {
                        required: "Max clock out time is required",
                      })}
                    />
                    {errors.max_clock_out && (
                      <div className="text-red-400 text-sm flex items-center gap-2 mt-1">
                        <span>⚠️</span>
                        {errors.max_clock_out.message}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 bg-gray-700/50 p-2 rounded border border-gray-600 mt-2">
                      Earliest allowed clock-out time before penalty
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Late Tolerance (minutes)
                    </label>
                    <input
                      type="number"
                      className="w-full input input-bordered bg-gray-700 border-gray-600 text-white focus:border-blue-500 h-12"
                      {...register("late_tolerance")}
                      min="0"
                      max="120"
                      step="5"
                    />
                    <div className="text-xs text-gray-500 bg-gray-700/50 p-2 rounded border border-gray-600 mt-2">
                      Grace period for late arrivals before marking as late
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Early Leave Penalty (minutes)
                    </label>
                    <input
                      type="number"
                      className="w-full input input-bordered bg-gray-700 border-gray-600 text-white focus:border-blue-500 h-12"
                      {...register("early_leave_penalty")}
                      min="0"
                      max="120"
                      step="5"
                    />
                    <div className="text-xs text-gray-500 bg-gray-700/50 p-2 rounded border border-gray-600 mt-2">
                      Threshold for early departure penalty
                    </div>
                  </div>
                </div>

                {/* Rules Summary */}
                <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 mt-4">
                  <h4 className="font-semibold text-white mb-3">
                    Rules Summary
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300">
                        Employees can clock in until
                      </span>
                      <span className="font-mono text-blue-400 bg-blue-900/30 px-2 py-1 rounded">
                        {watch("max_clock_in") || "09:00"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300">
                        Employees can clock out from
                      </span>
                      <span className="font-mono text-blue-400 bg-blue-900/30 px-2 py-1 rounded">
                        {watch("max_clock_out") || "17:00"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-gray-300">Late tolerance</span>
                      <span className="font-mono text-orange-400 bg-orange-900/30 px-2 py-1 rounded">
                        {watch("late_tolerance") || 15} min
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-gray-300">Early leave penalty</span>
                      <span className="font-mono text-orange-400 bg-orange-900/30 px-2 py-1 rounded">
                        {watch("early_leave_penalty") || 15} min
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => navigate("/departments")}
                  className="btn btn-outline border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 flex-1 sm:flex-none h-12"
                  disabled={
                    createMutation.isLoading || updateMutation.isLoading
                  }
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white hover:from-blue-600 hover:to-purple-700 flex-1 sm:flex-none h-12"
                  disabled={
                    createMutation.isLoading || updateMutation.isLoading
                  }
                >
                  {createMutation.isLoading || updateMutation.isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      {isEdit ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{isEdit ? "Update Department" : "Create Department"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Loading Overlay */}
        {(createMutation.isLoading || updateMutation.isLoading) && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 max-w-md w-full mx-4">
              <div className="flex items-center space-x-4">
                <div className="loading loading-spinner loading-lg text-blue-400"></div>
                <div>
                  <p className="font-semibold text-white text-lg">
                    {isEdit
                      ? "Updating Department..."
                      : "Creating Department..."}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Please wait while we process your request
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Helper function to watch form values for the rules summary
  function watch(fieldName) {
    // This is a simplified version - in a real implementation, you'd use react-hook-form's watch function
    const form = document.querySelector("form");
    if (!form) return "";

    const input = form.querySelector(`[name="${fieldName}"]`);
    return input ? input.value : "";
  }
};

export default DepartmentForm;

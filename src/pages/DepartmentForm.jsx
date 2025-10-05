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
      <div className="flex justify-center items-center min-h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <span className="ml-3">Loading department data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {isEdit ? "Edit Department" : "Add New Department"}
        </h1>
        <button
          onClick={() => navigate("/departments")}
          className="btn btn-outline btn-sm"
        >
          ← Back to List
        </button>
      </div>

      {/* Information Card */}
      <div
        className={`alert ${isEdit ? "alert-info" : "alert-success"} shadow-lg`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <div>
          <h3 className="font-bold">
            {isEdit ? "Editing Department" : "New Department Information"}
          </h3>
          <div className="text-xs">
            {isEdit
              ? "Update department details and attendance rules."
              : "Create a new department with specific attendance rules and policies."}
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control flex flex-col gap-2">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Department Name *
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered input-md"
                    {...register("name", {
                      required: "Department name is required",
                    })}
                    placeholder="Engineering Department"
                  />
                  {errors.name && (
                    <span className="text-error text-sm mt-1">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                <div className="form-control flex flex-col gap-2">
                  <label className="label">
                    <span className="label-text font-semibold">Status</span>
                  </label>
                  <select
                    className="select select-bordered select-md"
                    {...register("status")}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-control flex flex-col gap-2 mt-4">
                <label className="label">
                  <span className="label-text font-semibold">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24 textarea-md"
                  placeholder="Describe the department's purpose and responsibilities..."
                  {...register("description")}
                />
              </div>
            </div>

            {/* Attendance Rules Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">
                Attendance Rules
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control flex flex-col gap-2">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Max Clock In Time *
                    </span>
                  </label>
                  <input
                    type="time"
                    className="input input-bordered input-md"
                    {...register("max_clock_in", {
                      required: "Max clock in time is required",
                    })}
                  />
                  {errors.max_clock_in && (
                    <span className="text-error text-sm mt-1">
                      {errors.max_clock_in.message}
                    </span>
                  )}
                  <div className="text-xs text-gray-500">
                    Latest allowed clock-in time
                  </div>
                </div>

                <div className="form-control flex flex-col gap-2">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Max Clock Out Time *
                    </span>
                  </label>
                  <input
                    type="time"
                    className="input input-bordered input-md"
                    {...register("max_clock_out", {
                      required: "Max clock out time is required",
                    })}
                  />
                  {errors.max_clock_out && (
                    <span className="text-error text-sm mt-1">
                      {errors.max_clock_out.message}
                    </span>
                  )}
                  <div className="text-xs text-gray-500">
                    Earliest allowed clock-out time
                  </div>
                </div>

                <div className="form-control flex flex-col gap-2">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Late Tolerance (minutes)
                    </span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered input-md"
                    {...register("late_tolerance")}
                    min="0"
                    max="120"
                    step="5"
                  />
                  <div className="text-xs text-gray-500">
                    Grace period for late arrivals
                  </div>
                </div>

                <div className="form-control flex flex-col gap-2">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Early Leave Penalty (minutes)
                    </span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered input-md"
                    {...register("early_leave_penalty")}
                    min="0"
                    max="120"
                    step="5"
                  />
                  <div className="text-xs text-gray-500">
                    Penalty for leaving early
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate("/departments")}
                className="btn btn-outline btn-wide"
                disabled={createMutation.isLoading || updateMutation.isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-wide"
                disabled={createMutation.isLoading || updateMutation.isLoading}
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

      {/* Loading State */}
      {(createMutation.isLoading || updateMutation.isLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-xl">
            <div className="flex items-center space-x-4">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <div>
                <p className="font-semibold">
                  {isEdit ? "Updating Department..." : "Creating Department..."}
                </p>
                <p className="text-sm text-gray-500">
                  Please wait while we process your request
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentForm;

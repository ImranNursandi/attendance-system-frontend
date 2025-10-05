// src/pages/Profile.js
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../services/authService";
import { toast } from "react-toastify";
import { updateUser } from "../store/slices/authSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: user
      ? {
          username: user.username || "",
          email: user.email || "",
        }
      : {},
  });

  const onSubmit = async (data) => {
    try {
      const updateData = {
        username: data.username,
        email: data.email,
      };

      const response = await authService.updateProfile(updateData);

      if (response.data.success) {
        dispatch(
          updateUser({
            username: data.username,
            email: data.email,
          })
        );

        toast.success("Profile updated successfully");
      } else {
        toast.error(response.data.message || "Failed to update profile 1");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update profile 2");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information Card - USER TABLE DATA */}
        <div className="card bg-base-100 shadow-xl lg:col-span-2">
          <div className="card-body">
            <h2 className="card-title">Account Information</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Username *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters",
                      },
                    })}
                  />
                  {errors.username && (
                    <span className="text-error text-sm">
                      {errors.username.message}
                    </span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email *</span>
                  </label>
                  <input
                    type="email"
                    className="input input-bordered"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <span className="text-error text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Account Details - USER TABLE DATA */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Account Details</h2>
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-sm">Role</label>
                <div className="mt-1">
                  <span
                    className={`badge ${
                      user?.role === "admin"
                        ? "badge-primary"
                        : user?.role === "manager"
                        ? "badge-secondary"
                        : "badge-accent"
                    }`}
                  >
                    {user?.role?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-sm">Employee ID</label>
                <p className="mt-1 font-mono text-sm">
                  {user?.employee_id || "Not assigned"}
                </p>
              </div>

              <div>
                <label className="font-semibold text-sm">Status</label>
                <div className="mt-1">
                  <span
                    className={`badge ${
                      user?.is_active ? "badge-success" : "badge-error"
                    }`}
                  >
                    {user?.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {user?.last_login && (
                <div>
                  <label className="font-semibold text-sm">Last Login</label>
                  <p className="mt-1 text-sm">
                    {new Date(user.last_login).toLocaleString()}
                  </p>
                </div>
              )}

              <div>
                <label className="font-semibold text-sm">Member Since</label>
                <p className="mt-1 text-sm">
                  {new Date(user?.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Information - EMPLOYEE TABLE DATA */}
      {user?.employee ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Employee Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-sm">Full Name</label>
                <p className="mt-1">{user.employee.name}</p>
              </div>

              <div>
                <label className="font-semibold text-sm">Position</label>
                <p className="mt-1">{user.employee.position || "N/A"}</p>
              </div>

              <div>
                <label className="font-semibold text-sm">Department</label>
                <p className="mt-1">
                  {user.employee.department?.name || "N/A"}
                </p>
              </div>

              <div>
                <label className="font-semibold text-sm">Phone</label>
                <p className="mt-1">{user.employee.phone || "N/A"}</p>
              </div>

              <div>
                <label className="font-semibold text-sm">Join Date</label>
                <p className="mt-1">
                  {user.employee.join_date
                    ? new Date(user.employee.join_date).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div>
                <label className="font-semibold text-sm">Status</label>
                <div className="mt-1">
                  <span
                    className={`badge ${
                      user.employee.status === "active"
                        ? "badge-success"
                        : user.employee.status === "inactive"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {user.employee.status?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {user.employee.address && (
              <div className="mt-4">
                <label className="font-semibold text-sm">Address</label>
                <p className="mt-1">{user.employee.address}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Show message if no employee data
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Employee Information</h2>
            <div className="text-center py-8">
              <p className="text-gray-500">No employee information available</p>
              <p className="text-sm text-gray-400 mt-2">
                This account is not linked to an employee record
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

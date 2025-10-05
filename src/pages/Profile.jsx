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
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    }
  };

  // Role badge component
  const RoleBadge = ({ role }) => {
    const roleConfig = {
      admin: {
        label: "ADMIN",
        color: "bg-red-900/50 text-red-300 border-red-800/50",
      },
      manager: {
        label: "MANAGER",
        color: "bg-purple-900/50 text-purple-300 border-purple-800/50",
      },
      employee: {
        label: "EMPLOYEE",
        color: "bg-blue-900/50 text-blue-300 border-blue-800/50",
      },
    };

    const config = roleConfig[role] || {
      label: role?.toUpperCase() || "UNKNOWN",
      color: "bg-gray-700 text-gray-300 border-gray-600",
    };

    return (
      <span className={`badge border ${config.color}`}>{config.label}</span>
    );
  };

  // Status badge component
  const StatusBadge = ({ status, isActive }) => {
    if (status) {
      const statusConfig = {
        active: {
          label: "ACTIVE",
          color: "bg-green-900/50 text-green-300 border-green-800/50",
        },
        inactive: {
          label: "INACTIVE",
          color: "bg-red-900/50 text-red-300 border-red-800/50",
        },
        suspended: {
          label: "SUSPENDED",
          color: "bg-orange-900/50 text-orange-300 border-orange-800/50",
        },
      };

      const config = statusConfig[status] || {
        label: status?.toUpperCase() || "UNKNOWN",
        color: "bg-gray-700 text-gray-300 border-gray-600",
      };

      return (
        <span className={`badge border ${config.color}`}>{config.label}</span>
      );
    }

    return (
      <span
        className={`badge border ${
          isActive
            ? "bg-green-900/50 text-green-300 border-green-800/50"
            : "bg-red-900/50 text-red-300 border-red-800/50"
        }`}
      >
        {isActive ? "ACTIVE" : "INACTIVE"}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-gray-400 mt-2">
              Manage your account information and preferences
            </p>
          </div>
          <div className="flex items-center gap-3 bg-gray-800/50 px-4 py-3 rounded-xl border border-gray-700">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <div className="font-semibold text-white">{user?.username}</div>
              <div className="text-sm text-gray-400">{user?.email}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information Card - USER TABLE DATA */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">
                  Account Information
                </h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Username *
                    </label>
                    <input
                      type="text"
                      className="w-full input input-bordered bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 h-12"
                      {...register("username", {
                        required: "Username is required",
                        minLength: {
                          value: 3,
                          message: "Username must be at least 3 characters",
                        },
                      })}
                      placeholder="Enter your username"
                    />
                    {errors.username && (
                      <div className="text-red-400 text-sm flex items-center gap-2 mt-1">
                        <span>⚠️</span>
                        {errors.username.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="w-full input input-bordered bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 h-12"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email address",
                        },
                      })}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <div className="text-red-400 text-sm flex items-center gap-2 mt-1">
                        <span>⚠️</span>
                        {errors.email.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-700">
                  <button
                    type="submit"
                    className="btn bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white hover:from-blue-600 hover:to-purple-700 px-8 h-12"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Account Details - USER TABLE DATA */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">
                  Account Details
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-400">
                    Role
                  </label>
                  <RoleBadge role={user?.role} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-400">
                    Employee ID
                  </label>
                  <p className="font-mono text-blue-400 bg-blue-900/30 px-3 py-2 rounded-lg border border-blue-800/50">
                    {user?.employee_id || "Not assigned"}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-400">
                    Status
                  </label>
                  <StatusBadge isActive={user?.is_active} />
                </div>

                {user?.last_login && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-400">
                      Last Login
                    </label>
                    <p className="text-white bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-600">
                      {new Date(user.last_login).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-400">
                    Member Since
                  </label>
                  <p className="text-white bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-600">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            {/* <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">Quick Stats</h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Account Type</span>
                  <span className="text-white font-semibold">
                    {user?.role === "admin"
                      ? "Administrator"
                      : user?.role === "manager"
                      ? "Manager"
                      : "Employee"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Email Verified</span>
                  <span className="text-green-400 font-semibold">Yes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">2FA Enabled</span>
                  <span className="text-orange-400 font-semibold">No</span>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Employee Information - EMPLOYEE TABLE DATA */}
        {user?.employee ? (
          <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-white">
                Employee Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-400">
                  Full Name
                </label>
                <p className="text-white bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                  {user.employee.name}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-400">
                  Position
                </label>
                <p className="text-white bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                  {user.employee.position || "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-400">
                  Department
                </label>
                <p className="text-white bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                  {user.employee.department?.name || "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-400">
                  Phone
                </label>
                <p className="text-white bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                  {user.employee.phone || "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-400">
                  Join Date
                </label>
                <p className="text-white bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                  {user.employee.join_date
                    ? new Date(user.employee.join_date).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-400">
                  Status
                </label>
                <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                  <StatusBadge status={user.employee.status} />
                </div>
              </div>
            </div>

            {user.employee.address && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <label className="block text-sm font-semibold text-gray-400 mb-3">
                  Address
                </label>
                <p className="text-white bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                  {user.employee.address}
                </p>
              </div>
            )}
          </div>
        ) : (
          // Show message if no employee data
          <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-white">
                Employee Information
              </h2>
            </div>

            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">👤</div>
              <p className="text-gray-400 text-lg font-medium">
                No employee information available
              </p>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                This account is not linked to an employee record. Contact your
                administrator if this is incorrect.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

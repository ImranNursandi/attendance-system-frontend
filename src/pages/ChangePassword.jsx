// src/pages/ChangePassword.js
import React from "react";
import { useForm } from "react-hook-form";
import { authService } from "../services/authService";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await authService.changePassword(data);
      toast.success("Password changed successfully");
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  const newPassword = watch("new_password");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                🔒
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Change Password
                </h1>
                <p className="text-gray-400 mt-2">
                  Update your account security settings
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Password Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-cyan-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">
                  Update Password
                </h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Current Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300 font-semibold">
                      Current Password
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-cyan-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      type="password"
                      placeholder="Enter your current password"
                      className="input input-bordered w-full pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-600/50 focus:border-cyan-500 transition-all duration-300 h-12"
                      {...register("current_password", {
                        required: "Current password is required",
                      })}
                    />
                  </div>
                  {errors.current_password && (
                    <div className="text-red-400 text-sm flex items-center gap-2 mt-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.current_password.message}
                    </div>
                  )}
                </div>

                {/* New Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300 font-semibold">
                      New Password
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        />
                      </svg>
                    </div>
                    <input
                      type="password"
                      placeholder="Enter your new password"
                      className="input input-bordered w-full pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-600/50 focus:border-blue-500 transition-all duration-300 h-12"
                      {...register("new_password", {
                        required: "New password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                  </div>
                  {errors.new_password && (
                    <div className="text-red-400 text-sm flex items-center gap-2 mt-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.new_password.message}
                    </div>
                  )}
                </div>

                {/* Confirm New Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300 font-semibold">
                      Confirm New Password
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="password"
                      placeholder="Confirm your new password"
                      className="input input-bordered w-full pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-600/50 focus:border-green-500 transition-all duration-300 h-12"
                      {...register("confirm_password", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === newPassword || "Passwords do not match",
                      })}
                    />
                  </div>
                  {errors.confirm_password && (
                    <div className="text-red-400 text-sm flex items-center gap-2 mt-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.confirm_password.message}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-gray-700">
                  <button
                    type="submit"
                    className="btn bg-gradient-to-r from-cyan-500 to-blue-600 border-none text-white hover:from-cyan-600 hover:to-blue-700 px-8 h-12 min-h-12 transform hover:scale-105 transition-all duration-300 shadow-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Updating Password...
                      </>
                    ) : (
                      <>
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Security Tips */}
          <div className="space-y-6">
            {/* Password Requirements */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">
                  Password Requirements
                </h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">At least 6 characters</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">
                    Use a mix of letters and numbers
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">Avoid common passwords</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">
                    Don't reuse old passwords
                  </span>
                </div>
              </div>
            </div>

            {/* Security Tips */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">Security Tips</h2>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500/20 p-1 rounded mt-0.5">
                    <svg
                      className="w-3 h-3 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300">
                    Use a unique password for this account
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-500/20 p-1 rounded mt-0.5">
                    <svg
                      className="w-3 h-3 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300">
                    Consider using a password manager
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-500/20 p-1 rounded mt-0.5">
                    <svg
                      className="w-3 h-3 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300">
                    Update your password regularly
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-500/20 p-1 rounded mt-0.5">
                    <svg
                      className="w-3 h-3 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300">
                    Never share your password with anyone
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Status */}
            {/* <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">
                  Account Security
                </h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Last Password Change</span>
                  <span className="text-gray-300">Just now</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Password Strength</span>
                  <span className="text-green-400 font-semibold">Strong</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Account Status</span>
                  <span className="text-green-400 font-semibold">Active</span>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

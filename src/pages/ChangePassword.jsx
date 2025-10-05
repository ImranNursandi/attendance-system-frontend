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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Change Password</h1>

      <div className="card bg-base-100 shadow-xl max-w-md">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Current Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered"
                {...register("current_password", {
                  required: "Current password is required",
                })}
              />
              {errors.current_password && (
                <span className="text-error text-sm">
                  {errors.current_password.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered"
                {...register("new_password", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.new_password && (
                <span className="text-error text-sm">
                  {errors.new_password.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm New Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered"
                {...register("confirm_password", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                })}
              />
              {errors.confirm_password && (
                <span className="text-error text-sm">
                  {errors.confirm_password.message}
                </span>
              )}
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Changing Password..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

// src/pages/Login.js
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../store/slices/authSlice";
import { authService } from "../services/authService";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await authService.login({
        username: data.username,
        password: data.password,
      });

      const responseData = response.data;

      if (responseData.success) {
        // Extract user data from the response
        const userData = responseData.data.user;
        const token = responseData.data.access_token;

        // Dispatch to Redux store
        dispatch(
          loginSuccess({
            user: userData,
            token: token,
            role: userData.role,
          })
        );

        toast.success("Login successful!");

        // Redirect based on role
        if (userData.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error(responseData.message || "Login failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="card bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl border border-gray-700 rounded-2xl">
          <div className="card-body p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-400">
                Sign in to your attendance account
              </p>
            </div>

            {/* Contact Administrator Notice */}
            <div className="mb-6 p-4 bg-blue-900/30 rounded-xl border border-blue-800/50">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500/20 p-2 rounded-lg flex-shrink-0">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-blue-300 text-sm font-semibold mb-1">
                    Need Access?
                  </h4>
                  <p className="text-blue-400/80 text-xs">
                    Contact your administrator to get login credentials and
                    system access.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300 text-sm font-semibold">
                    Username
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    className="input input-bordered w-full pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-600/50 focus:border-blue-500 transition-all duration-300 h-12"
                    {...register("username", {
                      required: "Username is required",
                    })}
                  />
                </div>
                {errors.username && (
                  <span className="text-red-400 text-sm mt-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.username.message}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300 text-sm font-semibold">
                    Password
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="input input-bordered w-full pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-600/50 focus:border-blue-500 transition-all duration-300 h-12"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                </div>
                {errors.password && (
                  <span className="text-red-400 text-sm mt-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="form-control mt-8">
                <button
                  type="submit"
                  className="btn btn-lg w-full bg-gradient-to-r from-blue-500 to-purple-600 border-0 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg h-12"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Signing in...
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
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign In
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Support Information */}
            <div className="mt-8 p-4 bg-gray-700/30 rounded-xl border border-gray-600">
              <div className="flex items-start gap-3">
                <div className="bg-cyan-500/20 p-2 rounded-lg flex-shrink-0">
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
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-cyan-300 text-sm font-semibold mb-2">
                    Having Trouble?
                  </h4>
                  <div className="text-cyan-400/80 text-xs space-y-1">
                    <p className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                      Ensure you have valid login credentials
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                      Contact system administrator for account setup
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                      Make sure your account is active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t border-gray-700">
              <p className="text-gray-500 text-xs">
                Secure Attendance System • v1.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

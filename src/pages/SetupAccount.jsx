// src/pages/SetupAccount.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSetupAccount, useVerifySetupToken } from "../hooks/useAuth";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

const SetupAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
  });

  const {
    mutate: setupAccount,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useSetupAccount();
  const { data: tokenData, isLoading: verifyingToken } =
    useVerifySetupToken(token);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("At least 8 characters");
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One uppercase letter");
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One lowercase letter");
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One number");
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One special character");
    }

    return { score, feedback };
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData((prev) => ({ ...prev, password }));
    setPasswordStrength(checkPasswordStrength(password));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      alert("Invalid setup link. Please check your email.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (passwordStrength.score < 3) {
      alert("Please choose a stronger password.");
      return;
    }

    setupAccount({
      token,
      new_password: formData.password,
    });
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score === 0) return "from-gray-500 to-gray-600";
    if (passwordStrength.score <= 2) return "from-red-500 to-red-600";
    if (passwordStrength.score <= 3) return "from-orange-500 to-orange-600";
    if (passwordStrength.score <= 4) return "from-yellow-500 to-yellow-600";
    return "from-green-500 to-green-600";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score === 0) return "Enter a password";
    if (passwordStrength.score <= 2) return "Weak";
    if (passwordStrength.score <= 3) return "Fair";
    if (passwordStrength.score <= 4) return "Good";
    return "Strong";
  };

  // Redirect on success
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Account setup complete! You can now log in.",
          },
        });
      }, 3000);
    }
  }, [isSuccess, navigate]);

  // Check for token on mount
  useEffect(() => {
    if (!token) {
      navigate("/login", {
        state: { error: "Invalid or missing setup token." },
      });
    }
  }, [token, navigate]);

  if (verifyingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Verifying setup link...</p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (token && !verifyingToken && !tokenData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Invalid Setup Link
          </h2>
          <p className="text-gray-400 mb-4">
            This setup link is invalid or has expired. Please contact your
            administrator for a new one.
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-xl transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-4">
              Account Setup Complete! 🎉
            </h1>

            <p className="text-gray-300 mb-2">
              Your account has been successfully activated.
            </p>
            <p className="text-gray-400 text-sm mb-6">
              You will be redirected to the login page shortly.
            </p>

            <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/30 border border-green-800/50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-green-300">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Ready to use the system</span>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-400">
              <p>You can now:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Log in to the Attendance System
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Clock in/out for your shifts
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  View your attendance history
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
              Set Up Your Account
            </h1>
          </div>
          <p className="text-gray-400">
            Create a secure password to activate your account
          </p>
        </div>

        {/* Setup Card */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>

          <div className="p-8">
            {isError && (
              <div className="mb-6 bg-gradient-to-r from-red-900/50 to-orange-900/30 border border-red-800/50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-red-300 font-medium">Setup Failed</p>
                    <p className="text-red-400/80 text-sm mt-1">
                      {error?.response?.data?.error ||
                        "Invalid or expired setup link. Please request a new one."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handlePasswordChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Password strength</span>
                      <span
                        className={`font-medium ${
                          passwordStrength.score <= 2
                            ? "text-red-400"
                            : passwordStrength.score <= 3
                            ? "text-orange-400"
                            : passwordStrength.score <= 4
                            ? "text-yellow-400"
                            : "text-green-400"
                        }`}
                      >
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${getPasswordStrengthColor()} transition-all duration-300`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Confirm your password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span className="text-red-400">
                          Passwords don't match
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/50">
                <h4 className="text-sm font-medium text-gray-300 mb-3">
                  Password Requirements:
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li
                    className={`flex items-center gap-2 ${
                      formData.password.length >= 8 ? "text-green-400" : ""
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        formData.password.length >= 8
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    ></div>
                    At least 8 characters long
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      /[A-Z]/.test(formData.password) ? "text-green-400" : ""
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        /[A-Z]/.test(formData.password)
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    ></div>
                    One uppercase letter (A-Z)
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      /[a-z]/.test(formData.password) ? "text-green-400" : ""
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        /[a-z]/.test(formData.password)
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    ></div>
                    One lowercase letter (a-z)
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      /[0-9]/.test(formData.password) ? "text-green-400" : ""
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        /[0-9]/.test(formData.password)
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    ></div>
                    One number (0-9)
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                        ? "text-green-400"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    ></div>
                    One special character (!@#$% etc.)
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !token ||
                  formData.password !== formData.confirmPassword ||
                  passwordStrength.score < 3
                }
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Setting up account...
                  </div>
                ) : (
                  "Activate Account"
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p>
                  <strong className="text-gray-300">Security Notice:</strong>{" "}
                  Your account will be activated immediately after setup. Choose
                  a strong, unique password that you don't use elsewhere.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Need help? Contact your manager or system administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

// Shield icon component (you can replace with actual icon from your icon library)
const Shield = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

export default SetupAccount;

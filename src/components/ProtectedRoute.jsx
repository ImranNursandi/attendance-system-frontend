// src/components/ProtectedRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Higher-order component for role-based access
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="card-title justify-center">Access Denied</h2>
            <p>You don't have permission to access this page.</p>
            <p className="text-sm opacity-75 mt-2">
              Required roles: {requiredRoles.join(", ")}
            </p>
            <div className="card-actions justify-center mt-4">
              <button
                onClick={() => window.history.back()}
                className="btn btn-primary"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

// Specific role-based route components
export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={["admin"]}>{children}</ProtectedRoute>
);

export const ManagerRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={["admin", "manager"]}>
    {children}
  </ProtectedRoute>
);

export const EmployeeRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={["admin", "manager", "employee"]}>
    {children}
  </ProtectedRoute>
);

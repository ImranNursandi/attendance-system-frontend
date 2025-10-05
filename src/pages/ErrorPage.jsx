// src/pages/ErrorPage.js
import React from "react";
import { useRouteError, Link } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-2xl w-full max-w-md">
        <div className="card-body text-center">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-2xl font-bold text-error mb-4">
            Oops! Something went wrong
          </h1>

          <div className="text-left bg-base-200 p-4 rounded-lg mb-6">
            <p className="text-sm font-mono">
              {error?.statusText || error?.message || "Unknown error occurred"}
            </p>
            {error?.status && (
              <p className="text-sm opacity-75 mt-2">Status: {error.status}</p>
            )}
          </div>

          <div className="flex flex-col space-y-3">
            <Link to="/" className="btn btn-primary">
              Go to Dashboard
            </Link>
            <Link to="/login" className="btn btn-outline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;

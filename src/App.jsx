// src/App.js
import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider, useSelector } from "react-redux";
import { store } from "./store/store";
import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/EmployeeList";
import EmployeeForm from "./pages/EmployeeForm";
import DepartmentList from "./pages/DepartmentList";
import DepartmentForm from "./pages/DepartmentForm";
import AttendanceLog from "./pages/AttendanceLog";
import AttendanceCheckIn from "./pages/AttendanceCheckIn";
import Login from "./pages/Login";
import ErrorPage from "./pages/ErrorPage";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import MyAttendance from "./pages/MyAttendance";
import EmployeeView from "./pages/EmployeeView";
import DepartmentView from "./pages/DepartmentView";
import ManagerDashboard from "./pages/ManagerDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SetupAccount from "./pages/SetupAccount";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Route Protection Components
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="card bg-base-100 shadow-xl max-w-md">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="card-title justify-center text-error">
              Access Denied
            </h2>
            <p className="text-gray-600">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Your role:{" "}
              <span className="font-semibold capitalize">{role}</span>
              <br />
              Required roles: {allowedRoles.join(", ")}
            </p>
            <div className="card-actions justify-center mt-4">
              <button
                onClick={() => window.history.back()}
                className="btn btn-primary btn-sm"
              >
                Go Back
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="btn btn-outline btn-sm"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

// Role-specific route helpers
const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>
);

const ManagerRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={["admin", "manager"]}>
    {children}
  </ProtectedRoute>
);

const EmployeeRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={["admin", "manager", "employee"]}>
    {children}
  </ProtectedRoute>
);

// Main Layout
function RootLayout() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-base-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 bg-base-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Router configuration
const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/setup-account",
    element: (
      <PublicRoute>
        <SetupAccount />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      // Dashboard - Accessible by all authenticated users
      {
        index: true,
        element: (
          <EmployeeRoute>
            <Dashboard />
          </EmployeeRoute>
        ),
      },

      // Profile & Settings - Accessible by all authenticated users
      {
        path: "profile",
        element: (
          <EmployeeRoute>
            <Profile />
          </EmployeeRoute>
        ),
      },
      {
        path: "change-password",
        element: (
          <EmployeeRoute>
            <ChangePassword />
          </EmployeeRoute>
        ),
      },

      // Attendance - Different access levels
      {
        path: "attendance/clock-in",
        element: (
          <EmployeeRoute>
            <AttendanceCheckIn />
          </EmployeeRoute>
        ),
      },
      {
        path: "my-attendance",
        element: (
          <EmployeeRoute>
            <MyAttendance />
          </EmployeeRoute>
        ),
      },
      {
        path: "attendance/log",
        element: (
          <ManagerRoute>
            <AttendanceLog />
          </ManagerRoute>
        ),
      },

      // Employee Management - Manager and Admin only
      {
        path: "employees",
        children: [
          {
            index: true,
            element: (
              <ManagerRoute>
                <EmployeeList />
              </ManagerRoute>
            ),
          },
          {
            path: "view/:id",
            element: (
              <ManagerRoute>
                <EmployeeView />
              </ManagerRoute>
            ),
          },
          {
            path: "new",
            element: (
              <ManagerRoute>
                <EmployeeForm />
              </ManagerRoute>
            ),
          },
          {
            path: "edit/:id",
            element: (
              <ManagerRoute>
                <EmployeeForm />
              </ManagerRoute>
            ),
          },
        ],
      },

      // Department Management - Admin only
      {
        path: "departments",
        children: [
          {
            index: true,
            element: (
              <AdminRoute>
                <DepartmentList />
              </AdminRoute>
            ),
          },
          {
            path: "view/:id",
            element: (
              <AdminRoute>
                <DepartmentView />
              </AdminRoute>
            ),
          },
          {
            path: "new",
            element: (
              <AdminRoute>
                <DepartmentForm />
              </AdminRoute>
            ),
          },
          {
            path: "edit/:id",
            element: (
              <AdminRoute>
                <DepartmentForm />
              </AdminRoute>
            ),
          },
        ],
      },

      // Admin Panel - Admin only
      {
        path: "admin",
        children: [
          {
            path: "dashboard",
            element: (
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            ),
          },
        ],
      },

      // Manager Panel - Manager and Admin
      {
        path: "manager",
        children: [
          {
            path: "dashboard",
            element: (
              <ManagerRoute>
                <ManagerDashboard />
              </ManagerRoute>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;

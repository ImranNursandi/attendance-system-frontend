// src/pages/AttendanceCheckIn.js
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  useCheckIn,
  useCheckOut,
  useTodayAttendance,
} from "../hooks/useAttendance";
import { useEmployees } from "../hooks/useEmployees";
import { toast } from "react-toastify";

const AttendanceCheckIn = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user, role } = useSelector((state) => state.auth);
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();

  const today = new Date().toLocaleDateString("en-CA");
  const { data: todayAttendanceResponse, refetch: refetchTodayAttendance } =
    useTodayAttendance({
      start_date: today,
      end_date: today,
    });

  // Fetch employees for admin/manager
  const { data: employeesResponse } = useEmployees();
  const employeesData = employeesResponse?.data?.data || {};
  const employees = employeesData.employees || [];

  const { register, handleSubmit, reset, watch, setValue } = useForm();

  // Extract and filter today's attendance data
  const todayAttendanceData = todayAttendanceResponse?.data?.attendances || [];

  // For employees: get their own attendance
  // For admin/manager: get all attendance
  const userTodayAttendance =
    todayAttendanceData.find(
      (attendance) => attendance.employee_id === user?.employee_id
    ) || null;

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(
    role === "employee" ? user?.employee_id : ""
  );

  // Get attendance for selected employee (for admin/manager)
  const selectedEmployeeAttendance =
    todayAttendanceData.find(
      (attendance) => attendance.employee_id === selectedEmployeeId
    ) || null;

  // Use appropriate attendance based on role
  const todayAttendance =
    role === "employee" ? userTodayAttendance : selectedEmployeeAttendance;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-refetch attendance data after mutations
  useEffect(() => {
    if (checkInMutation.isSuccess || checkOutMutation.isSuccess) {
      refetchTodayAttendance();
    }
  }, [
    checkInMutation.isSuccess,
    checkOutMutation.isSuccess,
    refetchTodayAttendance,
  ]);

  const onSubmitCheckIn = (data) => {
    const employeeId =
      role === "employee" ? user.employee_id : selectedEmployeeId;
    console.log(user);
    console.log(selectedEmployeeId);

    if (!employeeId) {
      toast.error("Please select an employee");
      return;
    }

    const payload = {
      ...data,
      employee_id: employeeId,
    };

    checkInMutation.mutate(payload, {
      onSuccess: () => {
        reset();
        toast.success("Clocked in successfully!");
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to clock in";
        toast.error(errorMessage);
      },
    });
  };

  const handleCheckOut = () => {
    const employeeId =
      role === "employee" ? user.employee_id : selectedEmployeeId;

    if (!employeeId) {
      toast.error("Please select an employee");
      return;
    }

    const notes = watch("clock_out_notes") || "";

    checkOutMutation.mutate(
      {
        employee_id: employeeId,
        notes: notes,
      },
      {
        onSuccess: () => {
          reset();
          toast.success("Clocked out successfully!");
        },
        onError: (error) => {
          const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            "Failed to clock out";
          toast.error(errorMessage);
        },
      }
    );
  };

  // Check if selected employee has already clocked in today
  const hasClockedIn = todayAttendance?.clock_in;
  const hasClockedOut = todayAttendance?.clock_out;
  const canClockIn = !hasClockedIn;
  const canClockOut = hasClockedIn && !hasClockedOut;

  // Get status message
  const getStatusMessage = () => {
    if (!todayAttendance) return "No attendance record";
    if (!hasClockedIn) return "Not clocked in yet";
    if (hasClockedIn && !hasClockedOut) return "Clocked in - Active";
    if (hasClockedOut) return "Clocked out for today";
    return "Unknown status";
  };

  // Get status color
  const getStatusColor = () => {
    if (!todayAttendance) return "badge-warning";
    if (!hasClockedIn) return "badge-error";
    if (hasClockedIn && !hasClockedOut) return "badge-success";
    if (hasClockedOut) return "badge-info";
    return "badge-warning";
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Calculate current session duration if clocked in but not out
  const getCurrentSessionDuration = () => {
    if (!hasClockedIn || hasClockedOut) return null;

    const clockInTime = new Date(todayAttendance.clock_in);
    const now = new Date();
    const durationMs = now - clockInTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  // Get selected employee name
  const getSelectedEmployeeName = () => {
    if (role === "employee") {
      return user.username;
    }
    const employee = employees.find(
      (emp) => emp.employee_id === selectedEmployeeId
    );

    return employee ? employee.name : "Select an employee";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {role === "employee" ? "My Attendance" : "Employee Attendance"}
          </h1>
          <p className="text-gray-400 mt-2">
            {role === "employee"
              ? "Record your daily attendance"
              : "Manage employee attendance records"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Time Card */}
          <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-4">
                Current Time
              </h2>
              <div className="text-5xl font-mono font-bold text-blue-400 mb-2">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-lg text-gray-300">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* User Status Card */}
          <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-4">
                {role === "employee" ? "Your Status" : "Employee Status"}
              </h2>
              <div className="flex flex-col items-center space-y-3">
                <div
                  className={`badge badge-lg ${getStatusColor()} text-white px-4 py-3`}
                >
                  {getStatusMessage()}
                </div>

                {role !== "employee" && (
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text text-gray-300">
                        Select Employee
                      </span>
                    </label>
                    <select
                      className="select select-bordered bg-gray-700 border-gray-600 text-white w-full"
                      value={selectedEmployeeId}
                      onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    >
                      <option value="">Choose an employee</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.employee_id}>
                          {employee.employee_id} - {employee.name} (
                          {employee.department?.name})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {todayAttendance && (
                  <div className="text-sm text-gray-400 space-y-2 w-full">
                    {role !== "employee" && (
                      <div className="flex justify-between gap-4">
                        <span>Employee:</span>
                        <span className="text-white">
                          {getSelectedEmployeeName()}
                        </span>
                      </div>
                    )}
                    {todayAttendance.clock_in && (
                      <div className="flex justify-between gap-4">
                        <span>Clocked In:</span>
                        <span className="text-white">
                          {formatTime(todayAttendance.clock_in)}
                        </span>
                      </div>
                    )}
                    {todayAttendance.clock_out && (
                      <div className="flex justify-between gap-4">
                        <span>Clocked Out:</span>
                        <span className="text-white">
                          {formatTime(todayAttendance.clock_out)}
                        </span>
                      </div>
                    )}
                    {todayAttendance.work_hours && (
                      <div className="flex justify-between gap-4">
                        <span>Work Hours:</span>
                        <span className="text-green-400 font-semibold">
                          {parseFloat(todayAttendance.work_hours).toFixed(2)}h
                        </span>
                      </div>
                    )}
                    {getCurrentSessionDuration() && (
                      <div className="flex justify-between gap-4">
                        <span>Current Session:</span>
                        <span className="text-blue-400 font-semibold">
                          {getCurrentSessionDuration()}
                        </span>
                      </div>
                    )}
                    {todayAttendance.punctuality &&
                      todayAttendance.punctuality !== "on_time" && (
                        <div className="flex justify-between gap-4">
                          <span>Status:</span>
                          <span
                            className={`${
                              todayAttendance.punctuality === "late"
                                ? "text-orange-400"
                                : todayAttendance.punctuality === "early_leave"
                                ? "text-yellow-400"
                                : "text-green-400"
                            } font-semibold`}
                          >
                            {todayAttendance.punctuality
                              .replace("_", " ")
                              .toUpperCase()}
                          </span>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Clock-in Form - Only show if employee hasn't clocked in */}
          {canClockIn && (
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6 lg:col-span-2">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                  <h2 className="text-xl font-bold text-white">
                    {role === "employee" ? "Clock In" : "Clock In Employee"}
                  </h2>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmitCheckIn)}
                  className="space-y-4"
                >
                  {role === "employee" ? (
                    // Employee view - auto-filled with their info
                    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                      <div className="text-sm text-gray-400">Employee</div>
                      <div className="text-white font-semibold">
                        {user.employee_id} - {user.username}
                        {user.employee?.department && (
                          <span className="text-gray-400 ml-2">
                            ({user.employee.department.name})
                          </span>
                        )}
                      </div>
                    </div>
                  ) : // Admin/Manager view - show selected employee
                  selectedEmployeeId ? (
                    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                      <div className="text-sm text-gray-400">
                        Selected Employee
                      </div>
                      <div className="text-white font-semibold">
                        {getSelectedEmployeeName()}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-800/50">
                      <div className="text-yellow-300 text-sm">
                        Please select an employee to clock in
                      </div>
                    </div>
                  )}

                  <div className="form-control">
                    <label className="label m-2">
                      <span className="label-text text-gray-300">
                        Notes (Optional)
                      </span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                      placeholder="Any notes for today..."
                      {...register("notes")}
                      rows="3"
                    />
                  </div>

                  <div className="form-control mt-6">
                    <button
                      type="submit"
                      className="btn btn-success btn-lg w-full bg-gradient-to-r from-green-500 to-green-600 border-none text-white hover:from-green-600 hover:to-green-700"
                      disabled={
                        checkInMutation.isLoading ||
                        (role !== "employee" && !selectedEmployeeId)
                      }
                    >
                      {checkInMutation.isLoading ? (
                        <>
                          <span className="loading loading-spinner"></span>
                          Clocking In...
                        </>
                      ) : (
                        <>
                          <span className="text-xl">⏰</span>
                          {role === "employee"
                            ? "Clock In Now"
                            : "Clock In Employee"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Clock-out Card - Only show if employee has clocked in but not out */}
          {canClockOut && (
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6 lg:col-span-2">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                  <h2 className="text-xl font-bold text-white">
                    {role === "employee" ? "Clock Out" : "Clock Out Employee"}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className="text-sm text-gray-400">
                      {role === "employee"
                        ? "Ready to clock out?"
                        : "Employee Clock Out"}
                    </div>
                    <div className="text-white">
                      {role === "employee" ? "You" : getSelectedEmployeeName()}{" "}
                      clocked in at {formatTime(todayAttendance.clock_in)}
                      {getCurrentSessionDuration() && (
                        <span className="text-blue-400 ml-2">
                          (Current session: {getCurrentSessionDuration()})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label m-2">
                      <span className="label-text text-gray-300">
                        Notes (Optional)
                      </span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                      placeholder="Any notes for end of day..."
                      {...register("clock_out_notes")}
                      rows="2"
                    />
                  </div>

                  <button
                    onClick={handleCheckOut}
                    className="btn btn-primary btn-lg w-full bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white hover:from-blue-600 hover:to-purple-700"
                    disabled={checkOutMutation.isLoading}
                  >
                    {checkOutMutation.isLoading ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Clocking Out...
                      </>
                    ) : (
                      <>
                        <span className="text-xl">🚪</span>
                        {role === "employee"
                          ? "Clock Out Now"
                          : "Clock Out Employee"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Already Completed Message */}
          {hasClockedOut && (
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-green-800/50 p-6 lg:col-span-2">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-green-400 mb-2">
                  Attendance Complete for Today!
                </h3>
                <p className="text-gray-400">
                  {role === "employee"
                    ? "You have"
                    : getSelectedEmployeeName() + " has"}{" "}
                  successfully completed attendance for{" "}
                  {currentTime.toLocaleDateString()}
                </p>
                <div className="mt-4 text-sm text-gray-500 space-y-1">
                  <div>Clocked In: {formatTime(todayAttendance.clock_in)}</div>
                  <div>
                    Clocked Out: {formatTime(todayAttendance.clock_out)}
                  </div>
                  <div className="text-green-400 font-semibold">
                    Total Hours:{" "}
                    {parseFloat(todayAttendance.work_hours).toFixed(2)}h
                  </div>
                  {todayAttendance.punctuality &&
                    todayAttendance.punctuality !== "on_time" && (
                      <div className="text-orange-400">
                        Status:{" "}
                        {todayAttendance.punctuality
                          .replace("_", " ")
                          .toUpperCase()}
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* No Employee Selected Message (Admin/Manager) */}
          {role !== "employee" &&
            !selectedEmployeeId &&
            !canClockIn &&
            !canClockOut &&
            !hasClockedOut && (
              <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6 lg:col-span-2">
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Select an Employee
                  </h3>
                  <p className="text-gray-400">
                    Choose an employee from the dropdown to view and manage
                    their attendance
                  </p>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceCheckIn;

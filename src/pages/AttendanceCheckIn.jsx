// src/pages/AttendanceCheckIn.js
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCheckIn, useCheckOut } from "../hooks/useAttendance";
import { useEmployees } from "../hooks/useEmployees";

const AttendanceCheckIn = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { data: employeesResponse } = useEmployees();
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();

  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const selectedEmployeeId = watch("employee_id");

  // Extract employees from response
  const employeesData = employeesResponse?.data?.data || {};
  const employees = employeesData.employees || [];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const onSubmitCheckIn = (data) => {
    checkInMutation.mutate(data, {
      onSuccess: () => reset(),
    });
  };

  const handleCheckOut = () => {
    if (selectedEmployeeId) {
      checkOutMutation.mutate({
        employee_id: selectedEmployeeId,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Attendance</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Time Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <h2 className="card-title">Current Time</h2>
            <div className="text-4xl font-mono font-bold">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-lg opacity-75">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Clock-in Form */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Clock In</h2>
            <form
              onSubmit={handleSubmit(onSubmitCheckIn)}
              className="space-y-4"
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Select Employee</span>
                </label>
                <select
                  className="select select-bordered"
                  {...register("employee_id", {
                    required: "Employee is required",
                  })}
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.employee_id}>
                      {employee.employee_id} - {employee.name} (
                      {employee.department?.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Notes (Optional)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  placeholder="Any notes for today..."
                  {...register("notes")}
                />
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full"
                  disabled={checkInMutation.isLoading}
                >
                  {checkInMutation.isLoading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Clocking In...
                    </>
                  ) : (
                    "Clock In"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Clock-out Card */}
        <div className="card bg-base-100 shadow-xl lg:col-span-2">
          <div className="card-body">
            <h2 className="card-title">Clock Out</h2>
            <div className="flex flex-col lg:flex-row items-end gap-4">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">
                    Select Employee to Clock Out
                  </span>
                </label>
                <select
                  className="select select-bordered"
                  value={selectedEmployeeId}
                  onChange={(e) => setValue("employee_id", e.target.value)}
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.employee_id}>
                      {employee.employee_id} - {employee.name} (
                      {employee.department?.name})
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleCheckOut}
                className="btn btn-secondary btn-lg lg:w-auto"
                disabled={!selectedEmployeeId || checkOutMutation.isLoading}
              >
                {checkOutMutation.isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Clocking Out...
                  </>
                ) : (
                  "Clock Out"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCheckIn;

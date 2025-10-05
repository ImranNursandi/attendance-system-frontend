// src/pages/MyAttendance.js
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useEmployeeAttendance } from "../hooks/useAttendance";
import { format, parseISO } from "date-fns";

const MyAttendance = () => {
  const { user } = useSelector((state) => state.auth);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
  });

  const { data: attendanceResponse, isLoading } = useEmployeeAttendance(
    user?.id,
    dateRange
  );
  const attendanceRecords = attendanceResponse?.data?.data || [];

  const handleDateChange = (key, value) => {
    setDateRange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Attendance</h1>

      {/* Date Filter */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Start Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={dateRange.start_date}
                onChange={(e) => handleDateChange("start_date", e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">End Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={dateRange.end_date}
                onChange={(e) => handleDateChange("end_date", e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Total Records</span>
              </label>
              <div className="text-lg font-semibold mt-2">
                {attendanceRecords.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Working Hours</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => {
                  const workingHours =
                    record.clock_in && record.clock_out
                      ? (() => {
                          const start = parseISO(record.clock_in);
                          const end = parseISO(record.clock_out);
                          const diffMs = end - start;
                          const hours = Math.floor(diffMs / (1000 * 60 * 60));
                          const minutes = Math.floor(
                            (diffMs % (1000 * 60 * 60)) / (1000 * 60)
                          );
                          return `${hours}h ${minutes}m`;
                        })()
                      : "-";

                  return (
                    <tr key={record.id}>
                      <td>
                        {format(parseISO(record.clock_in), "MMM dd, yyyy")}
                      </td>
                      <td>{format(parseISO(record.clock_in), "HH:mm:ss")}</td>
                      <td>
                        {record.clock_out
                          ? format(parseISO(record.clock_out), "HH:mm:ss")
                          : "Not clocked out"}
                      </td>
                      <td>{workingHours}</td>
                      <td>
                        <span
                          className={`badge ${
                            record.status === "late"
                              ? "badge-warning"
                              : record.status === "on_time"
                              ? "badge-success"
                              : "badge-info"
                          }`}
                        >
                          {record.status?.replace("_", " ") || "Unknown"}
                        </span>
                      </td>
                      <td>{record.notes || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {attendanceRecords.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <p className="text-lg opacity-75">
                  No attendance records found for the selected period.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAttendance;

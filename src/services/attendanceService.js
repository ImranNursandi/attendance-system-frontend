// src/services/attendanceService.js
import api from "./api";

export const attendanceService = {
  // Basic operations
  checkIn: (data) => api.post("/api/v1/attendance/clock-in", data),
  checkOut: (data) => api.put("/api/v1/attendance/clock-out", data),

  // Read operations
  getLogs: (filters) => api.get("/api/v1/attendance/logs", { params: filters }),
  getEmployeeAttendance: (employeeId, filters) =>
    api.get(`/api/v1/attendance/employee/${employeeId}`, { params: filters }),
  getStats: (employeeId, params) =>
    api.get(`/api/v1/attendance/stats/${employeeId}`, { params }),

  // NEW: Get specific attendance record
  getAttendance: (id) => api.get(`/api/v1/attendance/${id}`),

  // NEW: Admin operations
  createAttendance: (data) => api.post("/api/v1/attendance", data),
  updateAttendance: (id, data) => api.put(`/api/v1/attendance/${id}`, data),
  deleteAttendance: (id) => api.delete(`/api/v1/attendance/${id}`),

  // NEW: Bulk operations
  bulkOperation: (data) => api.post("/api/v1/attendance/bulk", data),

  // NEW: Export operations
  exportLogs: (filters) =>
    api.get("/api/v1/attendance/export", {
      params: filters,
      responseType: "blob", // For file downloads
    }),

  // NEW: Department-specific attendance
  getDepartmentAttendance: (departmentId, filters) =>
    api.get(`/api/v1/attendance/department/${departmentId}`, {
      params: filters,
    }),

  // NEW: Punctuality reports
  getPunctualityReport: (filters) =>
    api.get("/api/v1/attendance/reports/punctuality", { params: filters }),

  // NEW: Monthly summary
  getMonthlySummary: (employeeId, year, month) =>
    api.get(`/api/v1/attendance/summary/${employeeId}`, {
      params: { year, month },
    }),
};

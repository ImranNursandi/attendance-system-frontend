// src/services/attendanceService.js
import api from "./api";

export const attendanceService = {
  checkIn: (data) => api.post("/api/v1/attendance/clock-in", data),
  checkOut: (data) => api.put("/api/v1/attendance/clock-out", data),
  getLogs: (filters) => api.get("/api/v1/attendance/logs", { params: filters }),
  getEmployeeAttendance: (employeeId, filters) =>
    api.get(`/api/v1/attendance/employee/${employeeId}`, { params: filters }),
  getStats: (employeeId, params) =>
    api.get(`/api/v1/attendance/stats/${employeeId}`, { params }),
};

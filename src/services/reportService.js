// src/services/reportService.js
import api from "./api";

export const reportService = {
  generateAttendanceReport: (filters) =>
    api.get("/api/v1/reports/attendance", { params: filters }),
  generateSummaryReport: (filters) =>
    api.get("/api/v1/reports/summary", { params: filters }),
  generateDepartmentReport: (departmentId, filters) =>
    api.get(`/api/v1/reports/department/${departmentId}`, { params: filters }),

  // Export functions
  exportAttendanceReport: (filters) =>
    api.get("/api/v1/reports/export/attendance", {
      params: filters,
      responseType: "blob",
    }),
  exportSummaryReport: (filters) =>
    api.get("/api/v1/reports/export/summary", {
      params: filters,
      responseType: "blob",
    }),
  exportDepartmentReport: (departmentId, filters) =>
    api.get(`/api/v1/reports/export/department/${departmentId}`, {
      params: filters,
      responseType: "blob",
    }),
};

// src/services/employeeService.js
import api from "./api";

export const employeeService = {
  getAll: (params = {}) => api.get("/api/v1/employees", { params }),
  getById: (id) => api.get(`/api/v1/employees/${id}`),
  search: (query, limit = 10) =>
    api.get("/api/v1/employees/search", {
      params: { q: query, limit },
    }),
  getByDepartment: (departmentId) =>
    api.get(`/api/v1/employees/department/${departmentId}`),
  create: (data) => api.post("/api/v1/employees", data),
  update: (id, data) => api.put(`/api/v1/employees/${id}`, data),
  delete: (id) => api.delete(`/api/v1/employees/${id}`),
};

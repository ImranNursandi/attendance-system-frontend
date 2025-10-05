// src/services/departmentService.js
import api from "./api";

export const departmentService = {
  // Public routes for all authenticated users
  getAll: () => api.get("/api/v1/departments"),
  getActive: () => api.get("/api/v1/departments/active"),
  getById: (id) => api.get(`/api/v1/departments/${id}`),

  // Admin only routes
  create: (data) => api.post("/api/v1/departments", data),
  update: (id, data) => api.put(`/api/v1/departments/${id}`, data),
  delete: (id) => api.delete(`/api/v1/departments/${id}`),
};

// src/services/authService.js
import api from "./api";

export const authService = {
  login: (credentials) => api.post("/api/v1/auth/login", credentials),
  register: (userData) => api.post("/api/v1/auth/register", userData),
  getProfile: () => api.get("/api/v1/auth/profile"),
  updateProfile: (data) => api.put("/api/v1/auth/profile", data),
  changePassword: (data) => api.put("/api/v1/auth/change-password", data),
  refreshToken: () => api.post("/api/v1/auth/refresh"),
  getHealth: () => api.get("/api/v1/health"),
};

// src/services/authService.js
import api from "./api";

export const authService = {
  login: (credentials) => api.post("/api/v1/auth/login", credentials),
  register: (userData) => api.post("/api/v1/auth/register", userData),
  getProfile: () => api.get("/api/v1/auth/profile"),
  updateProfile: (data) => api.put("/api/v1/auth/profile", data),
  changePassword: (data) => api.put("/api/v1/auth/change-password", data),
  refreshToken: () => api.post("/api/v1/auth/refresh"),
  getHealth: () => api.get("api/v1/health"),

  setupAccount: (setupData) =>
    api.post("/api/v1/auth/setup-account", setupData),

  verifySetupToken: (token) =>
    api.get(`/api/v1/auth/verify-setup-token?token=${token}`),

  forgotPassword: (email) =>
    api.post("/api/v1/auth/forgot-password", { email }),

  resetPassword: (resetData) =>
    api.post("/api/v1/auth/reset-password", resetData),

  logout: () => api.post("/api/v1/auth/logout"),
};

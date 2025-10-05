// src/services/api.js
import axios from "axios";
import { store } from "../store/store";
import { logout } from "../store/slices/authSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config, response } = error;

    const isAuthEndpoint =
      config?.url?.includes("/login") || config?.url?.includes("/register");

    if (response?.status === 401 && !isAuthEndpoint) {
      const token = localStorage.getItem("token");
      if (token) {
        store.dispatch(logout());
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;

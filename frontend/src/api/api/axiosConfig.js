// src/api/axiosConfig.js
import axios from "axios";

// Point to your API root (includes /api)
const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Attach token if present (we stored it under "jwt" in AuthContext)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If token is bad/expired, clear and bounce to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;

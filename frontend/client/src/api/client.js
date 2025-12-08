import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "const API_URL = "https://fao-portal-1.onrender.com/api";
});

// Always attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

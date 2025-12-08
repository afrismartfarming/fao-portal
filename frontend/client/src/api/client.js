// frontend/client/src/api/client.js

const API_URL = "https://fao-portal-1.onrender.com/api";   // <--- CORRECT LIVE API

import axios from "axios";

const api = axios.create({
  baseURL: API_URL,           // no syntax errors, final form
  headers: { "Content-Type": "application/json" }
});

// Automatically attach JWT if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
export { API_URL };

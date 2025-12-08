// frontend/client/src/api.js

// LIVE BACKEND URL
const API_URL = "https://fao-portal-1.onrender.com/api";

/**
 * Standard Fetch wrapper with token support
 */
export async function authFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  });
}

//
// OPTIONAL – Axios Instance (more powerful, recommended for admin requests)
//

import axios from "axios";

export const api = axios.create({
  baseURL: API_URL, // FINAL FIX
});

// Inject Token into every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

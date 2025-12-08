// ------------------------------
// Correct Production API URL
// ------------------------------
const API_BASE = import.meta.env.VITE_API_URL || "https://fao-portal-1.onrender.com/api";

export const api = {
  async post(path, body) {
    return await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`
      },
      body: JSON.stringify(body)
    });
  },

  async get(path) {
    return await fetch(`${API_BASE}${path}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`
      }
    });
  }
};

export default api;

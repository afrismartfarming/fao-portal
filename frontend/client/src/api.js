// frontend/client/src/api.js
const API_URL = "https://fao-portal-1.onrender.com/api";

export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  return fetch(`${API}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}


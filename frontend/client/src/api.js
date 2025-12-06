// frontend/client/src/api.js
const API = "http://localhost:5000/api";

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


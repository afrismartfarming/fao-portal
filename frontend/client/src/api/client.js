// =====================================================
// Correct Production API URL
// =====================================================
const API_BASE =
  import.meta.env.VITE_API_URL || "https://fao-portal-1.onrender.com/api";

// =====================================================
// Fetch Wrapper with Auto JSON & Token Header
// =====================================================
async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {})
    },
    body: options.body || undefined
  });

  // Safely parse response JSON
  let data = null;
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    throw {
      status: res.status,
      message: data?.message || "Request failed"
    };
  }

  return data; // Final JSON output
}

// =====================================================
// API METHODS
// =====================================================
export const api = {
  get(path) {
    return request(path, { method: "GET" });
  },

  post(path, body) {
    return request(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put(path, body) {
    return request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete(path) {
    return request(path, { method: "DELETE" });
  }
};

export default api;

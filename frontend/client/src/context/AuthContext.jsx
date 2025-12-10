import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/client";           // MUST point to https://fao-portal-1.onrender.com/api

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {

  /** Load saved user on refresh */
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  /** Fetch authenticated user (/auth/me) */
  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      console.warn("AUTH SESSION INVALID → LOGGING OUT", err?.response?.data || err);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  /** On mount — verify token if exists */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) fetchUser();
    else setLoading(false);

    // Auto-logout broadcast listener
    const handler = () => logout();
    window.addEventListener("auth-expired", handler);

    return () => window.removeEventListener("auth-expired", handler);
  }, [fetchUser]);

  /* ================================================================
     LOGIN  — FIXED (Now Uses Correct Backend URL via api/client.js)
  ================================================================ */
/** Login  */
async function login({ email, password }) {
  try {
    const res = await api.post("/auth/login", { email, password });

    // Convert fetch response into JSON
    const data = await res.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);

    return { success: true };
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return { success: false, message: "Invalid login" };
  }
}


  /* LOGOUT */
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

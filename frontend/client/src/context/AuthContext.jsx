import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/client";          // MUST resolve to https://fao-portal-1.onrender.com/api

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {

  /* ================================================================
     USER STATE RESTORE (Load from localStorage if exists)
  ================================================================ */
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  /* ================================================================
     VALIDATE STORED TOKEN → /auth/me
  ================================================================ */
  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
const data = await api.post("/auth/login", { email, password });

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      console.warn("SESSION INVALID — logging out");
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================================================================
     ON APP LOAD — If token exists, verify it
  ================================================================ */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) fetchUser();
    else setLoading(false);

    // Event to force logout across tabs
    const handler = () => logout();
    window.addEventListener("auth-expired", handler);

    return () => window.removeEventListener("auth-expired", handler);
  }, [fetchUser]);

  /* ================================================================
     LOGIN — Now correctly parses JSON response
  ================================================================ */
 /** LOGIN */
async function login({ email, password }) {
  try {
    const data = await api.post("/auth/login", {
      email,
      password
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);

    return { success: true };
  } catch (err) {
    console.error("LOGIN FAILED:", err);
    return { success: false, message: "Invalid login" };
  }
}


  /* ================================================================
     LOGOUT
  ================================================================ */
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  /* ================================================================
     PROVIDE AUTH STATE
  ================================================================ */
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

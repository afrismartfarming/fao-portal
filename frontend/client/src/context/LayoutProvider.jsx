import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const LayoutContext = createContext(null);

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used within LayoutProvider");
  return ctx;
}

export function LayoutProvider({ children }) {
  const [collapsed, setCollapsed] = useState(() => {
    const v = localStorage.getItem("fao_sidebar");
    return v ? JSON.parse(v) : false;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const v = localStorage.getItem("fao_dark");
    return v ? JSON.parse(v) : false;
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  // Persist sidebar mode
  useEffect(() => {
    localStorage.setItem("fao_sidebar", JSON.stringify(collapsed));
  }, [collapsed]);

  // Persist dark mode
  useEffect(() => {
    localStorage.setItem("fao_dark", JSON.stringify(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const value = useMemo(
    () => ({
      collapsed,
      setCollapsed,
      darkMode,
      setDarkMode,
      mobileOpen,
      setMobileOpen,
    }),
    [collapsed, darkMode, mobileOpen]
  );

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLayout } from "../context/LayoutProvider";

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { collapsed, setCollapsed, darkMode, setDarkMode, mobileOpen, setMobileOpen } = useLayout();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* SIDEBAR */}
      <aside
        className={`transition-all duration-200 border-r dark:border-gray-700 bg-white dark:bg-gray-800 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Top Section */}
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-700 text-white flex items-center justify-center font-bold text-sm">
              FA
            </div>

            {!collapsed && (
              <div>
                <div className="font-semibold text-sm">FAO</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Admin Portal</div>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-gray-600 dark:text-gray-300"
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="p-3 space-y-1 text-sm">
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/grm" label="GRM Module" />
          <NavItem to="/content" label="Content Manager" />
          <NavItem to="/media" label="Media Uploads" />
          <NavItem to="/analytics" label="Analytics" />
          <NavItem to="/users" label="User Management" />
        </nav>

        {/* USER FOOTER */}
        <div className="p-3 border-t dark:border-gray-700">
          {!collapsed && (
            <div className="text-xs text-gray-500 mb-1">Logged in as</div>
          )}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
              {user?.name?.[0] || "A"}
            </div>

            {!collapsed && (
              <div className="flex-1">
                <div className="text-sm">{user?.name || user?.email}</div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={handleLogout}
              className="mt-3 px-3 py-1 w-full bg-red-600 text-white rounded text-sm"
            >
              Logout
            </button>
          )}
        </div>
      </aside>

      {/* MAIN PANEL */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              ☰
            </button>

            <input
              placeholder="Search…"
              className="hidden md:block px-3 py-2 w-64 border rounded bg-gray-100 dark:bg-gray-700 text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1 border rounded text-sm"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                {user?.name?.[0]}
              </div>

              <div className="hidden sm:flex flex-col text-left text-sm">
                <span>{user?.name || user?.email}</span>
                <span className="text-xs text-gray-500">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-4 flex-1 overflow-auto">
          <Outlet />
        </main>

        <footer className="px-4 py-3 border-t dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} FAO Admin Portal
        </footer>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden"
        />
      )}
    </div>
  );
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-2 rounded ${
          isActive
            ? "bg-blue-100 text-blue-700 font-medium"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

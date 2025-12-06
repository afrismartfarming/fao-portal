// frontend/client/src/components/Header.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-fao-blue text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* BRAND */}
        <Link to="/" className="flex items-center gap-3 font-semibold text-lg">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow">
            <span className="text-fao-blue-dark font-bold">FAO</span>
          </div>
          <span>Knowledge & Project Portal</span>
        </Link>

        {/* MOBILE ICON */}
        <button
          className="md:hidden text-white text-3xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <NavItem label="Home" to="/" />
          <NavItem label="About" to="/about" />
          <NavItem label="Legal Resources" to="/legal" />
          <NavItem label="Knowledge Hub" to="/knowledge" />
          <NavItem label="MSP" to="/msp" />
          <NavItem label="News" to="/news" />
          <NavItem label="Contact" to="/contact" />

          <Link
            to="/login"
            className="bg-white text-fao-blue px-4 py-2 rounded font-semibold shadow-sm hover:bg-fao-blue-light"
          >
            Sign In
          </Link>
        </nav>

      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden bg-fao-blue px-4 pb-4 space-y-1">
          <MobileItem label="Home" to="/" close={() => setOpen(false)} />
          <MobileItem label="About" to="/about" close={() => setOpen(false)} />
          <MobileItem label="Legal Resources" to="/legal" close={() => setOpen(false)} />
          <MobileItem label="Knowledge Hub" to="/knowledge" close={() => setOpen(false)} />
          <MobileItem label="MSP" to="/msp" close={() => setOpen(false)} />
          <MobileItem label="News" to="/news" close={() => setOpen(false)} />
          <MobileItem label="Contact" to="/contact" close={() => setOpen(false)} />

          <Link
            to="/login"
            className="block mt-2 bg-white text-fao-blue px-4 py-2 rounded text-center font-semibold"
            onClick={() => setOpen(false)}
          >
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `hover:underline underline-offset-4 ${
          isActive ? "font-bold underline" : ""
        }`
      }
    >
      {label}
    </NavLink>
  );
}

function MobileItem({ to, label, close }) {
  return (
    <NavLink
      to={to}
      onClick={close}
      className={({ isActive }) =>
        `block py-2 px-2 rounded hover:bg-white/10 ${
          isActive ? "font-semibold underline" : ""
        }`
      }
    >
      {label}
    </NavLink>
  );
}

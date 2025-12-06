import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <Header />

      <main style={{ minHeight: "70vh", padding: "20px" }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

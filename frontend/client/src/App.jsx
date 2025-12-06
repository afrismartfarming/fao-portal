import React from "react";
import { Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "./components/PublicLayout";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { LayoutProvider } from "./context/LayoutProvider";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import LegalResources from "./pages/LegalResources";
import KnowledgeHub from "./pages/KnowledgeHub";
import MSP from "./pages/MSP";
import News from "./pages/News";
import Contacts from "./pages/Contacts";

// Public GRM
import GrmSubmit from "./components/grm/GrmSubmit";
import GrmTrack from "./components/grm/GrmTrack";

// Admin Pages
import Dashboard from "./pages/Dashboard";
import Grm from "./pages/Grm";
import GrmDetails from "./pages/GrmDetails";
import Content from "./pages/Content";
import Media from "./pages/Media";
import Users from "./pages/Users";

// Auth
import Login from "./pages/Login";

export default function App() {
  return (
    <Routes>

      {/* ---------------- PUBLIC WEBSITE ---------------- */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="legal" element={<LegalResources />} />
        <Route path="knowledge" element={<KnowledgeHub />} />
        <Route path="msp" element={<MSP />} />
        <Route path="news" element={<News />} />
        <Route path="contact" element={<Contacts />} />
        <Route path="grm/submit" element={<GrmSubmit />} />
        <Route path="grm/track" element={<GrmTrack />} />
      </Route>

      {/* ---------------- ADMIN PORTAL ---------------- */}
      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <LayoutProvider>
              <AdminLayout />
            </LayoutProvider>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/grm" element={<Grm />} />
          <Route path="/grm/:id" element={<GrmDetails />} />
          <Route path="/content" element={<Content />} />
          <Route path="/media" element={<Media />} />
          <Route path="/users" element={<Users />} />
        </Route>
      </Route>

      {/* ---------------- LOGIN ---------------- */}
      <Route path="/login" element={<Login />} />

    </Routes>
  );
}

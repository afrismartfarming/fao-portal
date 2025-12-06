// frontend/client/src/pages/Dashboard.jsx
import React from "react";

export default function Dashboard() {
  return (
    <div className="dashboard-grid">
      <section className="welcome-card">
        <h1>Welcome to the FAO Admin Portal</h1>
        <p>
          This interface is configured for FAO hybrid blue–green aesthetics and
          is ready to host GRM, Content, Media, Analytics and User Management
          modules. Use the left navigation to access modules.
        </p>
      </section>

      <section className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-title">Open Reports</div>
          <div className="kpi-value">—</div>
          <div className="kpi-sub">Reports awaiting action</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">Resolved (30d)</div>
          <div className="kpi-value">—</div>
          <div className="kpi-sub">Closed in the last 30 days</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">Active Users</div>
          <div className="kpi-value">—</div>
          <div className="kpi-sub">Users logged in this month</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">Uploads</div>
          <div className="kpi-value">—</div>
          <div className="kpi-sub">Media items stored</div>
        </div>
      </section>

      <section className="panel">
        <h2>Recent activity</h2>
        <p>Placeholder for activity feed, recent tickets, and system notes.</p>
      </section>
    </div>
  );
}


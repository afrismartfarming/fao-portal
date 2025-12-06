// frontend/client/src/pages/GrmDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StatusBadge from "../components/grm/StatusBadge";

export default function GrmDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`/api/grm/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Not available");

        if (mounted) {
          const rpt = data.report;
          setReport(rpt);

          // normalize to canonical
          const raw = rpt.status || "";
          const normalized = raw.toString().trim().toLowerCase().replace(/\s+/g, "_");
          setStatus(normalized);

          setHistory(rpt.statusHistory || []);
        }
      } catch (err) {
        console.error("Error loading GRM report:", err);
        if (mounted) setReport(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, [id]);

  async function handleStatusUpdate() {
    setUpdating(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/grm/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Status update failed");
        return;
      }

      const rpt = data.report;
      setReport(rpt);
      setHistory(rpt.statusHistory || []);
      setStatus(rpt.status);
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <div className="p-6">Loading report...</div>;
  if (!report) return <div className="p-6">Report not found.</div>;

  return (
    <div style={{ maxWidth: 900, padding: 20 }}>
      <button onClick={() => navigate("/grm")} style={styles.backBtn}>
        ← Back to GRM List
      </button>

      <h1 style={{ color: "var(--fao-blue)", marginBottom: 20 }}>
        GRM Report Details
      </h1>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>General Information</h2>

        <div style={styles.row}>
          <label style={styles.label}>Report ID:</label>
          <div>{report.reportId}</div>
        </div>

        <div style={styles.row}>
          <label style={styles.label}>Reporter:</label>
          <div>{report.reporterName || "Anonymous"}</div>
        </div>

        <div style={styles.row}>
          <label style={styles.label}>Category:</label>
          <div>{report.category}</div>
        </div>

        <div style={styles.row}>
          <label style={styles.label}>Priority:</label>
          <div><strong>{report.priority}</strong></div>
        </div>

        <div style={styles.row}>
          <label style={styles.label}>Current Status:</label>
          <StatusBadge status={report.status} />
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={styles.label}>Update Status:</label>

          <div style={{ display: "flex", gap: 12 }}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={styles.select}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <button
              type="button"
              style={styles.primaryBtn}
              disabled={updating}
              onClick={handleStatusUpdate}
            >
              {updating ? "Updating..." : "Save"}
            </button>
          </div>
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Description</h2>
        <p>{report.description}</p>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Activity History</h2>

        <ul style={styles.timeline}>
          {(history || []).map((item, idx) => (
            <li key={idx} style={styles.timelineItem}>
              <div style={styles.timelineDate}>
                {item.date ? new Date(item.date).toLocaleString() : ""}
              </div>
              <div style={styles.timelineAction}>{item.action}</div>
              <div style={styles.timelineBy}>by {item.by}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

const styles = {
  backBtn: {
    marginBottom: 20,
    padding: "10px 16px",
    borderRadius: 6,
    border: "none",
    background: "var(--fao-blue)",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
  },
  card: {
    background: "white",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 6px 18px rgba(16,24,40,0.04)",
    marginBottom: 20,
  },
  sectionTitle: {
    margin: "0 0 12px 0",
    color: "var(--fao-blue)",
    fontSize: 20,
    fontWeight: 700,
  },
  row: {
    display: "flex",
    marginBottom: 10,
    gap: 12,
    alignItems: "center",
  },
  label: {
    width: 140,
    color: "#475569",
    fontWeight: 600,
  },
  select: {
    padding: "10px 14px",
    borderRadius: 6,
    border: "1px solid #e2e8f0",
    minWidth: 180,
  },
  primaryBtn: {
    background: "var(--fao-green)",
    padding: "10px 16px",
    borderRadius: 6,
    border: "none",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
  timeline: {
    listStyle: "none",
    paddingLeft: 0,
    margin: 0,
  },
  timelineItem: {
    padding: "8px 0",
    borderBottom: "1px solid #eef2f6",
  },
  timelineDate: {
    fontSize: 13,
    color: "#64748b",
  },
  timelineAction: {
    fontWeight: 700,
    marginTop: 4,
  },
  timelineBy: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
};

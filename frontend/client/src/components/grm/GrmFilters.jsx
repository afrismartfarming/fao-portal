import React from "react";

export default function GrmFilters({ filters, onChange }) {
  function update(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search reports…"
        value={filters.q}
        onChange={(e) => update("q", e.target.value)}
        style={styles.input}
      />

    <select
  value={filters.status}
  onChange={(e) => update("status", e.target.value)}
  style={styles.select}
>
  <option value="all">All Status</option>
  <option value="reviewing">Reviewing</option>
  <option value="resolved">Resolved</option>
  <option value="rejected">Rejected</option>
  <option value="closed">Closed</option>
</select>


      <select
        value={filters.category}
        onChange={(e) => update("category", e.target.value)}
        style={styles.select}
      >
        <option value="all">All Categories</option>
        <option value="Land Dispute">Land Dispute</option>
        <option value="Project Complaint">Project Complaint</option>
        <option value="Other">Other</option>
      </select>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: 12,
    marginTop: 16,
    flexWrap: "wrap",
  },
  input: {
    padding: "10px 14px",
    borderRadius: 6,
    border: "1px solid #e2e8f0",
    flex: "1 1 260px",
  },
  select: {
    padding: "10px 14px",
    borderRadius: 6,
    border: "1px solid #e2e8f0",
    minWidth: 180,
  },
};


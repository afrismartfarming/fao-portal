// frontend/client/src/components/grm/StatusBadge.jsx

export default function StatusBadge({ status }) {
  const STATUS_STYLES = {
    open:        { color: "white", bg: "#0ea5e9", label: "Open" },
    in_progress: { color: "white", bg: "#0284c7", label: "In Progress" },
    resolved:    { color: "white", bg: "#16a34a", label: "Resolved" },
    closed:      { color: "white", bg: "#6b7280", label: "Closed" },
  };

  const s = status ? status.toString().trim().toLowerCase().replace(/\s+/g, "_") : "open";
  const style = STATUS_STYLES[s] || STATUS_STYLES["open"];

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 20,
        backgroundColor: style.bg,
        color: style.color,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {style.label}
    </span>
  );
}

import StatusBadge from "./StatusBadge";
import { useNavigate } from "react-router-dom";

export default function GrmRow({ row }) {
  const navigate = useNavigate();

  if (!row) return null;

  const rowId = row.id || row._id;

  return (
    <>
      <td className="p-3 text-sm text-gray-700">
        {row.reportId || rowId || "—"}
      </td>

      <td className="p-3 text-sm text-gray-700">
        {row.reporterName || "Unknown"}
      </td>

      <td className="p-3 text-sm text-gray-700">
        {row.category || "Uncategorized"}
      </td>

      <td className="p-3 text-sm text-gray-700">
        {row.chiefdom || "N/A"}
      </td>

      <td className="p-3 text-sm">
        <StatusBadge status={row.status || "pending"} />
      </td>

      <td className="p-3 text-sm text-gray-700">
        {row.createdAt
          ? new Date(row.createdAt).toLocaleDateString()
          : "—"}
      </td>

      <td className="p-3 text-sm">
        <button
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate(`/grm/${rowId}`)}
        >
          View
        </button>
      </td>
    </>
  );
}


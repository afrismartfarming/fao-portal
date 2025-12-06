import GrmRow from "./GrmRow";

export default function GrmTable({ rows = [] }) {
  if (!Array.isArray(rows)) {
    return (
      <div className="text-red-700 p-4 font-semibold">
        Invalid data format for GRM table.
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="p-4 text-gray-600">
        No grievance records found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-400 shadow-md bg-white">
      <table className="min-w-full table-auto border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200 border-b border-gray-500">
            <th className="p-3 font-semibold text-sm text-left border border-gray-400">ID</th>
            <th className="p-3 font-semibold text-sm text-left border border-gray-400">Reporter</th>
            <th className="p-3 font-semibold text-sm text-left border border-gray-400">Category</th>
            <th className="p-3 font-semibold text-sm text-left border border-gray-400">Chiefdom</th>
            <th className="p-3 font-semibold text-sm text-left border border-gray-400">Status</th>
            <th className="p-3 font-semibold text-sm text-left border border-gray-400">Date</th>
            <th className="p-3 font-semibold text-sm text-left border border-gray-400">Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.id || row._id || index}
              className={`border border-gray-400 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
            >
              <GrmRow row={row} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


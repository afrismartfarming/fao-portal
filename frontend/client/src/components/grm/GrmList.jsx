// src/components/Grm/GrmList.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/client";
import { useNavigate } from "react-router-dom";

export default function GrmList(){
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/grm");
        setRows(res.data.data.results || []);
      } catch (err) {
        console.error("GRM list error", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading GRM records...</div>;
  if (!rows.length) return <div className="p-6">No grievance records found.</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Grievance Records</h2>
          <button onClick={() => navigate("/grm/submit")} className="px-3 py-2 bg-blue-600 text-white rounded">Submit a Grievance</button>
        </div>

        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Reporter</th>
              <th className="p-2">Category</th>
              <th className="p-2">Chiefdom</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{r.reportId}</td>
                <td className="p-2">{r.reporterName}</td>
                <td className="p-2">{r.category}</td>
                <td className="p-2">{r.chiefdom}</td>
                <td className="p-2">{r.status}</td>
                <td className="p-2">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}</td>
                <td className="p-2">
                  <button onClick={() => navigate(`/grm/${r.id || r._id}`)} className="text-blue-600">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

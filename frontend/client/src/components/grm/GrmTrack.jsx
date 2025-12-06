// src/components/Grm/GrmTrack.jsx
import React, { useState } from "react";
import api from "../../api/client";

export default function GrmTrack(){
  const [id, setId] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchReport(e){
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await api.get(`/grm/${id}`);
      setReport(res.data.report);
    } catch (err) {
      console.error("track error", err);
      alert("Not found");
      setReport(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Track a Grievance</h2>
        <form onSubmit={fetchReport} className="flex gap-3 mb-4">
          <input value={id} onChange={e=>setId(e.target.value)} placeholder="Report ID or ObjectId" className="flex-1 p-2 border rounded" />
          <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? "Searching..." : "Search" }</button>
        </form>

        {report && (
          <div>
            <div className="mb-2"><strong>ID:</strong> {report.reportId}</div>
            <div className="mb-2"><strong>Status:</strong> {report.status}</div>
            <div className="mb-2"><strong>Timeline:</strong></div>
            <ul className="list-disc pl-6">
              {(report.statusHistory || []).map((h, i) => (
                <li key={i}><div>{h.date ? new Date(h.date).toLocaleString() : ""} — {h.action} by {h.by}</div></li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

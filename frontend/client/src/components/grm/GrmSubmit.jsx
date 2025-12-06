// src/components/Grm/GrmSubmit.jsx
import React, { useState } from "react";
import api from "../../api/client";
import { useNavigate } from "react-router-dom";

export default function GrmSubmit(){
  const [form, setForm] = useState({ reporterName:"", reporterPhone:"", category:"Land Dispute", district:"", chiefdom:"", village:"", description:"" });
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post("/grm", form);
      const id = res.data.report?._id || res.data.report?.id;
      alert("Submitted: " + (res.data.report?.reportId || id));
      nav("/grm");
    } catch (err) {
      console.error("submit error", err);
      alert("Submission failed");
    } finally {
      setSaving(false);
    }
  }

  function setField(k, v){ setForm(prev => ({...prev, [k]: v})); }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Submit a Grievance</h2>
        <form onSubmit={submit} className="space-y-3">
          <input value={form.reporterName} onChange={e=>setField("reporterName", e.target.value)} placeholder="Your name" className="w-full p-2 border rounded" />
          <input value={form.reporterPhone} onChange={e=>setField("reporterPhone", e.target.value)} placeholder="Phone" className="w-full p-2 border rounded" />
          <select value={form.category} onChange={e=>setField("category", e.target.value)} className="w-full p-2 border rounded">
            <option>Land Dispute</option>
            <option>Project Complaint</option>
            <option>Other</option>
          </select>
          <input value={form.district} onChange={e=>setField("district", e.target.value)} placeholder="District" className="w-full p-2 border rounded" />
          <input value={form.chiefdom} onChange={e=>setField("chiefdom", e.target.value)} placeholder="Chiefdom" className="w-full p-2 border rounded" />
          <textarea value={form.description} onChange={e=>setField("description", e.target.value)} placeholder="Description" rows={6} className="w-full p-2 border rounded" />
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={saving}>
              {saving ? "Submitting..." : "Submit"}
            </button>
            <button type="button" className="px-4 py-2 border rounded" onClick={()=>window.location="/grm"}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

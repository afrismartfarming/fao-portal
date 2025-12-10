// frontend/client/src/pages/Grm.jsx

import { useEffect, useState, useContext } from "react";
import api from "../api/client.js";
import GrmTable from "../components/grm/GrmTable";
import { AuthContext } from "../context/AuthContext";

export default function Grm() {
  const { isAuthenticated } = useContext(AuthContext);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    loadGrmRecords();
  }, [isAuthenticated]);

  async function loadGrmRecords() {
    try {
      const res = await api.get("/grm");   // token auto injected

      console.log("API GRM RAW:", res);

      const results =
        res?.data?.results ||
        res?.data?.data?.results ||       // compatibility
        res?.results ||
        [];

      setRecords(results);
      setLoading(false);
    } catch (err) {
      console.error("GRM FETCH ERROR:", err);
      setError("Failed to load grievance records.");
      setLoading(false);
    }
  }

  if (!isAuthenticated)
    return <div className="p-6 text-center text-red-700 font-semibold">
      You must be logged in to access GRM data.
    </div>;

  if (loading) return <div className="p-6">Loading GRM data...</div>;

  if (error)
    return <div className="p-6 text-red-700 font-semibold">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Grievance Records Management</h1>
      <GrmTable rows={records} />
    </div>
  );
}

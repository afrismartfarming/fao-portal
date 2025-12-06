import { useEffect, useState } from "react";
import api from "../../api/client";

export default function ContentList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/content")
      .then(res => setItems(res.data.results || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="p-4">
      <h1>Content Manager</h1>
      <ul>
        {items.map(c => (
          <li key={c._id}>{c.title} — {c.status}</li>
        ))}
      </ul>
    </div>
  );
}

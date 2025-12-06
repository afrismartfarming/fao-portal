import { useState } from "react";
import api from "../../api/client";

export default function ContentEditor() {
  const [form, setForm] = useState({ title: "", summary: "", body: "" });

  const save = () => {
    api.post("/content", form)
      .then(res => alert("Created"))
      .catch(() => alert("Error"));
  };

  return (
    <div className="p-4">
      <h1>Create Content</h1>

      <input
        type="text"
        placeholder="Title"
        onChange={e => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder="Body"
        onChange={e => setForm({ ...form, body: e.target.value })}
      />

      <button onClick={save}>Save</button>
    </div>
  );
}

import { useState } from "react";
import api from "../../api/client";

export default function MediaLibrary() {
  const [file, setFile] = useState(null);

  const upload = () => {
    const data = new FormData();
    data.append("file", file);

    api.post("/media", data)
      .then(() => alert("Uploaded!"))
      .catch(() => alert("Error uploading"));
  };

  return (
    <div className="p-4">
      <h1>Media Library</h1>

      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={upload}>Upload</button>
    </div>
  );
}

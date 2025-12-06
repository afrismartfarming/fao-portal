import React from "react";
import ContentManagerUI from "../components/ContentManager/ContentManagerUI.jsx";

export default function ContentManagerPreview() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-8">Content Manager UI Preview</h1>

      {/* Render your actual UI component */}
      <ContentManagerUI />
    </div>
  );
}


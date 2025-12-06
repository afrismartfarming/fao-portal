import React from "react";

export default function KnowledgeHub() {
  return (
    <div className="container mx-auto px-4">
      <div className="bg-white p-8 rounded shadow mt-6">
        <h1 className="text-2xl font-bold mb-4">Knowledge Hub</h1>
        <p className="mb-4">A repository of training manuals, toolkits, reports and IEC materials for stakeholders and communities.</p>
        <ul className="list-disc list-inside">
          <li>Training Manuals</li>
          <li>Mediation Guides</li>
          <li>IEC for low literacy audiences</li>
        </ul>
      </div>
    </div>
  );
}

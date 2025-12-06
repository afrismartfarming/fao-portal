import React from "react";

export default function About() {
  return (
    <div className="container mx-auto px-4">
      <div className="bg-white p-8 rounded shadow mt-6">
        <h1 className="text-2xl font-bold mb-4">About the Project</h1>
        <p className="mb-4">This FAO–MLHCP project supports land governance reforms, strengthens dispute resolution, and enhances women's land rights across targeted districts in Sierra Leone. The initiative works with customary authorities, district councils, and civil society to ensure inclusive access to land justice.</p>

        <h2 className="text-lg font-semibold mt-6">Objectives</h2>
        <ul className="list-disc list-inside">
          <li>Strengthen dispute resolution mechanisms at chiefdom and district levels</li>
          <li>Improve women's access to secure land rights</li>
          <li>Increase transparency and accountability using GRM and KM systems</li>
        </ul>
      </div>
    </div>
  );
}

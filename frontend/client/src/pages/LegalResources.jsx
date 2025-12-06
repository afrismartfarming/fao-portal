import React from "react";

const TOR_URL = "/public-files/ToR_Knowledge%20management%20and%20communication%20consultant.7-10-2025.docx";

export default function LegalResources() {
  const docs = [
    { title: "Customary Land Rights Act (2022)", file: "/documents/clra2022.pdf" },
    { title: "National Land Policy (2015)", file: "/documents/national-land-policy.pdf" },
    { title: "TOR (KM & Communication Consultant)", file: TOR_URL }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white p-8 rounded shadow mt-6">
        <h1 className="text-2xl font-bold mb-4">Legal & Policy Resources</h1>
        <p className="mb-4">Download official documents, simplified summaries, and low-literacy graphics for community distribution.</p>

        <ul className="space-y-3">
          {docs.map((d, i) => (
            <li key={i} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{d.title}</div>
                <div className="text-sm text-gray-500">PDF / DOCX</div>
              </div>
              <a href={d.file} target="_blank" rel="noreferrer" className="text-blue-600 underline">Download</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

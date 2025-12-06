import React from "react";

export default function News() {
  const posts = [
    { title: "Project Launch in Moyamba", date: "2025-11-18", excerpt: "FAO launches the land dispute resolution project in Moyamba district." }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white p-8 rounded shadow mt-6">
        <h1 className="text-2xl font-bold mb-4">News & Updates</h1>
        <ul className="space-y-4">
          {posts.map((p, i) => (
            <li key={i} className="border p-4 rounded">
              <div className="text-sm text-gray-500">{p.date}</div>
              <div className="font-semibold">{p.title}</div>
              <p className="text-gray-700">{p.excerpt}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import React from "react";

export default function Contacts() {
  return (
    <div className="container mx-auto px-4">
      <div className="bg-white p-8 rounded shadow mt-6">
        <h1 className="text-2xl font-bold mb-4">Contact</h1>
        <p>FAO Sierra Leone – Country Office</p>
        <p className="mt-2">Email: fao-sierraleone@fao.org</p>
        <p>Phone: +232 76 000 000</p>

        <h2 className="mt-6 font-semibold">Feedback & Inquiries</h2>
        <form className="space-y-3 mt-3">
          <input className="w-full p-2 border rounded" placeholder="Your name" />
          <input className="w-full p-2 border rounded" placeholder="Phone or email" />
          <textarea className="w-full p-2 border rounded" placeholder="Message" />
          <div>
            <button className="px-4 py-2 bg-fao-blue text-white rounded">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
}

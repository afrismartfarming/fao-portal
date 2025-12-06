/*
ContentManager_UI_Components.jsx
React component library + preview for the TOR-aligned Public Website (Option A)
References: TOR doc uploaded at file:///mnt/data/ToR_Knowledge management and communication consultant .docx

This single-file preview includes:
- A minimal design system using Tailwind classes
- Reusable components: Layout, Header, Footer, HeroBanner, NewsCard, NewsList,
  NewsDetail stub, ResourceCard, MediaGrid, Pagination, SearchBar, ContactForm
- Admin component stubs: AdminDashboard, ContentEditor, MediaUploader
- A preview page that renders each component so designers/devs can inspect

Notes:
- Export default is a preview page so the canvas can render the components.
- Replace API calls with your actual endpoints (services/api.js) when integrating.
*/

import React from 'react';

// --- Design tokens (small set) ---
const Brand = {
  primary: 'text-blue-700',
  accent: 'text-yellow-600',
  muted: 'text-gray-500',
};

// --- Shared layout ---
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white font-bold">FAO</div>
          <div>
            <div className="text-lg font-semibold">FAO - MLHCP Project</div>
            <div className="text-sm text-gray-500">Knowledge & Communications Hub</div>
          </div>
        </div>
        <nav>
          <ul className="flex gap-6 items-center">
            <li className="hover:underline"><a href="#">Home</a></li>
            <li className="hover:underline"><a href="#news">News</a></li>
            <li className="hover:underline"><a href="#resources">Resources</a></li>
            <li className="hover:underline"><a href="#gallery">Gallery</a></li>
            <li className="hover:underline"><a href="#grm">GRM</a></li>
            <li><button className="bg-blue-600 text-white px-3 py-2 rounded">Submit a Complaint</button></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-3 gap-6">
        <div>
          <h4 className="font-semibold">About</h4>
          <p className="text-sm text-gray-600 mt-2">FAO–MLHCP communications and knowledge hub. Project visibility, resources, and GRM.</p>
        </div>
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li>News</li>
            <li>Resources</li>
            <li>Gallery</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Contact</h4>
          <p className="text-sm text-gray-600 mt-2">Email: info@example.org<br/>Hotline: +232 76 000 000</p>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 py-4 border-t">© FAO — Project Communications</div>
    </footer>
  );
}

// --- Hero Banner ---
export function HeroBanner({ title, subtitle, ctas = [] }) {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-white rounded-lg p-8 mb-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800">{title}</h1>
          <p className="mt-3 text-gray-700 max-w-2xl">{subtitle}</p>
          <div className="mt-4 flex gap-3">
            {ctas.map((c, i) => (
              <a key={i} href={c.href} className={`px-4 py-2 rounded ${c.primary ? 'bg-blue-600 text-white' : 'border'}`}>{c.label}</a>
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400">Hero media</div>
        </div>
      </div>
    </section>
  );
}

// --- News card & list ---
export function NewsCard({ item }) {
  return (
    <article className="border rounded-md overflow-hidden shadow-sm">
      <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400">Image</div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{item.title}</h3>
        <p className="text-sm text-gray-600 mt-2">{item.excerpt}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">{item.date}</span>
          <a href="#" className="text-blue-600 text-sm">Read more</a>
        </div>
      </div>
    </article>
  );
}

export function NewsList({ items = [] }) {
  return (
    <section id="news" className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((it, idx) => <NewsCard key={idx} item={it} />)}
      </div>
    </section>
  );
}

// --- News Detail stub ---
export function NewsDetail({ item }) {
  return (
    <article className="prose max-w-none">
      <h1 className="text-3xl font-bold">{item.title}</h1>
      <p className="text-sm text-gray-500">{item.date} — {item.author}</p>
      <div className="mt-4">
        <div className="h-64 bg-gray-100 flex items-center justify-center">Featured image</div>
      </div>
      <div className="mt-6">
        <p>{item.body}</p>
      </div>
    </article>
  );
}

// --- Resources ---
export function ResourceCard({ doc }) {
  return (
    <div className="border rounded p-3 flex items-start gap-3">
      <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-gray-500">PDF</div>
      <div className="flex-1">
        <div className="font-semibold">{doc.title}</div>
        <div className="text-sm text-gray-600">{doc.description}</div>
        <div className="mt-2 text-xs text-gray-500">{doc.type} • {doc.year}</div>
      </div>
      <div>
        <a className="text-blue-600 text-sm" href="#">Download</a>
      </div>
    </div>
  );
}

export function ResourceList({ docs = [] }) {
  return (
    <section id="resources" className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Resource Library</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {docs.map((d, i) => <ResourceCard key={i} doc={d} />)}
      </div>
    </section>
  );
}

// --- Media grid ---
export function MediaGrid({ items = [] }) {
  return (
    <section id="gallery" className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Media Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((it, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">Thumb</div>
        ))}
      </div>
    </section>
  );
}

// --- Pagination ---
export function Pagination({ page = 1, pages = 5, onPage }) {
  const arr = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <div className="flex gap-2 items-center">
      {arr.map(p => (
        <button key={p} onClick={() => onPage && onPage(p)} className={`px-2 py-1 rounded ${p===page ? 'bg-blue-600 text-white' : 'border'}`}>{p}</button>
      ))}
    </div>
  );
}

// --- Search bar ---
export function SearchBar({ placeholder='Search...' }) {
  return (
    <div className="relative">
      <input className="w-full border rounded px-3 py-2" placeholder={placeholder} />
      <button className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded">Search</button>
    </div>
  );
}

// --- Contact Form ---
export function ContactForm() {
  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <input className="border rounded px-3 py-2" placeholder="Name" />
      <input className="border rounded px-3 py-2" placeholder="Email" />
      <input className="border rounded px-3 py-2" placeholder="Phone" />
      <select className="border rounded px-3 py-2">
        <option>Topic</option>
      </select>
      <textarea className="border rounded px-3 py-2 md:col-span-2" rows={5} placeholder="Message" />
      <div className="md:col-span-2 flex justify-end">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
      </div>
    </form>
  );
}

// --- Admin stubs ---
export function AdminDashboard() {
  return (
    <div className="bg-white border rounded p-4">
      <h3 className="font-semibold">CMS Dashboard</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
        <div className="p-3 border rounded">News<br/><span className="text-2xl font-bold">24</span></div>
        <div className="p-3 border rounded">Publications<br/><span className="text-2xl font-bold">12</span></div>
        <div className="p-3 border rounded">Media<br/><span className="text-2xl font-bold">180</span></div>
        <div className="p-3 border rounded">Users<br/><span className="text-2xl font-bold">5</span></div>
      </div>
    </div>
  );
}

export function ContentEditor({ type='news' }) {
  return (
    <div className="border rounded p-4">
      <h3 className="font-semibold">New {type}</h3>
      <input className="border rounded px-3 py-2 w-full mb-2" placeholder="Title" />
      <input className="border rounded px-3 py-2 w-full mb-2" placeholder="Subtitle / Excerpt" />
      <div className="mb-2">Editor (rich text) placeholder</div>
      <div className="flex gap-2 mt-2">
        <button className="bg-blue-600 text-white px-3 py-1 rounded">Save Draft</button>
        <button className="border px-3 py-1 rounded">Publish</button>
      </div>
    </div>
  );
}

export function MediaUploader() {
  return (
    <div className="border rounded p-4">
      <h4 className="font-semibold">Upload Media</h4>
      <div className="mt-2 border-dashed border-2 border-gray-200 p-6 text-center">Drag & drop files here or click to browse</div>
      <div className="mt-3 flex gap-2">
        <button className="bg-blue-600 text-white px-3 py-1 rounded">Upload</button>
      </div>
    </div>
  );
}

// --- Preview page (default export) ---
export default function ComponentLibraryPreview() {
  const sampleNews = [
    { title: 'Land dispute resolved in Kori', excerpt: 'Summary of outcome and parties involved', date: '2025-11-19' },
    { title: 'Training on safeguards completed', excerpt: 'Capacity building for district officers', date: '2025-10-10' },
    { title: 'New resource: ESCP 2025', excerpt: 'Download the full ESCP document', date: '2025-09-01' }
  ];

  const sampleDocs = [
    { title: 'ESCP - Full Document', description: 'Environmental & Social Commitment Plan', type: 'Report', year: 2025 },
    { title: 'GRM Procedures', description: 'How to submit and track grievances', type: 'Guideline', year: 2024 },
    { title: 'Training Manual', description: 'Community engagement protocols', type: 'Manual', year: 2023 }
  ];

  return (
    <PublicLayout>
      <HeroBanner title="FAO–MLHCP Knowledge & Communications Hub" subtitle="Visibility, resources, and a transparent GRM." ctas={[{label:'About', href:'#about'},{label:'Submit GRM', href:'#grm', primary:true}]} />

      <NewsList items={sampleNews} />
      <ResourceList docs={sampleDocs} />
      <MediaGrid items={[1,2,3,4,5,6,7,8]} />

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Admin preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdminDashboard />
          <ContentEditor type="news" />
          <MediaUploader />
        </div>
      </section>

    </PublicLayout>
  );
}


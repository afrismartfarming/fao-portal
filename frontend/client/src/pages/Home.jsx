import React, { useEffect, useState } from "react";
import api from "../api/client";
import { Link } from "react-router-dom";

export default function Home() {
  const [stats, setStats] = useState({
    grievances: 0,
    resolved: 0,
    districts: 0,
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await api.get("/grm");
        const results = res.data?.data?.results || [];
        const count = results.length;
        const resolved = results.filter(
          (r) => r.status === "resolved" || r.status === "closed"
        ).length;
        const districts = new Set(
          results.map((r) => r.district).filter(Boolean)
        ).size;

        if (mounted) setStats({ grievances: count, resolved, districts });
      } catch (err) {
        console.error("Home load error", err);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  return (
    <div className="w-full">

      {/* HERO SECTION */}
      <section className="bg-fao-blue text-white py-16 px-wrapper">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-semibold mb-4">
            Strengthening Land Governance, Dispute Resolution & Women’s Access to Land
          </h1>

          <p className="text-lg text-fao-blue-light/90 max-w-3xl mx-auto mb-8">
            A national platform supporting transparent, inclusive, and community-driven 
            mechanisms for addressing land grievances across Sierra Leone.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/grm/submit"
              className="px-6 py-3 bg-white text-fao-blue font-medium rounded shadow-sm hover:bg-fao-blue-light transition"
            >
              Submit a Grievance
            </Link>
            <Link
              to="/legal"
              className="px-6 py-3 border border-white text-white font-medium rounded hover:bg-white/10 transition"
            >
              Legal Resources
            </Link>
            <Link
              to="/knowledge"
              className="px-6 py-3 border border-white text-white font-medium rounded hover:bg-white/10 transition"
            >
              Knowledge Hub
            </Link>
          </div>
        </div>
      </section>

      {/* PROGRAM OVERVIEW */}
      <section className="py-12 bg-fao-gray px-wrapper">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white shadow-card p-8 rounded-md border border-fao-gray-dark">
            <h2 className="font-heading text-2xl text-fao-blue-dark mb-3">
              About the Program
            </h2>

            <p className="text-fao-text mb-6 leading-relaxed">
              This FAO–MLHCP initiative enhances land governance reforms, strengthens 
              dispute-resolution mechanisms, and empowers women with secure land rights 
              across Sierra Leone. The system serves as a central gateway for grievance 
              submission, tracking, documentation, and knowledge dissemination.
            </p>

            <h3 className="font-heading text-xl text-fao-blue mb-2">Key Objectives</h3>
            <ul className="list-disc list-inside text-fao-muted space-y-1">
              <li>Improve local dispute resolution mechanisms at chiefdom and district levels.</li>
              <li>Enhance women’s access to secure and equitable land rights.</li>
              <li>Strengthen transparency and accountability using GRM and KM systems.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="py-12 px-wrapper">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">

          <MetricCard
            label="Grievances Submitted"
            value={stats.grievances}
            detail="Reports received"
          />

          <MetricCard
            label="Resolved Cases"
            value={stats.resolved}
            detail="Closed successfully"
          />

          <MetricCard
            label="Districts Covered"
            value={stats.districts}
            detail="Nationwide impact"
          />
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="py-16 bg-fao-blue-light px-wrapper">
        <div className="max-w-5xl mx-auto text-center">

          <h2 className="font-heading text-2xl text-fao-blue-dark mb-4">
            Engage with the Platform
          </h2>

          <p className="text-fao-text max-w-2xl mx-auto mb-8">
            Participate in strengthening land governance in Sierra Leone. 
            Explore our resources, submit cases, or learn about ongoing reforms.
          </p>

          <div className="flex justify-center gap-6 flex-wrap">
            <Link
              to="/grm/submit"
              className="px-6 py-3 bg-fao-blue text-white rounded shadow-sm hover:bg-fao-blue-dark transition"
            >
              Submit a Case
            </Link>

            <Link
              to="/news"
              className="px-6 py-3 border border-fao-blue-dark text-fao-blue-dark rounded hover:bg-fao-blue-light transition"
            >
              Latest News
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

/* METRIC CARD COMPONENT */
function MetricCard({ label, value, detail }) {
  return (
    <div className="bg-white p-6 rounded-md shadow-card border border-fao-gray-dark text-center">
      <div className="text-fao-muted text-sm">{label}</div>
      <div className="text-3xl font-heading text-fao-blue-dark mt-2 mb-1">{value}</div>
      <div className="text-xs text-fao-muted">{detail}</div>
    </div>
  );
}

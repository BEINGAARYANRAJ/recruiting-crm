"use client";

import { useState } from "react";
import KanbanBoard from "@/components/KanbanBoard";
import AddApplicationModal from "@/components/AddApplicationModal";
import { getApplications } from "@/app/actions/applications";

type Application = Awaited<ReturnType<typeof getApplications>>[number];

export default function DashboardClient({ initialApplications }: { initialApplications: Application[] }) {
  const [applications, setApplications] = useState(initialApplications);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = applications.filter((a) =>
    a.company.name.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase())
  );

  async function reload() {
    const data = await getApplications();
    setApplications(data);
  }

  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: "24px",
      }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>Applications</h1>
          <p style={{ color: "#555", fontSize: "13px", margin: "4px 0 0" }}>
            {applications.length} total
          </p>
        </div>
        <input
          type="text"
          placeholder="Search company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: "#111",
            border: "1px solid #222",
            borderRadius: "8px",
            padding: "7px 14px",
            color: "#fff",
            fontSize: "13px",
            outline: "none",
            width: "220px",
          }}
        />
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: "#fff", color: "#000", border: "none",
            borderRadius: "8px", padding: "8px 16px",
            fontSize: "13px", fontWeight: "600", cursor: "pointer",
          }}
        >
          + Add Application
        </button>
      </div>

      <KanbanBoard initialApplications={filtered} />

      {showModal && (
        <AddApplicationModal onClose={() => { setShowModal(false); reload(); }} />
      )}
    </div>
  );
}
"use client";

import { useDroppable } from "@dnd-kit/core";
import ApplicationCard from "./ApplicationCard";

type Props = {
  column: { id: string; label: string; color: string };
  applications: any[];
};

export default function KanbanColumn({ column, applications }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div style={{ minWidth: "220px", width: "220px", flexShrink: 0 }}>
      {/* Column header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "10px",
        padding: "0 4px",
      }}>
        <div style={{
          width: "8px", height: "8px",
          borderRadius: "50%",
          background: column.color,
        }} />
        <span style={{ fontSize: "12px", fontWeight: "600", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {column.label}
        </span>
        <span style={{
          marginLeft: "auto",
          background: "#1a1a1a",
          color: "#555",
          borderRadius: "10px",
          padding: "1px 7px",
          fontSize: "11px",
        }}>
          {applications.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        style={{
          minHeight: "400px",
          background: isOver ? "#111" : "#0d0d0d",
          borderRadius: "10px",
          border: `1px solid ${isOver ? column.color + "44" : "#1a1a1a"}`,
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          transition: "border-color 0.15s, background 0.15s",
        }}
      >
        {applications.map((app) => (
          <ApplicationCard key={app.id} application={app} />
        ))}
      </div>
    </div>
  );
}
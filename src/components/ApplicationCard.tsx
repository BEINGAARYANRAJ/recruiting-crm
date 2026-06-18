"use client";

import { useRouter } from "next/navigation";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  application: any;
  isDragging?: boolean;
};

function getDaysAgo(date: Date | string) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
}

function getNextEvent(events: any[]) {
  if (!events?.length) return null;
  const next = events[0];
  const date = new Date(next.scheduledAt);
  const diff = date.getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return null;
  if (days === 0) return { label: next.type.replace("_", " "), urgent: true, text: "Today" };
  if (days === 1) return { label: next.type.replace("_", " "), urgent: true, text: "Tomorrow" };
  return { label: next.type.replace("_", " "), urgent: false, text: `in ${days}d` };
}

export default function ApplicationCard({ application, isDragging }: Props) {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: application.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const nextEvent = getNextEvent(application.events);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div
        onClick={() => router.push(`/dashboard/applications/${application.id}`)}
        style={{
          background: "#161616",
          border: "1px solid #222",
          borderRadius: "8px",
          padding: "12px",
          cursor: "grab",
          userSelect: "none",
        }}
      >
        <div style={{ fontSize: "13px", fontWeight: "600", color: "#fff", marginBottom: "2px" }}>
          {application.company.name}
        </div>
        <div style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>
          {application.role}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", color: "#444" }}>
            {getDaysAgo(application.appliedDate)}
          </span>
          {nextEvent && (
            <span style={{
              fontSize: "10px",
              padding: "2px 7px",
              borderRadius: "6px",
              background: nextEvent.urgent ? "#422" : "#1a1a1a",
              color: nextEvent.urgent ? "#f87171" : "#555",
              border: `1px solid ${nextEvent.urgent ? "#633" : "#222"}`,
            }}>
              {nextEvent.label} {nextEvent.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
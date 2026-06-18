"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { updateApplicationStatus } from "@/app/actions/applications";
import KanbanColumn from "./KanbanColumn";
import ApplicationCard from "./ApplicationCard";

const COLUMNS = [
  { id: "WISHLIST",     label: "Wishlist",      color: "#6b7280" },
  { id: "APPLIED",      label: "Applied",       color: "#3b82f6" },
  { id: "OA",           label: "OA",            color: "#f59e0b" },
  { id: "PHONE_SCREEN", label: "Phone Screen",  color: "#8b5cf6" },
  { id: "TECHNICAL",    label: "Technical",     color: "#06b6d4" },
  { id: "HR",           label: "HR Round",      color: "#ec4899" },
  { id: "ONSITE",       label: "Onsite",        color: "#f97316" },
  { id: "OFFER",        label: "Offer",         color: "#22c55e" },
  { id: "REJECTED",     label: "Rejected",      color: "#ef4444" },
];

type Application = Awaited<ReturnType<typeof import("@/app/actions/applications").getApplications>>[number];

export default function KanbanBoard({ initialApplications }: { initialApplications: Application[] }) {
  const [applications, setApplications] = useState(initialApplications);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setApplications(initialApplications);
  }, [initialApplications]);

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  }));

  const activeApp = applications.find((a) => a.id === activeId);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const newStatus = over.id as string;
    const appId = active.id as string;

    setApplications((prev) =>
      prev.map((a) => a.id === appId ? { ...a, status: newStatus as any } : a)
    );

    await updateApplicationStatus(appId, newStatus);
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} accessibility={{ announcements: {} }}>
      <div style={{
        display: "flex",
        gap: "12px",
        overflowX: "auto",
        paddingBottom: "16px",
        minHeight: "calc(100vh - 160px)",
      }}>
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            applications={applications.filter((a) => a.status === col.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeApp ? <ApplicationCard application={activeApp} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
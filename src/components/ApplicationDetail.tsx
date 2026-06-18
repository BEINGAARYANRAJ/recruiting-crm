"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  updateApplication,
  deleteApplication,
  deleteEvent,
  markEventComplete,
  toggleFollowup,
  deleteFollowup,
} from "@/app/actions/applications";
import AddEventModal from "./AddEventModal";
import AddFollowupModal from "./AddFollowupModal";

type Props = { application: any };

const STATUS_OPTIONS = [
  "WISHLIST","APPLIED","OA","PHONE_SCREEN",
  "TECHNICAL","HR","ONSITE","OFFER","REJECTED","WITHDRAWN"
];

const EVENT_COLORS: Record<string, string> = {
  OA: "#f59e0b",
  PHONE_SCREEN: "#8b5cf6",
  TECHNICAL: "#06b6d4",
  HR_ROUND: "#ec4899",
  ONSITE: "#f97316",
  OFFER_CALL: "#22c55e",
  OTHER: "#6b7280",
};

function getCountdown(date: string) {
  const diff = new Date(date).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return { text: "Past", urgent: false };
  if (days === 0) return { text: "Today", urgent: true };
  if (days === 1) return { text: "Tomorrow", urgent: true };
  return { text: `in ${days}d`, urgent: false };
}

export default function ApplicationDetail({ application }: Props) {
  const router = useRouter();
  const [notes, setNotes] = useState(application.notes || "");
  const [status, setStatus] = useState(application.status);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddFollowup, setShowAddFollowup] = useState(false);

  async function handleSave() {
    setSaving(true);
    await updateApplication(application.id, { notes, status });
    setSaving(false);
    toast.success("Changes saved");
  }

  async function handleDelete() {
    setDeleting(true);
    await deleteApplication(application.id);
    toast.success("Application deleted");
    router.push("/dashboard");
  }

  async function handleDeleteEvent(eventId: string) {
    await deleteEvent(eventId, application.id);
    toast.success("Event removed");
    router.refresh();
  }

  async function handleCompleteEvent(eventId: string) {
    await markEventComplete(eventId, application.id);
    toast.success("Event marked complete");
    router.refresh();
  }

  const fieldStyle = {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#fff",
    fontSize: "13px",
    width: "100%",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      {/* Back */}
      <button
        onClick={() => router.push("/dashboard")}
        style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "13px", marginBottom: "20px", padding: 0 }}
      >
        ← Back to Dashboard
      </button>

      {/* Header */}
      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", margin: "0 0 4px" }}>
            {application.company.name}
          </h1>
          <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>{application.role}</p>
          {application.jobUrl && (
            <a href={application.jobUrl} target="_blank" rel="noreferrer"
              style={{ color: "#3b82f6", fontSize: "12px", marginTop: "6px", display: "inline-block" }}>
              View Job Posting ↗
            </a>
          )}
        </div>
        <div style={{
          background: "#1a1a1a", border: "1px solid #2a2a2a",
          borderRadius: "8px", padding: "8px 14px", fontSize: "12px", color: "#888",
        }}>
          Applied {new Date(application.appliedDate).toLocaleDateString("en-GB")}
        </div>
      </div>

      {/* Status */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", color: "#666", fontSize: "12px", marginBottom: "6px" }}>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ ...fieldStyle, cursor: "pointer" }}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", color: "#666", fontSize: "12px", marginBottom: "6px" }}>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          style={{ ...fieldStyle, resize: "none" }}
          placeholder="Add notes..."
        />
      </div>

      {/* Save / Delete */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "32px" }}>
        <button onClick={handleSave} disabled={saving} style={{
          flex: 1, padding: "10px", background: saving ? "#333" : "#fff",
          border: "none", borderRadius: "8px",
          color: saving ? "#666" : "#000", fontSize: "13px",
          fontWeight: "600", cursor: saving ? "not-allowed" : "pointer",
        }}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button onClick={() => setShowDeleteConfirm(true)} style={{
          padding: "10px 20px", background: "transparent",
          border: "1px solid #3a1a1a", borderRadius: "8px",
          color: "#f87171", fontSize: "13px", cursor: "pointer",
        }}>
          Delete
        </button>
      </div>

      {/* Events Timeline */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "700", margin: 0, color: "#fff" }}>Timeline</h2>
          <button
            onClick={() => setShowAddEvent(true)}
            style={{
              background: "transparent", border: "1px solid #2a2a2a",
              borderRadius: "7px", padding: "5px 12px",
              color: "#aaa", fontSize: "12px", cursor: "pointer",
            }}
          >
            + Add Event
          </button>
        </div>

        {application.events.length === 0 ? (
          <div style={{ color: "#444", fontSize: "13px", padding: "20px", textAlign: "center", background: "#111", borderRadius: "8px", border: "1px solid #1a1a1a" }}>
            No events yet — add your first interview or OA
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {application.events.map((event: any) => {
              const countdown = getCountdown(event.scheduledAt);
              const color = EVENT_COLORS[event.type] || "#6b7280";
              return (
                <div key={event.id} style={{
                  background: "#111",
                  border: `1px solid ${event.completed ? "#1a1a1a" : "#222"}`,
                  borderLeft: `3px solid ${event.completed ? "#333" : color}`,
                  borderRadius: "8px",
                  padding: "14px 16px",
                  opacity: event.completed ? 0.5 : 1,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "#fff" }}>
                          {event.type.replace(/_/g, " ")}
                        </span>
                        {!event.completed && (
                          <span style={{
                            fontSize: "10px", padding: "2px 7px", borderRadius: "6px",
                            background: countdown.urgent ? "#422" : "#1a1a1a",
                            color: countdown.urgent ? "#f87171" : "#555",
                            border: `1px solid ${countdown.urgent ? "#633" : "#222"}`,
                          }}>
                            {countdown.text}
                          </span>
                        )}
                        {event.completed && (
                          <span style={{ fontSize: "10px", color: "#22c55e" }}>✓ Done</span>
                        )}
                      </div>
                      <div style={{ fontSize: "12px", color: "#555" }}>
                        {new Date(event.scheduledAt).toLocaleString("en-GB")}
                        {event.durationMins && ` · ${event.durationMins}min`}
                      </div>
                      {event.location && (
                        <a href={event.location} target="_blank" rel="noreferrer"
                          style={{ fontSize: "12px", color: "#3b82f6", display: "block", marginTop: "4px" }}>
                          {event.location}
                        </a>
                      )}
                      {event.notes && (
                        <div style={{ fontSize: "12px", color: "#555", marginTop: "6px" }}>
                          {event.notes}
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "6px", marginLeft: "12px" }}>
                      {!event.completed && (
                        <button
                          onClick={() => handleCompleteEvent(event.id)}
                          style={{ background: "none", border: "1px solid #2a2a2a", borderRadius: "6px", padding: "4px 8px", color: "#22c55e", fontSize: "11px", cursor: "pointer" }}
                        >
                          ✓
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        style={{ background: "none", border: "1px solid #2a2a2a", borderRadius: "6px", padding: "4px 8px", color: "#f87171", fontSize: "11px", cursor: "pointer" }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Follow-ups */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "700", margin: 0, color: "#fff" }}>Follow-ups</h2>
          <button
            onClick={() => setShowAddFollowup(true)}
            style={{
              background: "transparent", border: "1px solid #2a2a2a",
              borderRadius: "7px", padding: "5px 12px",
              color: "#aaa", fontSize: "12px", cursor: "pointer",
            }}
          >
            + Add Follow-up
          </button>
        </div>

        {application.followups.length === 0 ? (
          <div style={{ color: "#444", fontSize: "13px", padding: "20px", textAlign: "center", background: "#111", borderRadius: "8px", border: "1px solid #1a1a1a" }}>
            No follow-ups yet
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {application.followups.map((f: any) => {
              const overdue = !f.done && new Date(f.dueDate) < new Date();
              return (
                <div key={f.id} style={{
                  background: "#111",
                  border: `1px solid ${overdue ? "#3a1a1a" : "#1a1a1a"}`,
                  borderRadius: "8px", padding: "12px 14px",
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  opacity: f.done ? 0.5 : 1,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", color: overdue ? "#f87171" : "#888" }}>
                        Due {new Date(f.dueDate).toLocaleDateString("en-GB")}
                      </span>
                      {f.done && <span style={{ fontSize: "11px", color: "#22c55e" }}>✓ Done</span>}
                      {overdue && <span style={{ fontSize: "11px", color: "#f87171" }}>Overdue</span>}
                    </div>
                    {f.message && (
                      <div style={{ fontSize: "12px", color: "#555", lineHeight: "1.5" }}>{f.message}</div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "6px", marginLeft: "12px" }}>
                    <button
                      onClick={() => toggleFollowup(f.id, !f.done, application.id).then(() => router.refresh())}
                      style={{ background: "none", border: "1px solid #2a2a2a", borderRadius: "6px", padding: "4px 8px", color: f.done ? "#555" : "#22c55e", fontSize: "11px", cursor: "pointer" }}
                    >
                      {f.done ? "↩" : "✓"}
                    </button>
                    <button
                      onClick={() => deleteFollowup(f.id, application.id).then(() => router.refresh())}
                      style={{ background: "none", border: "1px solid #2a2a2a", borderRadius: "6px", padding: "4px 8px", color: "#f87171", fontSize: "11px", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddEvent && (
        <AddEventModal
          applicationId={application.id}
          onClose={() => { setShowAddEvent(false); router.refresh(); }}
        />
      )}

      {showAddFollowup && (
        <AddFollowupModal
          applicationId={application.id}
          onClose={() => { setShowAddFollowup(false); router.refresh(); }}
        />
      )}

      {/* Delete confirm */}
      {showDeleteConfirm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
        }}>
          <div style={{
            background: "#111", border: "1px solid #222",
            borderRadius: "14px", padding: "28px", maxWidth: "360px", width: "100%",
          }}>
            <h3 style={{ color: "#fff", margin: "0 0 8px" }}>Delete application?</h3>
            <p style={{ color: "#666", fontSize: "13px", margin: "0 0 24px" }}>
              This will permanently delete this application and all its events and follow-ups.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{
                flex: 1, padding: "10px", background: "transparent",
                border: "1px solid #2a2a2a", borderRadius: "8px",
                color: "#666", fontSize: "13px", cursor: "pointer",
              }}>
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting} style={{
                flex: 1, padding: "10px", background: "#7f1d1d",
                border: "none", borderRadius: "8px",
                color: "#fff", fontSize: "13px", cursor: "pointer",
              }}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
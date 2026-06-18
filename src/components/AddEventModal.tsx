"use client";

import { useState } from "react";
import { createEvent } from "@/app/actions/applications";

const EVENT_TYPES = [
  "OA", "PHONE_SCREEN", "TECHNICAL", "HR_ROUND", "ONSITE", "OFFER_CALL", "OTHER"
];

type Props = {
  applicationId: string;
  onClose: () => void;
};

export default function AddEventModal({ applicationId, onClose }: Props) {
  const [form, setForm] = useState({
    type: "TECHNICAL",
    scheduledAt: "",
    durationMins: "",
    location: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    if (!form.scheduledAt) {
      setError("Date and time are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await createEvent({
        applicationId,
        type: form.type,
        scheduledAt: form.scheduledAt,
        durationMins: form.durationMins ? parseInt(form.durationMins) : undefined,
        location: form.location,
        notes: form.notes,
      });
      onClose();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block" as const,
    color: "#888",
    fontSize: "12px",
    marginBottom: "5px",
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 50,
    }}>
      <div style={{
        background: "#111",
        border: "1px solid #222",
        borderRadius: "14px",
        padding: "28px",
        width: "100%",
        maxWidth: "420px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: "700", margin: 0 }}>
            Add Event
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "18px" }}>
            ✕
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>Event Type</label>
            <select name="type" value={form.type} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>{t.replace("_", " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Date & Time *</label>
            <input name="scheduledAt" type="datetime-local" value={form.scheduledAt} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Duration (minutes)</label>
            <input name="durationMins" type="number" value={form.durationMins} onChange={handleChange} style={inputStyle} placeholder="e.g. 60" />
          </div>
          <div>
            <label style={labelStyle}>Location / Link</label>
            <input name="location" value={form.location} onChange={handleChange} style={inputStyle} placeholder="https://meet.google.com/..." />
          </div>
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              style={{ ...inputStyle, resize: "none" }}
              placeholder="Preparation notes, topics to cover..."
            />
          </div>
        </div>

        {error && <p style={{ color: "#f87171", fontSize: "12px", marginTop: "12px" }}>{error}</p>}

        <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px", background: "transparent",
            border: "1px solid #2a2a2a", borderRadius: "8px",
            color: "#666", fontSize: "13px", cursor: "pointer",
          }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} style={{
            flex: 1, padding: "10px", background: loading ? "#333" : "#fff",
            border: "none", borderRadius: "8px",
            color: loading ? "#666" : "#000", fontSize: "13px",
            fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? "Adding..." : "Add Event"}
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { createFollowup } from "@/app/actions/applications";

type Props = {
  applicationId: string;
  onClose: () => void;
};

const TEMPLATES = [
  "Hi [Recruiter], just following up on my application for [Role]. Excited about the opportunity!",
  "Hi [Recruiter], I wanted to check in on the status of my interview. Please let me know if you need anything.",
  "Hi [Recruiter], following up after the technical round. Looking forward to hearing back!",
];

export default function AddFollowupModal({ applicationId, onClose }: Props) {
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!dueDate) { setError("Due date is required"); return; }
    setLoading(true);
    setError("");
    try {
      await createFollowup({ applicationId, dueDate, message });
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
        background: "#111", border: "1px solid #222",
        borderRadius: "14px", padding: "28px",
        width: "100%", maxWidth: "440px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: "700", margin: 0 }}>Add Follow-up</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "18px" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>Due Date *</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Message Template</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
              {TEMPLATES.map((t, i) => (
                <button key={i} onClick={() => setMessage(t)} style={{
                  background: message === t ? "#1e3a1e" : "#1a1a1a",
                  border: `1px solid ${message === t ? "#2d5a2d" : "#2a2a2a"}`,
                  borderRadius: "6px", padding: "8px 10px",
                  color: "#888", fontSize: "11px", cursor: "pointer",
                  textAlign: "left",
                }}>
                  {t.slice(0, 60)}...
                </button>
              ))}
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: "none" }}
              placeholder="Write your follow-up message..."
            />
          </div>
        </div>

        {error && <p style={{ color: "#f87171", fontSize: "12px", marginTop: "12px" }}>{error}</p>}

        <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px", background: "transparent",
            border: "1px solid #2a2a2a", borderRadius: "8px",
            color: "#666", fontSize: "13px", cursor: "pointer",
          }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{
            flex: 1, padding: "10px", background: loading ? "#333" : "#fff",
            border: "none", borderRadius: "8px",
            color: loading ? "#666" : "#000", fontSize: "13px",
            fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? "Adding..." : "Add Follow-up"}
          </button>
        </div>
      </div>
    </div>
  );
}
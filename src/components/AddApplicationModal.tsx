"use client";

import { useState } from "react";
import { createApplication } from "@/app/actions/applications";
import { toast } from "sonner";

type Props = {
  onClose: () => void;
};

export default function AddApplicationModal({ onClose }: Props) {
  const [form, setForm] = useState({
    companyName: "",
    role: "",
    jobUrl: "",
    notes: "",
    appliedDate: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    if (!form.companyName || !form.role) {
      setError("Company and role are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await createApplication(form);
      toast.success("Application added");
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
        maxWidth: "440px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: "700", margin: 0 }}>
            Add Application
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "18px" }}>
            ✕
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>Company *</label>
            <input name="companyName" value={form.companyName} onChange={handleChange} style={inputStyle} placeholder="e.g. Google" />
          </div>
          <div>
            <label style={labelStyle}>Role *</label>
            <input name="role" value={form.role} onChange={handleChange} style={inputStyle} placeholder="e.g. Software Engineer Intern" />
          </div>
          <div>
            <label style={labelStyle}>Applied Date</label>
            <input name="appliedDate" type="date" value={form.appliedDate} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Job URL</label>
            <input name="jobUrl" value={form.jobUrl} onChange={handleChange} style={inputStyle} placeholder="https://..." />
          </div>
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              style={{ ...inputStyle, resize: "none" }}
              placeholder="Referral, recruiter name, etc."
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
            {loading ? "Adding..." : "Add Application"}
          </button>
        </div>
      </div>
    </div>
  );
}
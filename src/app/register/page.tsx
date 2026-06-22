"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
    } else {
      router.push("/login");
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0a0a0a",
    }}>
      <div style={{
        background: "#111",
        border: "1px solid #222",
        borderRadius: "12px",
        padding: "40px",
        width: "100%",
        maxWidth: "400px",
      }}>
        <h1 style={{ color: "#fff", marginBottom: "8px", fontSize: "24px" }}>
          Create account
        </h1>
        <p style={{ color: "#666", marginBottom: "32px", fontSize: "14px" }}>
          Start tracking your applications
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>Name</label>
            <input name="name" value={form.name} onChange={handleChange} style={inputStyle} placeholder="Your name" />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} placeholder="you@example.com" />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required style={inputStyle} placeholder="••••••••" />
          </div>

          {error && <p style={{ color: "#f87171", fontSize: "13px", marginBottom: "16px" }}>{error}</p>}

          <button type="submit" disabled={loading} style={{
            width: "100%",
            padding: "11px",
            background: loading ? "#333" : "#fff",
            color: loading ? "#666" : "#000",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p style={{ color: "#555", fontSize: "13px", textAlign: "center", marginTop: "20px" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#fff", textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
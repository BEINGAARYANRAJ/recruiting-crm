"use client";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      window.location.href = "/dashboard";
    }
  }

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
          Welcome back
        </h1>
        <p style={{ color: "#666", marginBottom: "32px", fontSize: "14px" }}>
          Sign in to your recruiting dashboard
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
              placeholder="you@example.com"
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ color: "#aaa", fontSize: "13px", display: "block", marginBottom: "6px" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p style={{ color: "#f87171", fontSize: "13px", marginBottom: "16px" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "11px",
              background: loading ? "#333" : "#fff",
              color: loading ? "#666" : "#000",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p style={{ color: "#555", fontSize: "13px", textAlign: "center", marginTop: "20px" }}>
                Don't have an account?{" "}
        <Link href="/register" style={{ color: "#fff", textDecoration: "none" }}>Create one </Link>
      </p>
      </div>
    </div>
  );
}
"use client";

import { signOut } from "next-auth/react";

export default function UserMenu({ email }: { email: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <span style={{ color: "#555", fontSize: "13px" }}>{email}</span>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        style={{
          background: "transparent",
          border: "1px solid #222",
          borderRadius: "6px",
          padding: "4px 10px",
          color: "#555",
          fontSize: "12px",
          cursor: "pointer",
        }}
      >
        Sign out
      </button>
    </div>
  );
}
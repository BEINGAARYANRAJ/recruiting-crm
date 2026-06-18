import { getAllFollowups } from "@/app/actions/applications";
import Link from "next/link";

export default async function FollowupsPage() {
  const followups = await getAllFollowups();

  const pending = followups.filter((f) => !f.done);
  const overdue = pending.filter((f) => new Date(f.dueDate) < new Date());
  const upcoming = pending.filter((f) => new Date(f.dueDate) >= new Date());
  const done = followups.filter((f) => f.done);

  function FollowupCard({ f }: { f: typeof followups[number] }) {
    const isOverdue = !f.done && new Date(f.dueDate) < new Date();
    return (
      <div style={{
        background: "#111",
        border: `1px solid ${isOverdue ? "#3a1a1a" : "#1a1a1a"}`,
        borderRadius: "10px",
        padding: "16px 18px",
        opacity: f.done ? 0.5 : 1,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <Link href={`/dashboard/applications/${f.applicationId}`} style={{
                fontSize: "14px", fontWeight: "600", color: "#fff", textDecoration: "none",
              }}>
                {f.application.company.name}
              </Link>
              <span style={{ fontSize: "12px", color: "#555" }}>·</span>
              <span style={{ fontSize: "12px", color: "#555" }}>{f.application.role}</span>
            </div>
            <div style={{ fontSize: "12px", color: isOverdue ? "#f87171" : "#666", marginBottom: "6px" }}>
              Due {new Date(f.dueDate).toLocaleDateString("en-GB")}
              {isOverdue && " — Overdue"}
              {f.done && " — ✓ Done"}
            </div>
            {f.message && (
              <div style={{
                fontSize: "12px", color: "#444", lineHeight: "1.5",
                background: "#0d0d0d", borderRadius: "6px", padding: "8px 10px",
              }}>
                {f.message}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 4px" }}>Follow-ups</h1>
      <p style={{ color: "#555", fontSize: "13px", margin: "0 0 28px" }}>
        {pending.length} pending · {overdue.length} overdue
      </p>

      {overdue.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "12px", color: "#f87171", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "10px" }}>
            Overdue
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {overdue.map((f) => <FollowupCard key={f.id} f={f} />)}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "12px", color: "#aaa", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "10px" }}>
            Upcoming
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {upcoming.map((f) => <FollowupCard key={f.id} f={f} />)}
          </div>
        </div>
      )}

      {done.length > 0 && (
        <div>
          <h2 style={{ fontSize: "12px", color: "#333", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "10px" }}>
            Completed
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {done.map((f) => <FollowupCard key={f.id} f={f} />)}
          </div>
        </div>
      )}

      {followups.length === 0 && (
        <div style={{
          color: "#444", fontSize: "13px", padding: "40px",
          textAlign: "center", background: "#111",
          borderRadius: "12px", border: "1px solid #1a1a1a",
        }}>
          No follow-ups yet — add them from any application detail page
        </div>
      )}
    </div>
  );
}
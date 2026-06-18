import { getUpcomingEvents } from "@/app/actions/applications";

const EVENT_COLORS: Record<string, string> = {
  OA: "#f59e0b",
  PHONE_SCREEN: "#8b5cf6",
  TECHNICAL: "#06b6d4",
  HR_ROUND: "#ec4899",
  ONSITE: "#f97316",
  OFFER_CALL: "#22c55e",
  OTHER: "#6b7280",
};

function getDaysUntil(date: string) {
  const diff = new Date(date).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `in ${days} days`;
}

export default async function CalendarPage() {
  const events = await getUpcomingEvents();

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 4px" }}>Upcoming</h1>
      <p style={{ color: "#555", fontSize: "13px", margin: "0 0 28px" }}>
        {events.length} upcoming events
      </p>

      {events.length === 0 ? (
        <div style={{
          color: "#444", fontSize: "13px", padding: "40px",
          textAlign: "center", background: "#111",
          borderRadius: "12px", border: "1px solid #1a1a1a",
        }}>
          No upcoming events — add interviews or OAs from your applications
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {events.map((event) => {
            const color = EVENT_COLORS[event.type] || "#6b7280";
            const daysUntil = getDaysUntil(event.scheduledAt.toString());
            const isUrgent = ["Today", "Tomorrow"].includes(daysUntil);

            return (
              <div key={event.id} style={{
                background: "#111",
                border: "1px solid #1a1a1a",
                borderLeft: `3px solid ${color}`,
                borderRadius: "10px",
                padding: "16px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>
                      {event.application.company.name}
                    </span>
                    <span style={{
                      fontSize: "11px", padding: "2px 8px", borderRadius: "6px",
                      background: isUrgent ? "#422" : "#1a1a1a",
                      color: isUrgent ? "#f87171" : "#555",
                      border: `1px solid ${isUrgent ? "#633" : "#222"}`,
                    }}>
                      {daysUntil}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {event.type.replace(/_/g, " ")} · {event.application.role}
                  </div>
                  <div style={{ fontSize: "12px", color: "#444", marginTop: "2px" }}>
                    {new Date(event.scheduledAt).toLocaleString()}
                    {event.durationMins && ` · ${event.durationMins}min`}
                  </div>
                  {event.location && (
                    <a href={event.location} target="_blank" rel="noreferrer"
                      style={{ fontSize: "12px", color: "#3b82f6", display: "block", marginTop: "4px" }}>
                      Join ↗
                    </a>
                  )}
                </div>
                <div style={{
                  fontSize: "22px", fontWeight: "700", color: color,
                  minWidth: "48px", textAlign: "right",
                }}>
                  {new Date(event.scheduledAt).getDate()}
                  <div style={{ fontSize: "11px", color: "#444", fontWeight: "400" }}>
                    {new Date(event.scheduledAt).toLocaleString("default", { month: "short" })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
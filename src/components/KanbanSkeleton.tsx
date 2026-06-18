export default function KanbanSkeleton() {
  return (
    <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "16px" }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ minWidth: "220px", width: "220px" }}>
          <div style={{
            height: "14px", width: "80px",
            background: "#1a1a1a", borderRadius: "6px", marginBottom: "10px",
            animation: "pulse 1.5s ease-in-out infinite",
          }} />
          <div style={{
            minHeight: "400px", background: "#0d0d0d",
            borderRadius: "10px", border: "1px solid #1a1a1a",
            padding: "8px", display: "flex", flexDirection: "column", gap: "8px",
          }}>
            {i < 2 && Array.from({ length: i + 1 }).map((_, j) => (
              <div key={j} style={{
                background: "#161616", border: "1px solid #222",
                borderRadius: "8px", padding: "12px", height: "80px",
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        </div>
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
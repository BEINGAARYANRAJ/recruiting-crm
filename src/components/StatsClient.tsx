"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, ResponsiveContainer, Cell,
} from "recharts";

type Props = {
  stats: Awaited<ReturnType<typeof import("@/app/actions/applications").getStats>>;
};

const STATUS_COLORS: Record<string, string> = {
  WISHLIST: "#6b7280",
  APPLIED: "#3b82f6",
  OA: "#f59e0b",
  "PHONE SCREEN": "#8b5cf6",
  TECHNICAL: "#06b6d4",
  HR: "#ec4899",
  ONSITE: "#f97316",
  OFFER: "#22c55e",
  REJECTED: "#ef4444",
  WITHDRAWN: "#374151",
};

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{
      background: "#111",
      border: "1px solid #1a1a1a",
      borderRadius: "12px",
      padding: "20px 24px",
      flex: 1,
      minWidth: "140px",
    }}>
      <div style={{ fontSize: "28px", fontWeight: "700", color: color || "#fff", marginBottom: "4px" }}>
        {value}
      </div>
      <div style={{ fontSize: "13px", color: "#555", marginBottom: "2px" }}>{label}</div>
      {sub && <div style={{ fontSize: "11px", color: "#333" }}>{sub}</div>}
    </div>
  );
}

export default function StatsClient({ stats }: Props) {
  const customTooltipStyle = {
    background: "#111",
    border: "1px solid #222",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "12px",
    padding: "8px 12px",
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 4px" }}>Stats</h1>
      <p style={{ color: "#555", fontSize: "13px", margin: "0 0 28px" }}>
        Your recruiting season at a glance
      </p>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "32px" }}>
        <StatCard label="Total Applications" value={stats.total} />
        <StatCard label="Response Rate" value={`${stats.responseRate}%`} sub={`${stats.responded} responded`} color="#3b82f6" />
        <StatCard label="Offers" value={stats.offers} color="#22c55e" />
        <StatCard label="Rejected" value={stats.rejected} color="#ef4444" />
        <StatCard label="Offer Rate" value={`${stats.offerRate}%`} color="#f59e0b" />
      </div>

      {/* Applications by status */}
      <div style={{
        background: "#111", border: "1px solid #1a1a1a",
        borderRadius: "12px", padding: "24px", marginBottom: "20px",
      }}>
        <h2 style={{ fontSize: "14px", fontWeight: "700", margin: "0 0 20px", color: "#fff" }}>
          Applications by Status
        </h2>
        {stats.statusChart.length === 0 ? (
          <div style={{ color: "#444", fontSize: "13px", textAlign: "center", padding: "20px" }}>No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.statusChart} barSize={28}>
              <XAxis
                dataKey="status"
                tick={{ fill: "#555", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#555", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={customTooltipStyle}
                cursor={{ fill: "#1a1a1a" }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {stats.statusChart.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={STATUS_COLORS[entry.status] || "#3b82f6"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Applications over time */}
      <div style={{
        background: "#111", border: "1px solid #1a1a1a",
        borderRadius: "12px", padding: "24px",
      }}>
        <h2 style={{ fontSize: "14px", fontWeight: "700", margin: "0 0 20px", color: "#fff" }}>
          Applications Over Time
        </h2>
        {stats.timeline.length === 0 ? (
          <div style={{ color: "#444", fontSize: "13px", textAlign: "center", padding: "20px" }}>No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.timeline}>
              <XAxis
                dataKey="month"
                tick={{ fill: "#555", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#555", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip contentStyle={customTooltipStyle} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
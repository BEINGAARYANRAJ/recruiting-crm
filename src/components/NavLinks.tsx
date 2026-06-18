"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Board" },
  { href: "/dashboard/calendar", label: "Upcoming" },
  { href: "/dashboard/followups", label: "Follow-ups" },
  { href: "/dashboard/stats", label: "Stats" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            style={{
              color: active ? "#fff" : "#555",
              fontSize: "13px",
              textDecoration: "none",
              fontWeight: active ? "600" : "400",
              borderBottom: active ? "1px solid #fff" : "1px solid transparent",
              paddingBottom: "2px",
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
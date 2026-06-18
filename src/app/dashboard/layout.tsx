import NavLinks from "@/components/NavLinks";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import UserMenu from "@/components/UserMenu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
      {/* Navbar */}
      <nav style={{
        height: "56px",
        borderBottom: "1px solid #1a1a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "#0d0d0d",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <span style={{ fontWeight: "700", fontSize: "15px", letterSpacing: "-0.3px" }}>
            🎯 Recruiting CRM
          </span>
          <NavLinks />
        </div>
        <UserMenu email={session.user.email!} />
      </nav>

      <Toaster position="bottom-right" theme="dark" />

      {/* Page content */}
      <main style={{ padding: "24px" }}>
        {children}
      </main>
    </div>
  );
}
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, CalendarDays, CheckSquare, Megaphone, User, Flame } from "lucide-react";

const navItems = [
  { href: "/portal",         label: "Início",    icon: Home,         exact: true },
  { href: "/portal/agenda",  label: "Agenda",    icon: CalendarDays },
  { href: "/portal/tarefas", label: "Tarefas",   icon: CheckSquare },
  { href: "/portal/avisos",  label: "Avisos",    icon: Megaphone },
  { href: "/portal/perfil",  label: "Perfil",    icon: User },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  function isActive(item: typeof navItems[0]) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", display: "flex", flexDirection: "column" }}>
      {/* Top header */}
      <header style={{
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(16px) saturate(160%)",
        WebkitBackdropFilter: "blur(16px) saturate(160%)",
        borderBottom: "1px solid rgba(229,231,235,0.7)",
        position: "sticky", top: 0, zIndex: 40,
        boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg,#f97316,#ea580c)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 3px 8px rgba(249,115,22,0.3)",
            }}>
              <Flame size={18} color="#fff" />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#111827", lineHeight: 1.1 }}>Seja Livre</p>
              <p style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 500 }}>Portal do Membro</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg,#f97316,#ea580c)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
            }}>
              CA
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main style={{ flex: 1, maxWidth: 680, width: "100%", margin: "0 auto", padding: "20px 20px 90px" }}>
        {children}
      </main>

      {/* Bottom navigation */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderTop: "1px solid rgba(255,255,255,0.9)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", padding: "6px 0 max(6px, env(safe-area-inset-bottom))" }}>
          {navItems.map(item => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} style={{ flex: 1, display: "block", textDecoration: "none" }}>
                <motion.div whileTap={{ scale: 0.92 }} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                  padding: "6px 0", cursor: "pointer",
                }}>
                  <div style={{
                    width: 40, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                    background: active ? "linear-gradient(135deg,#f97316,#ea580c)" : "transparent",
                    transition: "all 0.2s ease",
                    boxShadow: active ? "0 2px 8px rgba(249,115,22,0.3)" : "none",
                  }}>
                    <Icon size={19} color={active ? "#fff" : "#9ca3af"} strokeWidth={active ? 2.5 : 2} />
                  </div>
                  <span style={{
                    fontSize: 10.5, fontWeight: active ? 700 : 500,
                    color: active ? "#f97316" : "#9ca3af",
                    transition: "color 0.2s",
                  }}>{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

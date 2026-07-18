"use client";

import { Bell, Search, Menu } from "lucide-react";

interface TopbarProps { title: string; subtitle?: string; setMobileMenuOpen?: (open: boolean) => void; }

export function Topbar({ title, subtitle, setMobileMenuOpen }: TopbarProps) {
  return (
    <header
      className="topbar-glass"
      style={{
        height: 64, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 24px", flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {setMobileMenuOpen && (
          <button 
            className="md:hidden flex items-center justify-center" 
            onClick={() => setMobileMenuOpen(true)}
            style={{ width: 36, height: 36, borderRadius: 10, background: "#f9fafb", border: "1px solid #e5e7eb" }}
          >
            <Menu size={18} color="#4b5563" />
          </button>
        )}
        <div>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: "#111827", lineHeight: 1.25 }}>{title}</h1>
          {subtitle && <p className="hidden sm:block" style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>{subtitle}</p>}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Search */}
        <div className="hidden md:flex relative items-center">
          <Search size={14} style={{ position: "absolute", left: 10, color: "#9ca3af", pointerEvents: "none" }} />
          <input
            className="sl-input"
            style={{ paddingLeft: 32, width: 220, height: 36, fontSize: 13 }}
            placeholder="Buscar..."
          />
        </div>

        {/* Notifications */}
        <button style={{
          width: 36, height: 36, borderRadius: 10, border: "1px solid #f3f4f6",
          background: "#f9fafb", display: "flex", alignItems: "center", justifyItems: "center",
          cursor: "pointer", position: "relative", transition: "all 0.18s",
        }}>
          <Bell size={16} color="#6b7280" className="m-auto" />
          <span style={{
            position: "absolute", top: 7, right: 7, width: 7, height: 7,
            borderRadius: "50%", background: "#f97316", border: "1.5px solid #f9fafb",
          }} />
        </button>

        {/* User chip */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "6px 10px",
          borderRadius: 11, border: "1px solid #f3f4f6", background: "#f9fafb", cursor: "pointer",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: "linear-gradient(135deg,#f97316,#ea580c)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "#fff",
          }}>
            A
          </div>
          <div className="hidden sm:block">
            <p style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", lineHeight: 1.2 }}>Admin</p>
            <p style={{ fontSize: 10.5, color: "#9ca3af" }}>Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}

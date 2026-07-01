"use client";

import { useState } from "react";
import { Megaphone } from "lucide-react";

const categoriaConfig: Record<string, { color: string; bg: string }> = {
  Urgente:   { color: "#b91c1c", bg: "#fef2f2" },
  Geral:     { color: "#1d4ed8", bg: "#eff6ff" },
  Liderança: { color: "#c2410c", bg: "#fff7ed" },
  Célula:    { color: "#6d28d9", bg: "#f5f3ff" },
};

export default function PortalAvisosPage() {
  const [filter, setFilter] = useState("Todos");
  const cats = ["Todos", ...Object.keys(categoriaConfig)];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>Avisos</h1>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: "6px 14px", borderRadius: 100, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            border: "1px solid", transition: "all 0.18s",
            background: filter === c ? "#f97316" : "#fff",
            borderColor: filter === c ? "#f97316" : "#e5e7eb",
            color: filter === c ? "#fff" : "#6b7280",
          }}>{c}</button>
        ))}
      </div>

      {/* Empty */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "52px 24px", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: 18, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <Megaphone size={26} color="#d1d5db" />
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Nenhum aviso publicado</p>
        <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6 }}>
          Os comunicados da liderança aparecerão aqui assim que forem publicados.
        </p>
      </div>
    </div>
  );
}

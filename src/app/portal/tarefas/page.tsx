"use client";

import { CheckSquare } from "lucide-react";

export default function PortalTarefasPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>Minhas Tarefas</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>Tarefas da sua área de atuação</p>
      </div>

      {/* Progress placeholder */}
      <div style={{ background: "#fff", borderRadius: 18, padding: "18px", border: "1px solid #f3f4f6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: "#374151" }}>Progresso da Área</p>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#d1d5db" }}>—</span>
        </div>
        <div style={{ height: 8, background: "#f3f4f6", borderRadius: 100 }} />
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          {[
            { label: "A Fazer",      color: "#9ca3af" },
            { label: "Em Andamento", color: "#f97316" },
            { label: "Concluída",    color: "#16a34a" },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, textAlign: "center" }}>
              <p style={{ fontSize: 18, fontWeight: 800, color: s.color }}>0</p>
              <p style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 1 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Empty */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "48px 24px", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: 18, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <CheckSquare size={26} color="#d1d5db" />
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Nenhuma tarefa atribuída</p>
        <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6 }}>
          Quando a liderança atribuir tarefas à sua área, elas aparecerão aqui para você acompanhar.
        </p>
      </div>
    </div>
  );
}

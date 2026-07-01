"use client";
import { Flame } from "lucide-react";
export default function ConfiguracoesPage() {
  const fields = [
    { label: "Nome da Igreja",    value: "Seja Livre" },
    { label: "Endereço",          value: "Rua Airi, 227, 18° andar — Tatuapé, SP" },
    { label: "Culto Principal",   value: "Domingo às 10h" },
    { label: "Instagram",         value: "@sejalivre.sp" },
    { label: "Email de Contato",  value: "contato@sejalivre.com.br" },
  ];
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Configurações</h2>
      <div className="sl-card">
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#f97316,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(249,115,22,0.3)" }}>
            <Flame size={26} color="#fff"/>
          </div>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#111827" }}>Igreja Seja Livre</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>Ministério de Libertação e Restauração</p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {fields.map(f => (
            <div key={f.label}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{f.label}</label>
              <input className="sl-input" defaultValue={f.value}/>
            </div>
          ))}
          <button className="sl-btn-primary" style={{ marginTop: 6, width: "fit-content" }}>Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
}

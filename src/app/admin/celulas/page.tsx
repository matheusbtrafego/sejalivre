"use client";
import { Users2, Plus } from "lucide-react";
import { useState } from "react";

export default function CelulasPage() {
  const [celulas] = useState<{ nome:string; lider:string; dia:string; membros:number; local:string; cor:string }[]>([]);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Células & Grupos</h2>
          <p style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 2 }}>{celulas.length} grupos cadastrados</p>
        </div>
        <button className="sl-btn-primary"><Plus size={15}/> Nova Célula</button>
      </div>

      <div className="sl-card" style={{ padding: "64px 24px", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: 18, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <Users2 size={26} color="#d1d5db" />
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Nenhuma célula cadastrada</p>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>
          Crie grupos de célula para organizar e acompanhar seus membros.
        </p>
        <button className="sl-btn-primary"><Plus size={14}/> Criar primeira célula</button>
      </div>
    </div>
  );
}

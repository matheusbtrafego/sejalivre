"use client";
import { TrendingUp, TrendingDown, DollarSign, Plus } from "lucide-react";

export default function FinanceiroPage() {
  const fmt = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Financeiro</h2>
        <button className="sl-btn-primary"><Plus size={15}/> Lançamento</button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <div className="sl-card">
          <TrendingUp size={18} color="#16a34a" style={{ marginBottom: 10 }}/>
          <p style={{ fontSize: 26, fontWeight: 800, color: "#d1d5db" }}>R$ {fmt(0)}</p>
          <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>Entradas do mês</p>
        </div>
        <div className="sl-card">
          <TrendingDown size={18} color="#dc2626" style={{ marginBottom: 10 }}/>
          <p style={{ fontSize: 26, fontWeight: 800, color: "#d1d5db" }}>R$ {fmt(0)}</p>
          <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>Saídas do mês</p>
        </div>
        <div className="sl-card">
          <DollarSign size={18} color="#9ca3af" style={{ marginBottom: 10 }}/>
          <p style={{ fontSize: 26, fontWeight: 800, color: "#d1d5db" }}>R$ {fmt(0)}</p>
          <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>Saldo do mês</p>
        </div>
      </div>

      {/* Empty state */}
      <div className="sl-card" style={{ padding: "56px 24px", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: 18, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <DollarSign size={26} color="#d1d5db" />
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Nenhum lançamento registrado</p>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>
          Registre entradas (dízimos, ofertas, doações) e saídas para acompanhar o caixa da igreja.
        </p>
        <button className="sl-btn-primary"><Plus size={14}/> Primeiro lançamento</button>
      </div>
    </div>
  );
}

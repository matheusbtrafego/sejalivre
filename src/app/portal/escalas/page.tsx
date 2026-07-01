"use client";

import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Clock, X, Info } from "lucide-react";
import { useState } from "react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, delay, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] } },
});

export default function PortalEscalasPage() {
  const [escalas, setEscalas] = useState([
    { id: "1", data: "2023-11-12", hora: "19:00", culto: "Culto de Celebração", ministerio: "Louvor", funcao: "Vocal", status: "Confirmado" },
    { id: "2", data: "2023-11-19", hora: "19:00", culto: "Culto de Celebração", ministerio: "Louvor", funcao: "Vocal", status: "Pendente" },
  ]);

  function handleAction(id: string, action: "Confirmar" | "Trocar") {
    if (action === "Confirmar") {
      setEscalas(prev => prev.map(e => e.id === id ? { ...e, status: "Confirmado" } : e));
    } else {
      setEscalas(prev => prev.map(e => e.id === id ? { ...e, status: "Troca Solicitada" } : e));
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>Minha Escala</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>Suas próximas escalas de voluntariado</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {escalas.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 20, padding: "48px 24px", border: "1px solid #f3f4f6", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <CalendarDays size={26} color="#d1d5db" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Nenhuma escala futura</p>
            <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6 }}>Você não está escalado para os próximos cultos.</p>
          </div>
        ) : (
          escalas.map((e, i) => (
            <motion.div key={e.id} {...fade(i * 0.1)} style={{
              background: "#fff", borderRadius: 16, padding: "20px",
              border: "1px solid #f3f4f6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: "#eff6ff", color: "#1d4ed8" }}>
                  {e.ministerio} · {e.funcao}
                </span>
                {e.status === "Confirmado" && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#16a34a" }}><CheckCircle2 size={13}/> Confirmado</span>}
                {e.status === "Pendente" && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#f97316" }}><Clock size={13}/> Aguardando</span>}
                {e.status === "Troca Solicitada" && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#dc2626" }}><Info size={13}/> Troca solicitada</span>}
              </div>
              
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 6 }}>{e.culto}</h3>
              <p style={{ fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                <CalendarDays size={14} color="#9ca3af" />
                {new Date(e.data+"T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })} às {e.hora}
              </p>

              {e.status === "Pendente" && (
                <div style={{ display: "flex", gap: 10, paddingTop: 16, borderTop: "1px solid #f9fafb" }}>
                  <button onClick={() => handleAction(e.id, "Trocar")} style={{
                    flex: 1, padding: "10px", borderRadius: 12, fontSize: 13, fontWeight: 600,
                    background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", cursor: "pointer",
                  }}>Solicitar Troca</button>
                  <button onClick={() => handleAction(e.id, "Confirmar")} style={{
                    flex: 1, padding: "10px", borderRadius: 12, fontSize: 13, fontWeight: 600,
                    background: "#f97316", color: "#fff", border: "none", cursor: "pointer",
                  }}>Confirmar Presença</button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

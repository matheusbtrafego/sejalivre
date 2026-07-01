"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, X, Clock, UserCheck, Inbox } from "lucide-react";
import { mockAprovacoes } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const avatarColors = ["#f97316","#3b82f6","#8b5cf6","#10b981","#ec4899"];
function avatarColor(name: string) { return avatarColors[name.charCodeAt(0) % avatarColors.length]; }
function getInitials(name: string) { return name.split(" ").slice(0,2).map(n=>n[0]).join("").toUpperCase(); }

export default function AprovacoesPage() {
  const [aprovacoes, setAprovacoes] = useState(mockAprovacoes);
  const pendentes   = aprovacoes.filter(a => a.status === "Pendente");
  const processadas = aprovacoes.filter(a => a.status !== "Pendente");

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Aprovações de Acesso</h2>
        <p style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 2 }}>
          {pendentes.length > 0 ? `${pendentes.length} solicitações aguardando revisão` : "Tudo em dia"}
        </p>
      </div>

      {pendentes.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f97316", display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Pendentes ({pendentes.length})
            </span>
          </div>
          {pendentes.map((ap, i) => (
            <motion.div key={ap.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="sl-card" style={{ borderLeft: "3px solid #f97316" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: avatarColor(ap.nome), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {getInitials(ap.nome)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{ap.nome}</h4>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: "#fff7ed", color: "#c2410c", display: "flex", alignItems: "center", gap: 3 }}>
                      <Clock size={10} /> Pendente
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "#6b7280" }}>{ap.email} · {ap.telefone}</p>
                  <p style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2 }}>Solicitado em {formatDate(ap.solicitadoEm)}</p>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setAprovacoes(prev => prev.map(a => a.id === ap.id ? { ...a, status: "Rejeitado" } : a))}
                    style={{ width: 40, height: 40, borderRadius: 11, border: "none", background: "#fef2f2", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <X size={18} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setAprovacoes(prev => prev.map(a => a.id === ap.id ? { ...a, status: "Aprovado" } : a))}
                    style={{ width: 40, height: 40, borderRadius: 11, border: "none", background: "#f0fdf4", color: "#16a34a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckCircle size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="sl-card" style={{ textAlign: "center", padding: "64px 24px" }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <UserCheck size={28} color="#16a34a" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Tudo em dia!</p>
          <p style={{ fontSize: 13.5, color: "#9ca3af" }}>
            {processadas.length > 0
              ? "Não há solicitações pendentes no momento."
              : "Ainda não há solicitações de acesso. Quando membros solicitarem acesso ao portal, aparecerão aqui."}
          </p>
        </div>
      )}

      {/* Histórico */}
      {processadas.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Histórico</span>
          {processadas.map(ap => (
            <div key={ap.id} className="sl-card" style={{ opacity: 0.65 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: avatarColor(ap.nome), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                  {getInitials(ap.nome)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{ap.nome}</h4>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: ap.status === "Aprovado" ? "#f0fdf4" : "#fef2f2", color: ap.status === "Aprovado" ? "#16a34a" : "#dc2626", display: "flex", alignItems: "center", gap: 3 }}>
                      {ap.status === "Aprovado" ? <CheckCircle size={10} /> : <X size={10} />} {ap.status}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{ap.email} · {formatDate(ap.solicitadoEm)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty history hint */}
      {aprovacoes.length === 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderRadius: 12, background: "#f9fafb", border: "1px solid #f3f4f6" }}>
          <Inbox size={16} color="#9ca3af" />
          <p style={{ fontSize: 13, color: "#9ca3af" }}>O histórico de aprovações ficará registrado aqui.</p>
        </div>
      )}
    </div>
  );
}

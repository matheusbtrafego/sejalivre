"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users2, CalendarDays, CheckCircle2, X, Clock, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Mock para Escalas
const mockEscalas = [
  { id: "1", data: "2023-11-12", culto: "Culto de Celebração", ministerio: "Louvor", funcao: "Vocal", voluntario: "Carlos Santos", status: "Confirmado" },
  { id: "2", data: "2023-11-12", culto: "Culto de Celebração", ministerio: "Mídia", funcao: "Projeção", voluntario: "Ana Lima", status: "Pendente" },
  { id: "3", data: "2023-11-12", culto: "Culto de Celebração", ministerio: "Recepção", funcao: "Porta Principal", voluntario: "João Pedro", status: "Confirmado" },
];

const ministerios = ["Todos", "Louvor", "Mídia", "Recepção", "Infantil", "Intercessão"];

export default function EscalasPage() {
  const [filterMin, setFilterMin] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [escalas, setEscalas] = useState(mockEscalas);
  
  const filtered = escalas.filter(e => filterMin === "Todos" || e.ministerio === filterMin);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Escalas de Voluntários</h2>
          <p style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 2 }}>Organize as equipes para os próximos cultos e eventos.</p>
        </div>
        <button className="sl-btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Nova Escala
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {ministerios.map(m => (
          <button key={m} onClick={() => setFilterMin(m)} style={{
            padding: "7px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
            border: "1px solid", transition: "all 0.18s",
            background: filterMin === m ? "#f97316" : "#fff",
            borderColor: filterMin === m ? "#f97316" : "#e5e7eb",
            color: filterMin === m ? "#fff" : "#6b7280",
          }}>{m}</button>
        ))}
      </div>

      {/* Tabela de Escalas */}
      <div className="sl-card" style={{ padding: 0, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "64px 24px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Users2 size={26} color="#d1d5db" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Nenhuma escala encontrada</p>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Não há voluntários escalados para este ministério.</p>
            <button className="sl-btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={14} /> Criar primeira escala
            </button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                  {["Data / Culto","Ministério / Função","Voluntário","Status","Ações"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                    <td style={{ padding: "14px 20px" }}>
                      <p style={{ fontSize: 13.5, fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: 6 }}>
                        <CalendarDays size={14} color="#9ca3af"/> {new Date(e.data+"T12:00:00").toLocaleDateString("pt-BR", {day:"2-digit",month:"short"})}
                      </p>
                      <p style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>{e.culto}</p>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: "#eff6ff", color: "#1d4ed8", display: "inline-block", marginBottom: 4 }}>
                        {e.ministerio}
                      </span>
                      <p style={{ fontSize: 13, color: "#4b5563" }}>{e.funcao}</p>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <p style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{e.voluntario}</p>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      {e.status === "Confirmado" ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#16a34a" }}>
                          <CheckCircle2 size={14} /> Confirmado
                        </span>
                      ) : (
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#f97316" }}>
                          <Clock size={14} /> Pendente
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <button style={{ fontSize: 12, fontWeight: 600, color: "#dc2626", background: "none", border: "none", cursor: "pointer" }}>Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Nova Escala */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="sl-modal-backdrop" onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="sl-card" style={{ width: "100%", maxWidth: 440, padding: 28 }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Escalar Voluntário</h3>
                <button onClick={() => setShowModal(false)} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={14} color="#6b7280" />
                </button>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Culto/Evento</label>
                  <select className="sl-input">
                    <option>Culto de Celebração (Domingo, 19:00)</option>
                    <option>Culto de Ensino (Quarta, 20:00)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Ministério</label>
                  <select className="sl-input">
                    {ministerios.filter(m=>m!=="Todos").map(m=><option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Função</label>
                  <input className="sl-input" placeholder="Ex: Projeção, Vocal, Bateria..." />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Voluntário</label>
                  <input className="sl-input" placeholder="Buscar membro..." />
                </div>
                
                <div style={{ display: "flex", gap: 10, paddingTop: 6 }}>
                  <button className="sl-btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
                  <button className="sl-btn-primary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Salvar Escala</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, Phone, Mail, Users, X } from "lucide-react";
import { mockPessoas } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const statusOptions = ["Todos", "Visitante", "Frequentador", "Membro", "Líder"];
const areaOptions   = ["—", "Louvor", "Mídia", "Recepção", "Infantil", "Intercessão", "Limpeza"];

const statusStyle: Record<string, { bg: string; color: string }> = {
  Visitante:    { bg: "#f9fafb", color: "#4b5563" },
  Frequentador: { bg: "#eff6ff", color: "#1d4ed8" },
  Membro:       { bg: "#f0fdf4", color: "#15803d" },
  Líder:        { bg: "#fff7ed", color: "#c2410c" },
};

const avatarColors = ["#f97316","#3b82f6","#8b5cf6","#10b981","#ec4899","#f59e0b"];
function avatarColor(name: string) { return avatarColors[name.charCodeAt(0) % avatarColors.length]; }
function getInitials(name: string) { return name.split(" ").slice(0,2).map(n => n[0]).join("").toUpperCase(); }

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const rowItem  = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.28 } } };

export default function PessoasPage() {
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [pessoas, setPessoas]     = useState(mockPessoas);
  const [form, setForm]           = useState({ nome:"", email:"", telefone:"", status:"Visitante", area:"—", celula:"—", aniversario:"", dataConversao:"", dataVisita:"", responsavelFollowUp:"" });

  const filtered = pessoas.filter(p => {
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts: Record<string, number> = { Todos: pessoas.length };
  statusOptions.slice(1).forEach(s => { counts[s] = pessoas.filter(p => p.status === s).length; });

  function handleAdd() {
    if (!form.nome) return;
    setPessoas(prev => [...prev, { ...form, id: String(Date.now()), foto: null, createdAt: new Date().toISOString() }]);
    setShowModal(false);
    setForm({ nome:"", email:"", telefone:"", status:"Visitante", area:"—", celula:"—", aniversario:"", dataConversao:"", dataVisita:"", responsavelFollowUp:"" });
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Pessoas</h2>
          <p style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 2 }}>{pessoas.length} {pessoas.length === 1 ? "pessoa cadastrada" : "pessoas cadastradas"}</p>
        </div>
        <button className="sl-btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Nova Pessoa
        </button>
      </div>

      {/* Status tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {statusOptions.map(s => (
          <button key={s} onClick={() => setStatus(s)} style={{
            padding: "7px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
            border: "1px solid", transition: "all 0.18s",
            background: statusFilter === s ? "#f97316" : "#fff",
            color: statusFilter === s ? "#fff" : "#6b7280",
            borderColor: statusFilter === s ? "#f97316" : "#e5e7eb",
            boxShadow: statusFilter === s ? "0 3px 10px rgba(249,115,22,0.25)" : "none",
          }}>
            {s} <span style={{ opacity: 0.65, fontSize: 11 }}>{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="sl-card" style={{ padding: "14px 18px" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
            <input className="sl-input" style={{ paddingLeft: 34 }} placeholder="Buscar por nome ou email..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="sl-btn-secondary"><Filter size={14} /> Filtros</button>
        </div>
      </div>

      {/* Table or Empty */}
      <div className="sl-card" style={{ padding: 0, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "64px 24px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Users size={26} color="#d1d5db" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
              {search ? "Nenhuma pessoa encontrada" : "Nenhuma pessoa cadastrada"}
            </p>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>
              {search ? "Tente buscar por outro nome ou email." : "Comece cadastrando membros, frequentadores e visitantes."}
            </p>
            {!search && (
              <button className="sl-btn-primary" onClick={() => setShowModal(true)}>
                <Plus size={14} /> Cadastrar primeira pessoa
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                  {["Pessoa","Contato","Status","Área","Célula","Cadastro"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <motion.tbody variants={stagger} initial="hidden" animate="show">
                {filtered.map(p => {
                  const sc = statusStyle[p.status] ?? statusStyle.Visitante;
                  return (
                    <motion.tr key={p.id} variants={rowItem}
                      style={{ borderBottom: "1px solid #f9fafb", cursor: "pointer", transition: "background 0.15s" }}
                      onMouseOver={e => (e.currentTarget.style.background = "#fffbf7")}
                      onMouseOut={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: avatarColor(p.nome), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                            {getInitials(p.nome)}
                          </div>
                          <div>
                            <p style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{p.nome}</p>
                            <p style={{ fontSize: 11, color: "#9ca3af" }}>ID #{p.id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        {p.email && <p style={{ fontSize: 12.5, color: "#4b5563", display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}><Mail size={11} color="#9ca3af" />{p.email}</p>}
                        {p.telefone && <p style={{ fontSize: 12.5, color: "#4b5563", display: "flex", alignItems: "center", gap: 5 }}><Phone size={11} color="#9ca3af" />{p.telefone}</p>}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ fontSize: 11.5, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: sc.bg, color: sc.color }}>{p.status}</span>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#4b5563" }}>{p.area}</td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#4b5563" }}>{p.celula}</td>
                      <td style={{ padding: "14px 20px", fontSize: 12, color: "#9ca3af" }}>{formatDate(p.createdAt)}</td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="sl-modal-backdrop" onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="sl-card" style={{ width: "100%", maxWidth: 440, maxHeight: "90vh", overflowY: "auto", padding: 28 }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Nova Pessoa</h3>
                <button onClick={() => setShowModal(false)} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={14} color="#6b7280" />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[{l:"Nome completo *",key:"nome",type:"text",ph:"Ex: João da Silva"},{l:"Email",key:"email",type:"email",ph:"joao@email.com"},{l:"Telefone / WhatsApp",key:"telefone",type:"text",ph:"(11) 99999-9999"}].map(f => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{f.l}</label>
                    <input className="sl-input" type={f.type} placeholder={f.ph} value={form[f.key as keyof typeof form]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Status</label>
                    <select className="sl-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                      {["Visitante","Frequentador","Membro","Líder"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Nascimento</label>
                    <input className="sl-input" type="date" value={form.aniversario} onChange={e => setForm(f => ({ ...f, aniversario: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Área</label>
                    <select className="sl-input" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))}>
                      {areaOptions.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Conversão / Batismo</label>
                    <input className="sl-input" type="date" value={form.dataConversao} onChange={e => setForm(f => ({ ...f, dataConversao: e.target.value }))} />
                  </div>
                </div>
                {form.status === "Visitante" && (
                  <div style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 12, padding: 14, marginTop: 4 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#4b5563", marginBottom: 10 }}>Funil de Visitantes</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 4 }}>Data da Visita</label>
                        <input className="sl-input" type="date" style={{ fontSize: 13 }} value={form.dataVisita} onChange={e => setForm(f => ({ ...f, dataVisita: e.target.value }))} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 4 }}>Resp. Follow-up</label>
                        <input className="sl-input" type="text" placeholder="Nome do líder" style={{ fontSize: 13 }} value={form.responsavelFollowUp} onChange={e => setForm(f => ({ ...f, responsavelFollowUp: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: 10, paddingTop: 6 }}>
                  <button className="sl-btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
                  <button className="sl-btn-primary" style={{ flex: 1 }} onClick={handleAdd}>Salvar</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, AlertCircle, Info, Users2, Flame, Megaphone } from "lucide-react";
import { mockAvisos } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const categoriaConfig: Record<string, { icon: typeof Megaphone; color: string; bg: string }> = {
  Urgente:   { icon: AlertCircle, color: "#b91c1c", bg: "#fef2f2" },
  Geral:     { icon: Info,        color: "#1d4ed8", bg: "#eff6ff" },
  Liderança: { icon: Flame,       color: "#c2410c", bg: "#fff7ed" },
  Célula:    { icon: Users2,      color: "#6d28d9", bg: "#f5f3ff" },
};

export default function AvisosPage() {
  const [avisos, setAvisos]   = useState(mockAvisos);
  const [showModal, setModal] = useState(false);
  const [filterCat, setFilter]= useState("Todos");
  const [form, setForm]       = useState({ titulo: "", conteudo: "", categoria: "Geral" });

  const cats     = ["Todos", ...Object.keys(categoriaConfig)];
  const filtered = avisos.filter(a => filterCat === "Todos" || a.categoria === filterCat);

  function handleAdd() {
    if (!form.titulo || !form.conteudo) return;
    setAvisos(prev => [{
      id: String(Date.now()), ...form,
      publicadoEm: new Date().toISOString().split("T")[0],
      autor: "Admin", ativo: true,
    }, ...prev]);
    setModal(false);
    setForm({ titulo: "", conteudo: "", categoria: "Geral" });
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Avisos & Comunicados</h2>
          <p style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 2 }}>{avisos.filter(a => a.ativo).length} avisos ativos</p>
        </div>
        <button className="sl-btn-primary" onClick={() => setModal(true)}>
          <Plus size={15} /> Novo Aviso
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: "7px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
            border: "1px solid", transition: "all 0.18s",
            background: filterCat === c ? "#f97316" : "#fff",
            borderColor: filterCat === c ? "#f97316" : "#e5e7eb",
            color: filterCat === c ? "#fff" : "#6b7280",
            boxShadow: filterCat === c ? "0 3px 10px rgba(249,115,22,0.25)" : "none",
          }}>{c}</button>
        ))}
      </div>

      {/* List or Empty */}
      {filtered.length === 0 ? (
        <div className="sl-card" style={{ padding: "64px 24px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Megaphone size={26} color="#d1d5db" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Nenhum aviso publicado</p>
          <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>
            {filterCat !== "Todos" ? `Nenhum aviso na categoria "${filterCat}".` : "Publique o primeiro comunicado para a igreja."}
          </p>
          {filterCat === "Todos" && (
            <button className="sl-btn-primary" onClick={() => setModal(true)}>
              <Plus size={14} /> Criar primeiro aviso
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((aviso, i) => {
            const cat    = categoriaConfig[aviso.categoria] ?? categoriaConfig.Geral;
            const CatIcon = cat.icon;
            return (
              <motion.div key={aviso.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="sl-card" style={{ opacity: aviso.ativo ? 1 : 0.5, borderLeft: `3px solid ${cat.color}` }}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <CatIcon size={18} color={cat.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: cat.bg, color: cat.color }}>{aviso.categoria}</span>
                      {!aviso.ativo && <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: "#f3f4f6", color: "#6b7280" }}>Inativo</span>}
                      <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{formatDate(aviso.publicadoEm)} · {aviso.autor}</span>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{aviso.titulo}</h3>
                    <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.55 }}>{aviso.conteudo}</p>
                  </div>
                  <button onClick={() => setAvisos(prev => prev.map(a => a.id === aviso.id ? { ...a, ativo: !a.ativo } : a))}
                    style={{ fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 9, border: "1px solid #e5e7eb", background: "#f9fafb", color: "#6b7280", cursor: "pointer", flexShrink: 0 }}>
                    {aviso.ativo ? "Desativar" : "Ativar"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="sl-modal-backdrop" onClick={() => setModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="sl-card" style={{ width: "100%", maxWidth: 480, padding: 28 }} onClick={e => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 22 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Novo Aviso</h3>
                <button onClick={() => setModal(false)} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={14} color="#6b7280" />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Título *</label>
                  <input className="sl-input" placeholder="Título do comunicado" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Mensagem *</label>
                  <textarea className="sl-input" rows={4} style={{ resize: "none" }} placeholder="Escreva o comunicado..." value={form.conteudo} onChange={e => setForm(f => ({ ...f, conteudo: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Categoria</label>
                  <select className="sl-input" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
                    <option>Geral</option><option>Urgente</option><option>Liderança</option><option>Célula</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: 10, paddingTop: 6 }}>
                  <button className="sl-btn-secondary" style={{ flex: 1 }} onClick={() => setModal(false)}>Cancelar</button>
                  <button className="sl-btn-primary" style={{ flex: 1 }} onClick={handleAdd}>Publicar</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

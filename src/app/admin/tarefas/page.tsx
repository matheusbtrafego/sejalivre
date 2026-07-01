"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle2, Circle, Clock, Users, X, FolderOpen } from "lucide-react";
import { mockAreas } from "@/lib/mock-data";

type TarefaStatus = "A Fazer" | "Em Andamento" | "Concluída";
type Prioridade   = "Alta" | "Média" | "Baixa";

const statusCols: TarefaStatus[] = ["A Fazer", "Em Andamento", "Concluída"];

const statusConfig: Record<TarefaStatus, { color: string; bg: string; border: string; icon: typeof Circle }> = {
  "A Fazer":      { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", icon: Circle },
  "Em Andamento": { color: "#f97316", bg: "#fff7ed", border: "#fed7aa", icon: Clock },
  "Concluída":    { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: CheckCircle2 },
};

const prioridadeStyle: Record<Prioridade, { bg: string; color: string }> = {
  Alta:  { bg: "#fef2f2", color: "#b91c1c" },
  Média: { bg: "#fff7ed", color: "#c2410c" },
  Baixa: { bg: "#f9fafb", color: "#6b7280" },
};

// Áreas pré-definidas da igreja (sem tarefas ainda)
const AREAS_PADRAO = [
  { id: "1", nome: "Louvor",      cor: "#f97316", icone: "Music",    responsavel: "", membros: [], tarefas: [] },
  { id: "2", nome: "Mídia",       cor: "#3b82f6", icone: "Monitor",  responsavel: "", membros: [], tarefas: [] },
  { id: "3", nome: "Recepção",    cor: "#8b5cf6", icone: "Heart",    responsavel: "", membros: [], tarefas: [] },
  { id: "4", nome: "Intercessão", cor: "#ec4899", icone: "Heart",    responsavel: "", membros: [], tarefas: [] },
  { id: "5", nome: "Infantil",    cor: "#10b981", icone: "Baby",     responsavel: "", membros: [], tarefas: [] },
  { id: "6", nome: "Limpeza",     cor: "#6b7280", icone: "Sparkles", responsavel: "", membros: [], tarefas: [] },
];

export default function TarefasPage() {
  const [areas, setAreas]             = useState([...mockAreas, ...AREAS_PADRAO.filter(p => !mockAreas.find(a => a.nome === p.nome))]);
  const [selectedArea, setSelected]   = useState(areas[0]?.id ?? null);
  const [viewMode, setViewMode]       = useState<"kanban" | "lista">("kanban");
  const [showNewTarefa, setShowNew]   = useState(false);
  const [draggedTaskId, setDragged]   = useState<string | null>(null);
  const [newTarefa, setNewTarefa]     = useState({ titulo: "", descricao: "", prazo: "", prioridade: "Média" as Prioridade, responsavel: "" });

  const area = areas.find(a => a.id === selectedArea);
  if (!area) return null;

  const tasksByStatus = (s: TarefaStatus) => area.tarefas.filter(t => t.status === s);
  const concluidas    = area.tarefas.filter(t => t.status === "Concluída").length;
  const pct           = area.tarefas.length > 0 ? Math.round((concluidas / area.tarefas.length) * 100) : 0;

  function moveTask(taskId: string, newStatus: TarefaStatus) {
    setAreas(prev => prev.map(a => a.id === selectedArea
      ? { ...a, tarefas: a.tarefas.map(t => t.id === taskId ? { ...t, status: newStatus } : t) }
      : a));
  }

  function addTarefa() {
    if (!newTarefa.titulo) return;
    setAreas(prev => prev.map(a => a.id === selectedArea
      ? { ...a, tarefas: [...a.tarefas, { id: `t${Date.now()}`, ...newTarefa, status: "A Fazer", responsavel: newTarefa.responsavel || area.responsavel || "—" }] }
      : a));
    setShowNew(false);
    setNewTarefa({ titulo: "", descricao: "", prazo: "", prioridade: "Média", responsavel: "" });
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Tarefas & Áreas</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ display: "flex", borderRadius: 10, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            {(["kanban","lista"] as const).map(v => (
              <button key={v} onClick={() => setViewMode(v)} style={{
                padding: "7px 14px", fontSize: 12.5, fontWeight: 600, border: "none", cursor: "pointer",
                background: viewMode === v ? "#f97316" : "#fff", color: viewMode === v ? "#fff" : "#6b7280",
              }}>{v === "kanban" ? "Kanban" : "Lista"}</button>
            ))}
          </div>
          <button className="sl-btn-primary" onClick={() => setShowNew(true)}>
            <Plus size={15} /> Nova Tarefa
          </button>
        </div>
      </div>

      {/* Area selector */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {areas.map(a => {
          const done = a.tarefas.filter(t => t.status === "Concluída").length;
          const isSelected = a.id === selectedArea;
          return (
            <button key={a.id} onClick={() => setSelected(a.id)} style={{
              padding: "8px 16px", borderRadius: 11, fontSize: 13, fontWeight: 600, cursor: "pointer",
              border: "1px solid", transition: "all 0.18s",
              background: isSelected ? a.cor : "#fff",
              borderColor: isSelected ? a.cor : "#e5e7eb",
              color: isSelected ? "#fff" : "#374151",
              boxShadow: isSelected ? `0 4px 12px ${a.cor}35` : "none",
            }}>
              {a.nome}
              {a.tarefas.length > 0 && (
                <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.75 }}>{done}/{a.tarefas.length}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Area header */}
      <div className="sl-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: area.cor + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={22} color={area.cor} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{area.nome}</h3>
              <p style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 2 }}>
                {area.responsavel ? `Responsável: ${area.responsavel}` : "Sem responsável definido"} · {area.membros.length} membro(s)
              </p>
            </div>
          </div>
          {area.tarefas.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>{pct}%</p>
                <p style={{ fontSize: 11, color: "#9ca3af" }}>concluído</p>
              </div>
              <div style={{ width: 120 }}>
                <div style={{ height: 6, background: "#f3f4f6", borderRadius: 100, overflow: "hidden" }}>
                  <motion.div style={{ height: "100%", background: area.cor, borderRadius: 100 }}
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
                </div>
                <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{concluidas} de {area.tarefas.length} tarefas</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Kanban */}
      {viewMode === "kanban" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {statusCols.map(status => {
            const cfg   = statusConfig[status];
            const SIcon = cfg.icon;
            const tasks = tasksByStatus(status);
            return (
              <div key={status} style={{ borderRadius: 16, padding: 14, minHeight: 280, background: cfg.bg, border: `1px solid ${cfg.border}` }}
                onDragOver={e => e.preventDefault()}
                onDrop={() => { if (draggedTaskId) moveTask(draggedTaskId, status); }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <SIcon size={15} color={cfg.color} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{status}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: cfg.color + "20", color: cfg.color }}>
                    {tasks.length}
                  </span>
                </div>

                {tasks.length === 0 ? (
                  <div style={{ padding: "24px 0", textAlign: "center" }}>
                    <p style={{ fontSize: 12, color: "#d1d5db" }}>
                      {status === "A Fazer" ? "Nenhuma tarefa aqui" : "Arraste tarefas aqui"}
                    </p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {tasks.map(t => (
                      <motion.div key={t.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        draggable onDragStart={() => setDragged(t.id)} onDragEnd={() => setDragged(null)}
                        style={{ background: "#fff", borderRadius: 12, padding: "14px", marginBottom: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", cursor: "grab" }}
                      >
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: "#111827", marginBottom: t.descricao ? 4 : 10 }}>{t.titulo}</p>
                        {t.descricao && <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10, lineHeight: 1.5 }}>{t.descricao}</p>}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100, ...prioridadeStyle[t.prioridade as Prioridade] }}>
                            {t.prioridade}
                          </span>
                          {t.prazo && (
                            <span style={{ fontSize: 11, color: "#9ca3af", display: "flex", alignItems: "center", gap: 3 }}>
                              <Clock size={11} /> {new Date(t.prazo + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                            </span>
                          )}
                        </div>
                        {t.responsavel && (
                          <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #f3f4f6" }}>
                            <p style={{ fontSize: 11.5, color: "#9ca3af" }}>{t.responsavel.split(" ")[0]}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* List view */}
      {viewMode === "lista" && (
        <div className="sl-card" style={{ padding: 0, overflow: "hidden" }}>
          {area.tarefas.length === 0 ? (
            <div style={{ padding: "56px 24px", textAlign: "center" }}>
              <FolderOpen size={36} color="#e5e7eb" style={{ margin: "0 auto 12px" }} />
              <p style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Nenhuma tarefa nesta área</p>
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 18 }}>Crie a primeira tarefa para a área de {area.nome}.</p>
              <button className="sl-btn-primary" onClick={() => setShowNew(true)}><Plus size={14}/> Nova Tarefa</button>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                  {["Tarefa","Status","Prioridade","Prazo","Responsável"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "13px 20px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {area.tarefas.map(t => {
                  const sc   = statusConfig[t.status as TarefaStatus];
                  const SIcon = sc.icon;
                  return (
                    <tr key={t.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                      <td style={{ padding: "13px 20px" }}>
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{t.titulo}</p>
                        {t.descricao && <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{t.descricao}</p>}
                      </td>
                      <td style={{ padding: "13px 20px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, color: sc.color }}>
                          <SIcon size={13} /> {t.status}
                        </span>
                      </td>
                      <td style={{ padding: "13px 20px" }}>
                        <span style={{ fontSize: 11.5, fontWeight: 600, padding: "3px 9px", borderRadius: 100, ...prioridadeStyle[t.prioridade as Prioridade] }}>{t.prioridade}</span>
                      </td>
                      <td style={{ padding: "13px 20px", fontSize: 12.5, color: "#6b7280" }}>
                        {t.prazo ? new Date(t.prazo + "T12:00:00").toLocaleDateString("pt-BR") : "—"}
                      </td>
                      <td style={{ padding: "13px 20px", fontSize: 12.5, color: "#6b7280" }}>{t.responsavel || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showNewTarefa && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="sl-modal-backdrop" onClick={() => setShowNew(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="sl-card" style={{ width: "100%", maxWidth: 440, padding: 28 }} onClick={e => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Nova Tarefa — {area.nome}</h3>
                <button onClick={() => setShowNew(false)} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={14} color="#6b7280" />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Título *</label>
                  <input className="sl-input" placeholder="O que precisa ser feito?" value={newTarefa.titulo} onChange={e => setNewTarefa(f => ({ ...f, titulo: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Descrição</label>
                  <textarea className="sl-input" rows={3} style={{ resize: "none" }} placeholder="Detalhes da tarefa..." value={newTarefa.descricao} onChange={e => setNewTarefa(f => ({ ...f, descricao: e.target.value }))} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Prioridade</label>
                    <select className="sl-input" value={newTarefa.prioridade} onChange={e => setNewTarefa(f => ({ ...f, prioridade: e.target.value as Prioridade }))}>
                      <option>Alta</option><option>Média</option><option>Baixa</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Prazo</label>
                    <input className="sl-input" type="date" value={newTarefa.prazo} onChange={e => setNewTarefa(f => ({ ...f, prazo: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Responsável</label>
                  <input className="sl-input" placeholder="Nome do responsável" value={newTarefa.responsavel} onChange={e => setNewTarefa(f => ({ ...f, responsavel: e.target.value }))} />
                </div>
                <div style={{ display: "flex", gap: 10, paddingTop: 6 }}>
                  <button className="sl-btn-secondary" style={{ flex: 1 }} onClick={() => setShowNew(false)}>Cancelar</button>
                  <button className="sl-btn-primary" style={{ flex: 1 }} onClick={addTarefa}>Criar Tarefa</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Alias para o modal
const showNewTarefa = false;

"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, Phone, Mail, Users, X, LayoutGrid, List, Upload, MoreHorizontal } from "lucide-react";
import { formatDate } from "@/lib/utils";
import * as XLSX from "xlsx";

const statusOptions = ["Visitante", "Frequentador", "Membro", "Líder"];
const areaOptions   = ["—", "Louvor", "Mídia", "Recepção", "Infantil", "Intercessão", "Limpeza"];

const statusStyle: Record<string, { bg: string; color: string; border: string }> = {
  Visitante:    { bg: "#f9fafb", color: "#4b5563", border: "#e5e7eb" },
  Frequentador: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  Membro:       { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  Líder:        { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
};

const avatarColors = ["#f97316","#3b82f6","#8b5cf6","#10b981","#ec4899","#f59e0b"];
function avatarColor(name: string) { return avatarColors[name.charCodeAt(0) % avatarColors.length] || "#f97316"; }
function getInitials(name: string) { return name ? name.split(" ").slice(0,2).map(n => n[0]).join("").toUpperCase() : "?"; }

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const rowItem  = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.28 } } };

export default function PessoasPage() {
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("Todos");
  const [viewMode, setViewMode]   = useState<"list" | "kanban">("list");
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [pessoas, setPessoas]     = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  
  const [form, setForm]           = useState({ nome:"", email:"", telefone:"", status:"Visitante", area:"—", celula:"—", aniversario:"", dataConversao:"", dataVisita:"", responsavelFollowUp:"" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPessoas = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('sl_membros').select('*').order('created_at', { ascending: false });
    if (data) setPessoas(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPessoas();
  }, []);

  const filtered = pessoas.filter(p => {
    const pNome = p.nome || "";
    const pEmail = p.email || "";
    const matchSearch = pNome.toLowerCase().includes(search.toLowerCase()) || pEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts: Record<string, number> = { Todos: pessoas.length };
  statusOptions.forEach(s => { counts[s] = pessoas.filter(p => p.status === s).length; });

  async function handleAdd() {
    if (!form.nome) return;
    
    const novaPessoa = {
      nome: form.nome,
      email: form.email || null,
      telefone: form.telefone || null,
      status: form.status,
      area_atuacao: form.area !== "—" ? form.area : null,
      data_nascimento: form.aniversario || null,
      data_conversao: form.dataConversao || null,
      data_visita: form.status === "Visitante" ? (form.dataVisita || null) : null,
      resp_follow_up: form.status === "Visitante" ? (form.responsavelFollowUp || null) : null
    };

    const { data, error } = await supabase.from('sl_membros').insert([novaPessoa]).select();
    
    if (data && data.length > 0) {
      setPessoas(prev => [data[0], ...prev]);
    }
    
    setShowModal(false);
    setForm({ nome:"", email:"", telefone:"", status:"Visitante", area:"—", celula:"—", aniversario:"", dataConversao:"", dataVisita:"", responsavelFollowUp:"" });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json<any>(ws);

      const recordsToInsert = data.map(row => ({
        nome: row['Nome'] || row['nome'] || 'Sem Nome',
        email: row['Email'] || row['email'] || null,
        telefone: String(row['Telefone'] || row['telefone'] || row['WhatsApp'] || ''),
        status: row['Status'] || row['status'] || 'Visitante',
        area_atuacao: row['Área'] || row['area'] || row['Area'] || null,
      }));

      if (recordsToInsert.length > 0) {
        const { error } = await supabase.from('sl_membros').insert(recordsToInsert);
        if (!error) {
          alert(`Sucesso! ${recordsToInsert.length} pessoas importadas.`);
          fetchPessoas();
        } else {
          alert('Erro ao importar. Verifique o console.');
          console.error(error);
        }
      }
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24, paddingBottom: 60 }}>

      {/* Header Premium */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", padding: "24px 32px", borderRadius: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(249,115,22,0.3)" }}>
            <Users size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>Pessoas (CRM)</h2>
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{pessoas.length} {pessoas.length === 1 ? "pessoa cadastrada" : "pessoas cadastradas"}</p>
          </div>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* View Toggle */}
          <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 12, padding: 4, marginRight: 8 }}>
            <button onClick={() => setViewMode("list")} style={{ padding: "6px 12px", borderRadius: 8, display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, transition: "0.2s", background: viewMode === "list" ? "#fff" : "transparent", color: viewMode === "list" ? "#111827" : "#6b7280", boxShadow: viewMode === "list" ? "0 2px 8px rgba(0,0,0,0.05)" : "none", border: "none", cursor: "pointer" }}>
              <List size={14} /> Lista
            </button>
            <button onClick={() => setViewMode("kanban")} style={{ padding: "6px 12px", borderRadius: 8, display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, transition: "0.2s", background: viewMode === "kanban" ? "#fff" : "transparent", color: viewMode === "kanban" ? "#111827" : "#6b7280", boxShadow: viewMode === "kanban" ? "0 2px 8px rgba(0,0,0,0.05)" : "none", border: "none", cursor: "pointer" }}>
              <LayoutGrid size={14} /> Kanban
            </button>
          </div>
          
          <input type="file" accept=".xlsx, .xls, .csv" ref={fileInputRef} onChange={handleFileUpload} style={{ display: "none" }} />
          <button className="sl-btn-secondary" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? "Importando..." : <><Upload size={15} /> Importar</>}
          </button>
          
          <button className="sl-btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={15} /> Nova Pessoa
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
          <input className="sl-input" style={{ paddingLeft: 38, borderRadius: 14, border: "1px solid #e5e7eb", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }} placeholder="Buscar por nome ou email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {["Todos", ...statusOptions].map(s => (
            <button key={s} onClick={() => setStatus(s)} style={{
              padding: "7px 16px", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer",
              border: "1px solid", transition: "all 0.2s", whiteSpace: "nowrap",
              background: statusFilter === s ? "#f97316" : "#fff",
              color: statusFilter === s ? "#fff" : "#4b5563",
              borderColor: statusFilter === s ? "#f97316" : "#e5e7eb",
              boxShadow: statusFilter === s ? "0 4px 12px rgba(249,115,22,0.2)" : "0 2px 6px rgba(0,0,0,0.02)",
            }}>
              {s} <span style={{ opacity: 0.65, fontSize: 11, marginLeft: 4 }}>{counts[s]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>Carregando pessoas...</div>
      ) : filtered.length === 0 ? (
        <div className="sl-card" style={{ padding: "80px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Users size={28} color="#d1d5db" />
          </div>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
            {search ? "Nenhuma pessoa encontrada" : "Nenhuma pessoa cadastrada"}
          </p>
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24, maxWidth: 300 }}>
            {search ? "Tente buscar por outro termo ou limpe os filtros." : "Comece adicionando membros manualmente ou importe uma planilha."}
          </p>
          {!search && (
            <div style={{ display: "flex", gap: 12 }}>
              <button className="sl-btn-secondary" onClick={() => fileInputRef.current?.click()}><Upload size={14} /> Importar Lista</button>
              <button className="sl-btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> Cadastrar Manual</button>
            </div>
          )}
        </div>
      ) : viewMode === "list" ? (
        /* VISÃO LISTA (TABELA) */
        <div className="sl-card" style={{ padding: 0, overflow: "hidden", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  {["Pessoa","Contato","Status","Área","Cadastro",""].map((h, i) => (
                    <th key={i} style={{ textAlign: "left", padding: "16px 24px", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <motion.tbody variants={stagger} initial="hidden" animate="show">
                {filtered.map(p => {
                  const sc = statusStyle[p.status] ?? statusStyle.Visitante;
                  return (
                    <motion.tr key={p.id} variants={rowItem}
                      style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.2s" }}
                      onMouseOver={e => (e.currentTarget.style.background = "#fffbf7")}
                      onMouseOut={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: avatarColor(p.nome), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                            {getInitials(p.nome)}
                          </div>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{p.nome}</p>
                            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>ID #{p.id?.slice(-6) || "----"}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        {p.telefone ? <p style={{ fontSize: 13, color: "#4b5563", display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}><Phone size={12} color="#9ca3af" />{p.telefone}</p> : null}
                        {p.email ? <p style={{ fontSize: 12.5, color: "#6b7280", display: "flex", alignItems: "center", gap: 6 }}><Mail size={12} color="#d1d5db" />{p.email}</p> : null}
                        {!p.telefone && !p.email && <span style={{ fontSize: 12, color: "#d1d5db" }}>—</span>}
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ fontSize: 11.5, fontWeight: 600, padding: "4px 12px", borderRadius: 100, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>{p.status}</span>
                      </td>
                      <td style={{ padding: "16px 24px", fontSize: 13, color: "#4b5563", fontWeight: 500 }}>{p.area_atuacao || "—"}</td>
                      <td style={{ padding: "16px 24px", fontSize: 12, color: "#9ca3af" }}>{formatDate(p.created_at)}</td>
                      <td style={{ padding: "16px 24px", textAlign: "right" }}>
                        <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9ca3af", padding: 6, borderRadius: 6 }} onMouseOver={e => e.currentTarget.style.background="#f3f4f6"} onMouseOut={e => e.currentTarget.style.background="transparent"}>
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VISÃO KANBAN (CRM FUNIL) */
        <div style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 16, alignItems: "flex-start" }}>
          {statusOptions.map((status) => {
            const columnPessoas = filtered.filter(p => p.status === status);
            const sc = statusStyle[status];
            return (
              <div key={status} style={{ width: 320, minWidth: 320, background: "#f8fafc", borderRadius: 16, border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 240px)" }}>
                {/* Column Header */}
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: sc.color }} />
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>{status}</h3>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: 12 }}>{columnPessoas.length}</span>
                </div>
                
                {/* Column Cards */}
                <div style={{ padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                  {columnPessoas.length === 0 ? (
                    <div style={{ padding: "24px 0", textAlign: "center", color: "#94a3b8", fontSize: 12, fontWeight: 500, border: "2px dashed #e2e8f0", borderRadius: 12 }}>
                      Nenhuma pessoa
                    </div>
                  ) : (
                    <AnimatePresence>
                      {columnPessoas.map(p => (
                        <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid #f1f5f9", cursor: "grab" }}>
                          
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: avatarColor(p.nome), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                              {getInitials(p.nome)}
                            </div>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>{p.nome}</p>
                              <p style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Cadastrado(a) em {formatDate(p.created_at)}</p>
                            </div>
                          </div>
                          
                          {(p.telefone || p.area_atuacao) && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingTop: 10, borderTop: "1px solid #f1f5f9" }}>
                              {p.telefone && <span style={{ fontSize: 10.5, color: "#475569", background: "#f8fafc", padding: "3px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}><Phone size={10} />{p.telefone}</span>}
                              {p.area_atuacao && <span style={{ fontSize: 10.5, color: "#f97316", background: "#fff7ed", padding: "3px 8px", borderRadius: 6 }}>{p.area_atuacao}</span>}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Nova Pessoa */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="sl-modal-backdrop" onClick={() => setShowModal(false)} style={{ zIndex: 999 }}>
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
                    <input className="sl-input" type={f.type} placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Status</label>
                    <select className="sl-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                      {statusOptions.map(s => <option key={s}>{s}</option>)}
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

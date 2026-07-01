"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, X } from "lucide-react";
import { mockEventos } from "@/lib/mock-data";

const DAYS_PT   = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const MONTHS_PT = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

interface Evento { id:string; titulo:string; data:string; hora:string; tipo:string; local:string; vagas:number|null; inscritos:number; cor:string; }

export default function CalendarioPage() {
  const today = new Date();
  const [current, setCurrent]     = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setDay]     = useState<number|null>(null);
  const [selectedEv, setEv]       = useState<Evento|null>(null);
  const [showNewEv, setShowNewEv] = useState(false);

  const year  = current.getFullYear();
  const month = current.getMonth();
  const daysInMonth  = new Date(year, month+1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  function navigate(dir: number) { setCurrent(new Date(year, month+dir, 1)); setDay(null); }

  function getEvDay(day: number) {
    const ds = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    return mockEventos.filter(e => e.data === ds);
  }

  const cells: (number|null)[] = [];
  for (let i=0; i<firstDayOfWeek; i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(d);
  while (cells.length < 42) cells.push(null);

  const selectedDayEv = selectedDay ? getEvDay(selectedDay) : [];

  const eventTypeColors = [
    { tipo:"Culto",       cor:"#f97316" },
    { tipo:"Célula",      cor:"#3b82f6" },
    { tipo:"Retiro",      cor:"#10b981" },
    { tipo:"Reunião",     cor:"#8b5cf6" },
    { tipo:"Conferência", cor:"#ec4899" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate(-1)} style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.18s" }}>
            <ChevronLeft size={16} color="#6b7280" />
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", minWidth: 200, textAlign: "center" }}>
            {MONTHS_PT[month]} {year}
          </h2>
          <button onClick={() => navigate(1)} style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.18s" }}>
            <ChevronRight size={16} color="#6b7280" />
          </button>
          <button onClick={() => { setCurrent(new Date(today.getFullYear(), today.getMonth(), 1)); setDay(null); }}
            style={{ padding: "6px 12px", borderRadius: 9, border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: 12.5, fontWeight: 600, color: "#6b7280", cursor: "pointer" }}>
            Hoje
          </button>
        </div>
        <button className="sl-btn-primary" onClick={() => setShowNewEv(true)}>
          <Plus size={15} /> Novo Evento
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 16, alignItems: "start" }}>
        {/* Calendar grid */}
        <div className="sl-card" style={{ padding: 0, overflow: "hidden" }}>
          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderBottom: "1px solid #f3f4f6" }}>
            {DAYS_PT.map(d => (
              <div key={d} style={{ textAlign: "center", padding: "11px 0", fontSize: 11.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em" }}>{d}</div>
            ))}
          </div>
          {/* Cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gridAutoRows: 96 }}>
            {cells.map((day, idx) => {
              const evs = day ? getEvDay(day) : [];
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const isSelected = day === selectedDay;
              return (
                <div key={idx} onClick={() => day && setDay(day === selectedDay ? null : day)}
                  style={{
                    borderBottom: "1px solid #f9fafb", borderRight: "1px solid #f9fafb",
                    padding: "6px 6px 4px", cursor: day ? "pointer" : "default",
                    background: isSelected ? "#fff7ed" : day ? "#fff" : "#fafafa",
                    transition: "background 0.15s",
                  }}>
                  {day && (
                    <>
                      <div style={{
                        width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: isToday ? 700 : 500, marginBottom: 4,
                        background: isToday ? "#f97316" : "transparent",
                        color: isToday ? "#fff" : isSelected ? "#ea580c" : "#374151",
                      }}>{day}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {evs.slice(0,2).map(ev => (
                          <div key={ev.id} onClick={e => { e.stopPropagation(); setEv(ev); }}
                            style={{ fontSize: 10.5, fontWeight: 600, padding: "1px 5px", borderRadius: 5, background: ev.cor + "20", color: ev.cor, cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {ev.titulo}
                          </div>
                        ))}
                        {evs.length > 2 && <span style={{ fontSize: 10, color: "#9ca3af", paddingLeft: 5 }}>+{evs.length-2}</span>}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Side panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Legend */}
          <div className="sl-card" style={{ padding: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Tipos de Evento</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {eventTypeColors.map(t => (
                <div key={t.tipo} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.cor, flexShrink: 0 }} />
                  <span style={{ fontSize: 12.5, color: "#4b5563" }}>{t.tipo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected day events */}
          <AnimatePresence>
            {selectedDay && (
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:10 }}
                className="sl-card" style={{ padding: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 10 }}>
                  {selectedDay} de {MONTHS_PT[month]}
                </p>
                {selectedDayEv.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {selectedDayEv.map(ev => (
                      <div key={ev.id} onClick={() => setEv(ev)} style={{
                        padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                        background: ev.cor + "12", border: `1px solid ${ev.cor}25`,
                      }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: ev.cor, marginBottom: 2 }}>{ev.titulo}</p>
                        <p style={{ fontSize: 11.5, color: "#6b7280", display: "flex", alignItems: "center", gap: 3 }}><Clock size={10} /> {ev.hora}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", padding: "12px 0" }}>Sem eventos neste dia</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upcoming events */}
          {!selectedDay && (
            <div className="sl-card" style={{ padding: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Próximos</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {mockEventos.slice(0,5).map(ev => (
                  <div key={ev.id} onClick={() => setEv(ev)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: ev.cor, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12.5, fontWeight: 600, color: "#1f2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ev.titulo}</p>
                      <p style={{ fontSize: 11, color: "#9ca3af" }}>
                        {new Date(ev.data+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"short"})}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event detail modal */}
      <AnimatePresence>
        {selectedEv && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="sl-modal-backdrop" onClick={() => setEv(null)}>
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              className="sl-card" style={{width:"100%",maxWidth:380,padding:24}} onClick={e=>e.stopPropagation()}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                <span style={{fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:100,background:selectedEv.cor+"18",color:selectedEv.cor}}>{selectedEv.tipo}</span>
                <button onClick={()=>setEv(null)} style={{width:28,height:28,borderRadius:7,border:"1px solid #e5e7eb",background:"#f9fafb",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <X size={13} color="#6b7280"/>
                </button>
              </div>
              <h3 style={{fontSize:17,fontWeight:800,color:"#111827",marginBottom:14}}>{selectedEv.titulo}</h3>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <p style={{fontSize:13.5,color:"#4b5563",display:"flex",alignItems:"center",gap:8}}>
                  <Clock size={14} color="#9ca3af"/>
                  {new Date(selectedEv.data+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long"})} · {selectedEv.hora}
                </p>
                <p style={{fontSize:13.5,color:"#4b5563",display:"flex",alignItems:"center",gap:8}}>
                  <MapPin size={14} color="#9ca3af"/>{selectedEv.local}
                </p>
                {selectedEv.vagas && (
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <Users size={14} color="#9ca3af"/>
                    <span style={{fontSize:13.5,color:"#4b5563"}}>{selectedEv.inscritos}/{selectedEv.vagas} inscritos</span>
                    <div style={{flex:1,height:5,background:"#f3f4f6",borderRadius:100,overflow:"hidden"}}>
                      <div style={{height:"100%",background:selectedEv.cor,width:`${(selectedEv.inscritos/selectedEv.vagas)*100}%`,borderRadius:100}} />
                    </div>
                  </div>
                )}
              </div>
              <div style={{display:"flex",gap:8,marginTop:20}}>
                <button className="sl-btn-secondary" style={{flex:1}}>Editar</button>
                {selectedEv.vagas && <button className="sl-btn-primary" style={{flex:1}}>Ver Inscritos</button>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New event modal */}
      <AnimatePresence>
        {showNewEv && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="sl-modal-backdrop" onClick={()=>setShowNewEv(false)}>
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              className="sl-card" style={{width:"100%",maxWidth:440,padding:28}} onClick={e=>e.stopPropagation()}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:22}}>
                <h3 style={{fontSize:16,fontWeight:700,color:"#111827"}}>Novo Evento</h3>
                <button onClick={()=>setShowNewEv(false)} style={{width:30,height:30,borderRadius:8,border:"1px solid #e5e7eb",background:"#f9fafb",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <X size={14} color="#6b7280"/>
                </button>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>Título *</label>
                  <input className="sl-input" placeholder="Ex: Culto Dominical"/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div>
                    <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>Data</label>
                    <input className="sl-input" type="date"/>
                  </div>
                  <div>
                    <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>Horário</label>
                    <input className="sl-input" type="time"/>
                  </div>
                </div>
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>Tipo</label>
                  <select className="sl-input">
                    <option>Culto</option><option>Célula</option><option>Retiro</option><option>Reunião</option><option>Conferência</option>
                  </select>
                </div>
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>Local</label>
                  <input className="sl-input" placeholder="Ex: Rua Airi, 227 - Tatuapé"/>
                </div>
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>Vagas (opcional)</label>
                  <input className="sl-input" type="number" placeholder="Sem limite"/>
                </div>
                <div style={{display:"flex",gap:10,paddingTop:6}}>
                  <button className="sl-btn-secondary" style={{flex:1}} onClick={()=>setShowNewEv(false)}>Cancelar</button>
                  <button className="sl-btn-primary" style={{flex:1}} onClick={()=>setShowNewEv(false)}>Criar Evento</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays, X } from "lucide-react";

const DAYS_PT   = ["D","S","T","Q","Q","S","S"];
const MONTHS_PT = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

export default function PortalAgendaPage() {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setDay] = useState<number|null>(today.getDate());

  const year  = current.getFullYear();
  const month = current.getMonth();
  const daysInMonth    = new Date(year, month+1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  function navigate(dir: number) { setCurrent(new Date(year, month+dir, 1)); setDay(null); }

  const cells: (number|null)[] = [];
  for (let i=0; i<firstDayOfWeek; i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(d);
  while (cells.length%7 !== 0) cells.push(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>Agenda</h1>

      {/* Month navigator */}
      <div style={{ background: "#fff", borderRadius: 20, padding: 18, border: "1px solid #f3f4f6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <button onClick={() => navigate(-1)} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={15} color="#6b7280" />
          </button>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{MONTHS_PT[month]} {year}</p>
          <button onClick={() => navigate(1)} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronRight size={15} color="#6b7280" />
          </button>
        </div>

        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 6 }}>
          {DAYS_PT.map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#9ca3af", paddingBottom: 8 }}>{d}</div>
          ))}
        </div>

        {/* Cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
          {cells.map((day, idx) => {
            const isToday    = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSelected = day === selectedDay;
            return (
              <div key={idx} onClick={() => day && setDay(day === selectedDay ? null : day)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "4px 2px", cursor: day ? "pointer" : "default", borderRadius: 10,
                  background: isSelected ? "#f97316" : isToday ? "#fff7ed" : "transparent",
                  transition: "background 0.18s",
                }}>
                {day && (
                  <span style={{
                    fontSize: 13.5, fontWeight: isToday || isSelected ? 700 : 400,
                    color: isSelected ? "#fff" : isToday ? "#f97316" : "#374151",
                    width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{day}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected day */}
      <AnimatePresence mode="wait">
        {selectedDay && (
          <motion.div key={selectedDay} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>
              {selectedDay} de {MONTHS_PT[month]}
            </p>
            <div style={{ background: "#fff", borderRadius: 16, padding: "20px", border: "1px solid #f3f4f6", textAlign: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                <CalendarDays size={20} color="#d1d5db" />
              </div>
              <p style={{ fontSize: 13, color: "#9ca3af" }}>Nenhum evento neste dia</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upcoming */}
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>Próximos Eventos</p>
        <div style={{ background: "#fff", borderRadius: 16, padding: "32px 20px", border: "1px solid #f3f4f6", textAlign: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <CalendarDays size={26} color="#d1d5db" />
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Nenhum evento cadastrado</p>
          <p style={{ fontSize: 13, color: "#9ca3af" }}>Os eventos serão exibidos aqui quando forem criados pela liderança.</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Users, CheckSquare, CalendarDays, UserCheck, ArrowUpRight, Flame, Clock, TrendingUp, Cake, Plus } from "lucide-react";
import { mockKPIs, mockEventos, mockAvisos, mockPessoas } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, delay, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
});

const kpiCards = [
  { label: "Total de Membros",     value: mockKPIs.totalMembros,        sub: "Cadastrados no sistema",      icon: Users,       color: "#f97316", bg: "#fff7ed" },
  { label: "Tarefas Pendentes",    value: mockKPIs.tarefasPendentes,    sub: "Em todas as áreas",           icon: CheckSquare, color: "#3b82f6", bg: "#eff6ff" },
  { label: "Eventos este mês",     value: mockEventos.length,           sub: "Cultos, células e retiros",   icon: CalendarDays,color: "#8b5cf6", bg: "#f5f3ff" },
  { label: "Aprovações Pendentes", value: mockKPIs.aprovacoesPendentes, sub: "Aguardando revisão",          icon: UserCheck,   color: "#ec4899", bg: "#fdf2f8" },
];

function EmptyCard({ icon: Icon, message, action, href }: { icon: typeof Users; message: string; action: string; href: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", gap: 10 }}>
      <div style={{ width: 44, height: 44, borderRadius: 14, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={22} color="#d1d5db" />
      </div>
      <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center" }}>{message}</p>
      <Link href={href} style={{ textDecoration: "none" }}>
        <button className="sl-btn-primary" style={{ fontSize: 12, padding: "7px 14px" }}>
          <Plus size={13} /> {action}
        </button>
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Welcome banner */}
      <motion.div {...fade(0)} style={{
        borderRadius: 20, overflow: "hidden", position: "relative",
        background: "linear-gradient(135deg,#f97316 0%,#ea580c 55%,#c2410c 100%)",
        padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 90% 50%, rgba(255,255,255,0.12) 0%, transparent 60%)" }} />
        <div style={{ position: "relative" }}>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12.5, fontWeight: 500, marginBottom: 4 }}>Bem-vindo ao sistema</p>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, lineHeight: 1.2 }}>Igreja Seja Livre 🔥</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>Ministério de Libertação e Restauração · Tatuapé, SP</p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "12px 18px",
          backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", position: "relative",
        }}>
          <Flame size={28} color="#fff" />
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Seja Livre</p>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Sistema de Gestão</p>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} {...fade(0.06 * i)} className="sl-card" style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={19} color={card.color} />
                </div>
                <ArrowUpRight size={15} color="#d1d5db" />
              </div>
              <p style={{ fontSize: 30, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{card.value}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginTop: 4 }}>{card.label}</p>
              <p style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 3 }}>{card.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>

        {/* Próximos Eventos */}
        <motion.div {...fade(0.2)} className="sl-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 6 }}>
              <CalendarDays size={15} color="#f97316" /> Próximos Eventos
            </h3>
            <Link href="/admin/calendario" style={{ fontSize: 12, fontWeight: 600, color: "#f97316", textDecoration: "none" }}>Ver todos →</Link>
          </div>
          {mockEventos.length === 0 ? (
            <EmptyCard icon={CalendarDays} message="Nenhum evento cadastrado ainda." action="Criar evento" href="/admin/calendario" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {mockEventos.slice(0, 4).map(ev => (
                <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 12px", borderRadius: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: ev.cor, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                      {new Date(ev.data + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit" })}
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.8)", lineHeight: 1, marginTop: 1 }}>
                      {new Date(ev.data + "T12:00:00").toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase()}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{ev.titulo}</p>
                    <p style={{ fontSize: 11.5, color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={11} /> {ev.hora} · {ev.local.split(" - ")[0]}
                    </p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 100, background: ev.cor + "18", color: ev.cor }}>{ev.tipo}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Alertas de Escala */}
          <motion.div {...fade(0.22)} className="sl-card" style={{ padding: 20, border: "1px solid #fecaca", background: "#fff" }}>
            <h3 style={{ fontSize: 13.5, fontWeight: 700, color: "#dc2626", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={14} color="#dc2626" /> Escalas Pendentes
            </h3>
            <p style={{ fontSize: 12.5, color: "#4b5563", lineHeight: 1.5 }}>
              Todos os voluntários confirmaram presença para os próximos cultos.
            </p>
          </motion.div>

          {/* Aniversariantes */}
          <motion.div {...fade(0.25)} className="sl-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
              <Cake size={14} color="#f97316" /> Aniversariantes
            </h3>
            <p style={{ fontSize: 12.5, color: "#9ca3af", textAlign: "center", padding: "12px 0" }}>
              Nenhum aniversariante esta semana
            </p>
          </motion.div>

          {/* Avisos Recentes */}
          <motion.div {...fade(0.3)} className="sl-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
              <TrendingUp size={14} color="#f97316" /> Avisos Recentes
            </h3>
            {mockAvisos.length === 0 ? (
              <p style={{ fontSize: 12.5, color: "#9ca3af", textAlign: "center", padding: "8px 0" }}>Nenhum aviso publicado</p>
            ) : (
              mockAvisos.filter(a => a.ativo).slice(0, 3).map(a => (
                <div key={a.id} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 3, borderRadius: 4, background: "#f97316", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 12.5, fontWeight: 600, color: "#1f2937" }}>{a.titulo}</p>
                    <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{formatDate(a.publicadoEm)}</p>
                  </div>
                </div>
              ))
            )}
            <Link href="/admin/avisos" style={{ display: "block", marginTop: 8, fontSize: 12, fontWeight: 600, color: "#f97316", textDecoration: "none" }}>
              Ver todos →
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Membros recentes */}
      <motion.div {...fade(0.35)} className="sl-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 6 }}>
            <Users size={15} color="#f97316" /> Membros Recentes
          </h3>
          <Link href="/admin/pessoas" style={{ fontSize: 12, fontWeight: 600, color: "#f97316", textDecoration: "none" }}>Ver todos →</Link>
        </div>
        {mockPessoas.length === 0 ? (
          <EmptyCard icon={Users} message="Nenhuma pessoa cadastrada ainda. Comece adicionando membros e visitantes." action="Cadastrar pessoa" href="/admin/pessoas" />
        ) : null}
      </motion.div>
    </div>
  );
}

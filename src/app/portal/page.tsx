"use client";

import { motion } from "framer-motion";
import { CalendarDays, CheckSquare, Megaphone, Flame, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, delay, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] } },
});

const versiculo = {
  texto: "\"Porque sou eu que conheço os planos que tenho para vocês, diz o Senhor, planos de fazê-los prosperar e não de lhes causar dano, planos de dar a vocês esperança e um futuro.\"",
  referencia: "Jeremias 29:11",
};

export default function PortalHomePage() {
  const quickActions = [
    { label: "Agenda",         href: "/portal/agenda",  icon: CalendarDays, color: "#3b82f6", bg: "#eff6ff" },
    { label: "Minhas Tarefas", href: "/portal/tarefas", icon: CheckSquare,  color: "#f97316", bg: "#fff7ed" },
    { label: "Avisos",         href: "/portal/avisos",  icon: Megaphone,    color: "#8b5cf6", bg: "#f5f3ff" },
    { label: "Meu Perfil",     href: "/portal/perfil",  icon: Flame,        color: "#ec4899", bg: "#fdf2f8" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Greeting */}
      <motion.div {...fade(0)}>
        <p style={{ fontSize: 14, color: "#9ca3af", fontWeight: 500 }}>Bem-vindo,</p>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>Portal do Membro 👋</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 3 }}>Igreja Seja Livre</p>
      </motion.div>

      {/* Versículo do dia */}
      <motion.div {...fade(0.05)} style={{
        borderRadius: 20, padding: "20px 22px",
        background: "linear-gradient(135deg,#f97316,#ea580c)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ position: "absolute", bottom: -30, right: 20, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <Heart size={13} color="rgba(255,255,255,0.8)" />
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Versículo do Dia</span>
        </div>
        <p style={{ fontSize: 13.5, color: "#fff", lineHeight: 1.65, fontStyle: "italic", marginBottom: 10 }}>{versiculo.texto}</p>
        <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.75)" }}>{versiculo.referencia}</p>
      </motion.div>

      {/* Próximo Evento */}
      <motion.div {...fade(0.1)}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "flex", alignItems: "center", gap: 6 }}>
            <CalendarDays size={14} color="#f97316" /> Próximo Evento
          </p>
          <Link href="/portal/agenda" style={{ fontSize: 12, color: "#f97316", fontWeight: 600, textDecoration: "none" }}>Ver agenda →</Link>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px", border: "1px solid #f3f4f6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
            <CalendarDays size={22} color="#d1d5db" />
          </div>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Nenhum evento cadastrado</p>
          <p style={{ fontSize: 12.5, color: "#9ca3af" }}>Os próximos eventos aparecerão aqui.</p>
        </div>
      </motion.div>

      {/* Avisos */}
      <motion.div {...fade(0.15)}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "flex", alignItems: "center", gap: 6 }}>
            <Megaphone size={14} color="#f97316" /> Últimos Avisos
          </p>
          <Link href="/portal/avisos" style={{ fontSize: 12, color: "#f97316", fontWeight: 600, textDecoration: "none" }}>Ver todos →</Link>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#9ca3af" }}>Nenhum aviso publicado ainda.</p>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div {...fade(0.2)}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>Acesso Rápido</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {quickActions.map(q => {
            const QIcon = q.icon;
            return (
              <Link key={q.href} href={q.href} style={{ textDecoration: "none" }}>
                <motion.div whileTap={{ scale: 0.96 }} style={{
                  background: "#fff", borderRadius: 14, padding: "16px 14px",
                  border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: q.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <QIcon size={17} color={q.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{q.label}</span>
                  </div>
                  <ChevronRight size={14} color="#d1d5db" />
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

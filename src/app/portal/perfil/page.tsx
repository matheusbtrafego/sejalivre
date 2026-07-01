"use client";

import { Flame, Phone, Mail, Users2, CheckSquare, ChevronRight, LogOut, User } from "lucide-react";
import Link from "next/link";

export default function PortalPerfilPage() {
  const links = [
    { icon: Users2,      label: "Minha Célula",   sub: "Não atribuído", href: "/portal/agenda",  color: "#3b82f6" },
    { icon: CheckSquare, label: "Minhas Tarefas",  sub: "Área não definida", href: "/portal/tarefas", color: "#f97316" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Profile card — vazio, aguardando login real */}
      <div style={{ background: "#fff", borderRadius: 24, padding: 24, border: "1px solid #f3f4f6", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 22, flexShrink: 0,
            background: "#f3f4f6",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <User size={30} color="#d1d5db" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>Meu Perfil</h2>
            <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>Os seus dados aparecerão aqui após o login com sua conta.</p>
          </div>
        </div>
      </div>

      {/* Info placeholder */}
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f3f4f6", overflow: "hidden" }}>
        {[
          { icon: Mail,  label: "Email",    value: "—" },
          { icon: Phone, label: "Telefone", value: "—" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "15px 20px",
              borderBottom: i === 0 ? "1px solid #f9fafb" : "none",
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={16} color="#d1d5db" />
              </div>
              <div>
                <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 1 }}>{item.label}</p>
                <p style={{ fontSize: 13.5, fontWeight: 600, color: "#d1d5db" }}>{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick links */}
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f3f4f6", overflow: "hidden" }}>
        {links.map((link, i) => {
          const Icon = link.icon;
          return (
            <Link key={link.label} href={link.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 14, padding: "15px 20px", cursor: "pointer",
                borderBottom: i < links.length - 1 ? "1px solid #f9fafb" : "none",
                transition: "background 0.15s",
              }}
                onMouseOver={e => (e.currentTarget.style.background = "#fafafa")}
                onMouseOut={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: link.color+"15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={17} color={link.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{link.label}</p>
                  <p style={{ fontSize: 12, color: "#9ca3af" }}>{link.sub}</p>
                </div>
                <ChevronRight size={16} color="#d1d5db" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <button style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "14px", borderRadius: 16, border: "1px solid #fecaca", background: "#fef2f2",
        fontSize: 13.5, fontWeight: 600, color: "#dc2626", cursor: "pointer",
      }}>
        <LogOut size={16} /> Sair da conta
      </button>

      {/* Footer */}
      <div style={{ textAlign: "center", paddingBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 4 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: "linear-gradient(135deg,#f97316,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Flame size={11} color="#fff" />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Seja Livre</span>
        </div>
        <p style={{ fontSize: 11, color: "#d1d5db" }}>Ministério de Libertação e Restauração</p>
      </div>
    </div>
  );
}

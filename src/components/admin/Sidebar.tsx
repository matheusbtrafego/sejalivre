"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, CheckSquare, CalendarDays,
  Megaphone, Users2, DollarSign, UserCheck, Settings,
  ChevronLeft, ChevronRight, Flame, Bell, LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin",            label: "Dashboard",       icon: LayoutDashboard, exact: true },
  { href: "/admin/pessoas",    label: "Pessoas",         icon: Users },
  { href: "/admin/tarefas",    label: "Tarefas & Áreas", icon: CheckSquare },
  { href: "/admin/calendario", label: "Calendário",      icon: CalendarDays },
  { href: "/admin/avisos",     label: "Avisos",          icon: Megaphone },
  { href: "/admin/celulas",    label: "Células",         icon: Users2 },
  { href: "/admin/financeiro", label: "Financeiro",      icon: DollarSign },
  { href: "/admin/aprovacoes", label: "Aprovações",      icon: UserCheck, badge: 2 },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen?: boolean, setMobileOpen?: (v: boolean) => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const width = collapsed ? 72 : 252;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <motion.aside
      animate={{ width, x: mobileOpen || !isMobile ? 0 : -252 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className={`sidebar-glass h-screen flex-shrink-0 z-50 flex flex-col fixed md:relative top-0 left-0 ${mobileOpen ? 'shadow-2xl' : ''}`}
      style={{ width }}
    >
      {/* Top shimmer line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
      }} />

      {/* Logo area */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: collapsed ? 0 : 12,
        justifyContent: collapsed ? "center" : "flex-start",
        padding: collapsed ? "20px 0" : "20px 16px",
        marginBottom: 8,
        flexShrink: 0,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11, flexShrink: 0,
          background: "linear-gradient(135deg,#f97316,#ea580c)",
          boxShadow: "0 4px 12px rgba(249,115,22,0.32)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Flame size={20} color="#fff" />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="logo-text"
              initial={{ opacity: 0, x: -6, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={{ opacity: 0, x: -6, width: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: "hidden", whiteSpace: "nowrap" }}
            >
              <p style={{ fontWeight: 800, fontSize: 14, color: "#111827", lineHeight: 1.2 }}>Seja Livre</p>
              <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>Sistema de Gestão</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(0,0,0,0.05)", marginBottom: 8, flexShrink: 0 }} />

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "4px 8px" }}>
        {navItems.map((navItem) => {
          const active = isActive(navItem);
          const Icon = navItem.icon;
          return (
            <Link key={navItem.href} href={navItem.href} style={{ display: "block", marginBottom: 2 }}>
              <motion.div
                whileTap={{ scale: 0.97 }}
                className={`sl-nav-item${active ? " active" : ""}`}
                style={{ justifyContent: collapsed ? "center" : "flex-start", overflow: "hidden" }}
                title={collapsed ? navItem.label : undefined}
              >
                <Icon size={18} style={{ flexShrink: 0, strokeWidth: active ? 2.5 : 2 }} />
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.18 }}
                      style={{ whiteSpace: "nowrap", overflow: "hidden", flex: 1 }}
                    >
                      {navItem.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {/* Badge */}
                {navItem.badge && !collapsed && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, borderRadius: 100,
                    width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center",
                    background: active ? "rgba(255,255,255,0.25)" : "#fff7ed",
                    color: active ? "#fff" : "#c2410c",
                    flexShrink: 0,
                  }}>
                    {navItem.badge}
                  </span>
                )}
                {navItem.badge && collapsed && (
                  <span style={{
                    position: "absolute", top: 6, right: 6,
                    width: 7, height: 7, borderRadius: "50%",
                    background: "#f97316", border: "1.5px solid #fff",
                  }} />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "8px 8px 16px", flexShrink: 0, borderTop: "1px solid rgba(0,0,0,0.05)" }}>
        <button
          style={{
            width: "100%", display: "flex", alignItems: "center",
            gap: collapsed ? 0 : 10, justifyContent: collapsed ? "center" : "flex-start",
            padding: "9px 10px", borderRadius: 11, border: "none",
            background: "transparent", cursor: "pointer", transition: "background 0.18s",
            color: "#6b7280", fontSize: 13.5, fontFamily: "inherit", fontWeight: 500,
          }}
          onMouseOver={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
          onMouseOut={e => (e.currentTarget.style.background = "transparent")}
        >
          <LogOut size={17} style={{ flexShrink: 0 }} />
          {!collapsed && <span style={{ whiteSpace: "nowrap" }}>Sair</span>}
        </button>
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          position: "absolute", right: -11, top: 36,
          width: 22, height: 22, borderRadius: "50%",
          background: "#fff", border: "1px solid #e5e7eb",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", zIndex: 10, transition: "all 0.18s",
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = "#fff7ed";
          e.currentTarget.style.borderColor = "#f97316";
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = "#fff";
          e.currentTarget.style.borderColor = "#e5e7eb";
        }}
      >
        {collapsed
          ? <ChevronRight size={12} color="#6b7280" />
          : <ChevronLeft size={12} color="#6b7280" />}
      </button>
    </motion.aside>
  );
}

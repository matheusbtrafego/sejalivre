"use client";

import { usePathname } from "next/navigation";
import { Topbar } from "./Topbar";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/admin": { title: "Dashboard", subtitle: "Visão geral da Igreja Seja Livre" },
  "/admin/pessoas": { title: "Pessoas", subtitle: "Membros, frequentadores e visitantes" },
  "/admin/tarefas": { title: "Tarefas & Áreas", subtitle: "Gerencie áreas e responsabilidades" },
  "/admin/calendario": { title: "Calendário", subtitle: "Eventos, cultos e reuniões" },
  "/admin/avisos": { title: "Avisos", subtitle: "Comunicados e informações" },
  "/admin/celulas": { title: "Células", subtitle: "Grupos e células da igreja" },
  "/admin/financeiro": { title: "Financeiro", subtitle: "Dízimos, ofertas e despesas" },
  "/admin/aprovacoes": { title: "Aprovações", subtitle: "Solicitações de acesso pendentes" },
  "/admin/configuracoes": { title: "Configurações", subtitle: "Dados e preferências do sistema" },
};

export default function DynamicTopbar({ setMobileMenuOpen }: { setMobileMenuOpen?: (open: boolean) => void }) {
  const pathname = usePathname();
  const info = pageTitles[pathname] ?? { title: "Seja Livre", subtitle: "Sistema de Gestão" };
  return <Topbar title={info.title} subtitle={info.subtitle} setMobileMenuOpen={setMobileMenuOpen} />;
}

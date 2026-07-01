// Dados reais virão do Supabase (Fase 2)
// Por enquanto, todos os módulos partem do zero

export const mockPessoas: {
  id: string; nome: string; email: string; telefone: string;
  status: string; area: string; celula: string; aniversario: string;
  foto: null; createdAt: string;
}[] = [];

export const mockAreas: {
  id: string; nome: string; cor: string; icone: string;
  responsavel: string; membros: string[];
  tarefas: {
    id: string; titulo: string; descricao: string;
    prazo: string; prioridade: string; status: string; responsavel: string;
  }[];
}[] = [];

export const mockEventos: {
  id: string; titulo: string; data: string; hora: string;
  tipo: string; local: string; vagas: number | null; inscritos: number; cor: string;
}[] = [];

export const mockAvisos: {
  id: string; titulo: string; conteudo: string; categoria: string;
  publicadoEm: string; autor: string; ativo: boolean;
}[] = [];

export const mockAprovacoes: {
  id: string; nome: string; email: string; telefone: string;
  solicitadoEm: string; status: string;
}[] = [];

export const mockKPIs = {
  totalMembros:        0,
  novosMesAtual:       0,
  tarefasPendentes:    0,
  proximoEvento:       null as string | null,
  aniversariantesHoje: [] as string[],
  aprovacoesPendentes: 0,
};

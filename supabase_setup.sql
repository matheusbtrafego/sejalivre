-- ==============================================================================
-- 🚀 SETUP BANCO DE DADOS: SEJA LIVRE (com isolamento `sl_`)
-- ==============================================================================
-- Execute este script no SQL Editor do seu projeto Supabase (Nexus).
-- Todas as tabelas têm o prefixo "sl_" para não conflitar com suas outras tabelas.

-- 1. EXTENSÃO PARA UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE MEMBROS E VISITANTES (O Coração do Sistema)
CREATE TABLE IF NOT EXISTS public.sl_membros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Link com autenticação (opcional p/ visitantes)
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    status TEXT DEFAULT 'Visitante', -- Visitante, Frequentador, Membro, Líder
    papel TEXT DEFAULT 'MEMBRO', -- ADMIN, LIDER, VOLUNTARIO, MEMBRO (Para RLS)
    area_atuacao TEXT,
    data_nascimento DATE,
    data_conversao DATE,
    -- Funil de Visitantes
    data_visita DATE,
    resp_follow_up TEXT,
    celula_id UUID, -- Será referenciado depois
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE CÉLULAS
CREATE TABLE IF NOT EXISTS public.sl_celulas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    lider_id UUID REFERENCES public.sl_membros(id) ON DELETE SET NULL,
    dia_reuniao TEXT,
    horario TEXT,
    endereco TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Atualiza a referência de celula no membro agora que a tabela existe
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_membro_celula'
    ) THEN
        ALTER TABLE public.sl_membros 
        ADD CONSTRAINT fk_membro_celula 
        FOREIGN KEY (celula_id) REFERENCES public.sl_celulas(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 4. TABELA DE EVENTOS (Calendário)
CREATE TABLE IF NOT EXISTS public.sl_eventos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    tipo TEXT NOT NULL, -- Culto, Célula, Retiro, Reunião
    data DATE NOT NULL,
    hora TEXT NOT NULL,
    local TEXT,
    cor TEXT, -- Cor para o calendário
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA DE ESCALAS (Voluntariado)
CREATE TABLE IF NOT EXISTS public.sl_escalas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evento_id UUID REFERENCES public.sl_eventos(id) ON DELETE CASCADE,
    membro_id UUID REFERENCES public.sl_membros(id) ON DELETE CASCADE,
    ministerio TEXT NOT NULL, -- Louvor, Recepção, etc
    funcao TEXT NOT NULL,
    status TEXT DEFAULT 'Pendente', -- Pendente, Confirmado, Troca Solicitada
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA DE TAREFAS (Kanban)
CREATE TABLE IF NOT EXISTS public.sl_tarefas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    area TEXT NOT NULL,
    status TEXT DEFAULT 'A Fazer', -- A Fazer, Em Andamento, Concluída
    responsavel_id UUID REFERENCES public.sl_membros(id) ON DELETE SET NULL,
    prazo DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABELA DE AVISOS
CREATE TABLE IF NOT EXISTS public.sl_avisos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    publico_alvo TEXT DEFAULT 'Todos', -- Todos, Liderança, Voluntários
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TABELA FINANCEIRO
CREATE TABLE IF NOT EXISTS public.sl_financeiro (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo TEXT NOT NULL, -- Entrada, Saída
    categoria TEXT NOT NULL, -- Dízimo, Oferta, Conta Luz, Aluguel
    valor DECIMAL(10,2) NOT NULL,
    data DATE NOT NULL,
    descricao TEXT,
    membro_id UUID REFERENCES public.sl_membros(id) ON DELETE SET NULL, -- Opcional
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. TABELA APROVAÇÕES (Fila da Liderança)
CREATE TABLE IF NOT EXISTS public.sl_aprovacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo TEXT NOT NULL, -- Solicitação de Acesso, Troca de Escala, Reembolso
    solicitante_id UUID REFERENCES public.sl_membros(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Pendente', -- Pendente, Aprovado, Rejeitado
    detalhes JSONB, -- Qualquer dado extra necessário
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 🔐 POLÍTICAS DE SEGURANÇA (Row Level Security - RLS)
-- ==============================================================================

-- Habilita RLS em todas as tabelas
ALTER TABLE public.sl_membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sl_celulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sl_eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sl_escalas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sl_tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sl_avisos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sl_financeiro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sl_aprovacoes ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- REGRAS BÁSICAS (Para facilitar o MVP, vamos liberar leitura/escrita autenticada e 
-- definir regras baseadas no cargo de ADMIN).
-- ------------------------------------------------------------------------------

-- CORREÇÃO AQUI: Criando a função no schema public (o Supabase bloqueia no auth)
CREATE OR REPLACE FUNCTION public.is_sl_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.sl_membros 
    WHERE user_id = auth.uid() AND papel IN ('ADMIN', 'PASTOR')
  );
$$ LANGUAGE sql SECURITY DEFINER;


-- 1. MEMBROS
-- Admin vê e edita todos. Usuário vê apenas a si mesmo.
DO $$ BEGIN
    DROP POLICY IF EXISTS "Membros: Admin tem acesso total" ON public.sl_membros;
    DROP POLICY IF EXISTS "Membros: Usuário vê seu próprio perfil" ON public.sl_membros;
    DROP POLICY IF EXISTS "Membros: Usuário pode atualizar seu perfil" ON public.sl_membros;
END $$;
CREATE POLICY "Membros: Admin tem acesso total" ON public.sl_membros FOR ALL TO authenticated USING (public.is_sl_admin());
CREATE POLICY "Membros: Usuário vê seu próprio perfil" ON public.sl_membros FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Membros: Usuário pode atualizar seu perfil" ON public.sl_membros FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- 2. EVENTOS e AVISOS
DO $$ BEGIN
    DROP POLICY IF EXISTS "Eventos: Leitura livre para autenticados" ON public.sl_eventos;
    DROP POLICY IF EXISTS "Eventos: Escrita apenas Admin" ON public.sl_eventos;
    DROP POLICY IF EXISTS "Avisos: Leitura livre para autenticados" ON public.sl_avisos;
    DROP POLICY IF EXISTS "Avisos: Escrita apenas Admin" ON public.sl_avisos;
END $$;
CREATE POLICY "Eventos: Leitura livre para autenticados" ON public.sl_eventos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Eventos: Escrita apenas Admin" ON public.sl_eventos FOR ALL TO authenticated USING (public.is_sl_admin());

CREATE POLICY "Avisos: Leitura livre para autenticados" ON public.sl_avisos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Avisos: Escrita apenas Admin" ON public.sl_avisos FOR ALL TO authenticated USING (public.is_sl_admin());

-- 3. ESCALAS
DO $$ BEGIN
    DROP POLICY IF EXISTS "Escalas: Leitura livre para autenticados" ON public.sl_escalas;
    DROP POLICY IF EXISTS "Escalas: Admin tem acesso total" ON public.sl_escalas;
    DROP POLICY IF EXISTS "Escalas: Usuário atualiza a sua" ON public.sl_escalas;
END $$;
CREATE POLICY "Escalas: Leitura livre para autenticados" ON public.sl_escalas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Escalas: Admin tem acesso total" ON public.sl_escalas FOR ALL TO authenticated USING (public.is_sl_admin());
CREATE POLICY "Escalas: Usuário atualiza a sua" ON public.sl_escalas FOR UPDATE TO authenticated USING (membro_id = (SELECT id FROM public.sl_membros WHERE user_id = auth.uid()));

-- 4. TAREFAS E CÉLULAS
DO $$ BEGIN
    DROP POLICY IF EXISTS "Celulas/Tarefas: Leitura livre" ON public.sl_celulas;
    DROP POLICY IF EXISTS "Celulas/Tarefas: Escrita Admin" ON public.sl_celulas;
    DROP POLICY IF EXISTS "Tarefas: Leitura livre" ON public.sl_tarefas;
    DROP POLICY IF EXISTS "Tarefas: Escrita Admin" ON public.sl_tarefas;
END $$;
CREATE POLICY "Celulas/Tarefas: Leitura livre" ON public.sl_celulas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Celulas/Tarefas: Escrita Admin" ON public.sl_celulas FOR ALL TO authenticated USING (public.is_sl_admin());

CREATE POLICY "Tarefas: Leitura livre" ON public.sl_tarefas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Tarefas: Escrita Admin" ON public.sl_tarefas FOR ALL TO authenticated USING (public.is_sl_admin());

-- 5. FINANCEIRO
DO $$ BEGIN
    DROP POLICY IF EXISTS "Financeiro: Apenas Admin" ON public.sl_financeiro;
END $$;
CREATE POLICY "Financeiro: Apenas Admin" ON public.sl_financeiro FOR ALL TO authenticated USING (public.is_sl_admin());

-- 6. APROVAÇÕES
DO $$ BEGIN
    DROP POLICY IF EXISTS "Aprovacoes: Admin total" ON public.sl_aprovacoes;
    DROP POLICY IF EXISTS "Aprovacoes: Usuario ve as suas" ON public.sl_aprovacoes;
    DROP POLICY IF EXISTS "Aprovacoes: Usuario cria" ON public.sl_aprovacoes;
END $$;
CREATE POLICY "Aprovacoes: Admin total" ON public.sl_aprovacoes FOR ALL TO authenticated USING (public.is_sl_admin());
CREATE POLICY "Aprovacoes: Usuario ve as suas" ON public.sl_aprovacoes FOR SELECT TO authenticated USING (solicitante_id = (SELECT id FROM public.sl_membros WHERE user_id = auth.uid()));
CREATE POLICY "Aprovacoes: Usuario cria" ON public.sl_aprovacoes FOR INSERT TO authenticated WITH CHECK (solicitante_id = (SELECT id FROM public.sl_membros WHERE user_id = auth.uid()));

-- ==============================================================================
-- FIM DO SETUP
-- ==============================================================================

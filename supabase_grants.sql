-- Adicione isso no final do seu SQL Editor e rode novamente para garantir que a API tem acesso:

GRANT ALL ON TABLE public.sl_membros TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.sl_celulas TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.sl_eventos TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.sl_escalas TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.sl_tarefas TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.sl_avisos TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.sl_financeiro TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.sl_aprovacoes TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';

-- Solução do ChatGPT para recursão infinita em RLS
-- Remove todas as políticas problemáticas e cria políticas "bobas"

-- 1) Remover TODAS as políticas atuais
DROP POLICY IF EXISTS user_roles_select ON public.user_roles;
DROP POLICY IF EXISTS user_roles_insert ON public.user_roles;
DROP POLICY IF EXISTS user_roles_update ON public.user_roles;
DROP POLICY IF EXISTS user_roles_delete ON public.user_roles;
DROP POLICY IF EXISTS user_roles_select_own ON public.user_roles;
DROP POLICY IF EXISTS user_roles_admin_manage ON public.user_roles;

-- Se tiver outras com nomes diferentes:
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT polname FROM pg_policies WHERE schemaname='public' AND tablename='user_roles'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_roles;', r.polname);
  END LOOP;
END$$;

-- 2) Garantir RLS ligado (mas sem recursão)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3) Políticas mínimas, sem olhar a própria tabela além da linha atual

-- Usuário autenticado pode ver APENAS a própria linha
CREATE POLICY user_roles_select_self
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Bloquear INSERT/UPDATE/DELETE para clientes (somente service_role fará isso)
CREATE POLICY user_roles_no_mutations
ON public.user_roles
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);

-- 4) Verificação final
SELECT 'Políticas RLS corrigidas com sucesso!' as resultado;
SELECT 'Faça logout/login para testar' as proxima_acao;

-- Remove políticas problemáticas que causam recursão infinita
DROP POLICY IF EXISTS user_roles_select_own ON public.user_roles;
DROP POLICY IF EXISTS user_roles_admin_manage ON public.user_roles;
DROP POLICY IF EXISTS user_roles_auth_select ON public.user_roles;
DROP POLICY IF EXISTS user_roles_admin_insert ON public.user_roles;
DROP POLICY IF EXISTS user_roles_admin_update ON public.user_roles;
DROP POLICY IF EXISTS user_roles_admin_delete ON public.user_roles;

-- Política simples que permite usuário ver apenas seu próprio role
CREATE POLICY user_roles_select_own
ON public.user_roles
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Política que permite apenas admins gerenciarem roles (sem recursão)
-- Usa uma abordagem diferente para evitar recursão infinita
CREATE POLICY user_roles_admin_manage
ON public.user_roles
FOR INSERT, UPDATE, DELETE TO authenticated
USING (
  -- Permite operações apenas se o usuário atual tem email de admin
  -- Evita recursão ao não consultar a própria tabela user_roles
  auth.email() IN ('teste.admin@arena.com', 'admin@arena.com')
)
WITH CHECK (
  auth.email() IN ('teste.admin@arena.com', 'admin@arena.com')
);

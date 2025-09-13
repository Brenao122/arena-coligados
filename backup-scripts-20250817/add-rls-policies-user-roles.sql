-- Habilita Row Level Security na tabela user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam apenas seus próprios roles
CREATE POLICY user_roles_select_own
ON public.user_roles
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Política para permitir que apenas admins insiram/atualizem roles
CREATE POLICY user_roles_admin_manage
ON public.user_roles
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- Política para permitir que usuários vejam roles durante autenticação
-- (necessário para o middleware funcionar)
CREATE POLICY user_roles_auth_access
ON public.user_roles
FOR SELECT TO authenticated
USING (true);

-- Remove a política mais restritiva se existir conflito
DROP POLICY IF EXISTS user_roles_select_own ON public.user_roles;

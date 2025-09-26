-- Remove políticas existentes que causam recursão infinita
DROP POLICY IF EXISTS user_roles_select_own ON public.user_roles;
DROP POLICY IF EXISTS user_roles_admin_manage ON public.user_roles;

-- Política simples: usuários podem ver apenas seu próprio role
CREATE POLICY user_roles_select_own
ON public.user_roles
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Política para admins gerenciarem roles (usando email ao invés de role para evitar recursão)
CREATE POLICY user_roles_admin_manage
ON public.user_roles
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.email IN ('teste.admin@arena.com', 'admin@arena.com')
  )
);

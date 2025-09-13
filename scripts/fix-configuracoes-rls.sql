-- Corrigir políticas RLS para tabela configuracoes
-- Execute este script no SQL Editor do Supabase

-- Criar políticas RLS para tabela configuracoes
-- Permitir que admins façam todas as operações

-- Adicionando política de SELECT para admins
CREATE POLICY "configuracoes_admin_select" ON public.configuracoes
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.profiles p ON p.id = ur.user_id
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- Adicionando política de INSERT para admins
CREATE POLICY "configuracoes_admin_insert" ON public.configuracoes
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.profiles p ON p.id = ur.user_id
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- Adicionando política de UPDATE para admins
CREATE POLICY "configuracoes_admin_update" ON public.configuracoes
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.profiles p ON p.id = ur.user_id
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.profiles p ON p.id = ur.user_id
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- Adicionando política de DELETE para admins
CREATE POLICY "configuracoes_admin_delete" ON public.configuracoes
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.profiles p ON p.id = ur.user_id
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'configuracoes';

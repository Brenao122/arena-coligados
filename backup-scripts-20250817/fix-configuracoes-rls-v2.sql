-- Script robusto para corrigir políticas RLS da tabela configuracoes
-- Execute este script no SQL Editor do Supabase

-- 1. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "configuracoes_admin_select" ON public.configuracoes;
DROP POLICY IF EXISTS "configuracoes_admin_insert" ON public.configuracoes;
DROP POLICY IF EXISTS "configuracoes_admin_update" ON public.configuracoes;
DROP POLICY IF EXISTS "configuracoes_admin_delete" ON public.configuracoes;

-- 2. Verificar se o usuário admin existe e tem role correto
SELECT 
  p.email, 
  ur.role,
  'Usuario admin encontrado' as status
FROM public.profiles p
JOIN public.user_roles ur ON p.id = ur.user_id
WHERE p.email = 'teste.admin@arena.com' AND ur.role = 'admin';

-- 3. Criar políticas RLS mais simples para configuracoes
CREATE POLICY "configuracoes_admin_all" ON public.configuracoes
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- 4. Verificar se a política foi criada
SELECT 
  policyname, 
  cmd,
  'Politica criada com sucesso' as status
FROM pg_policies 
WHERE tablename = 'configuracoes';

-- 5. Testar inserção diretamente
INSERT INTO public.configuracoes (chave, valor, descricao, tipo) 
VALUES ('teste_diagnostico', 'valor_teste', 'Teste do diagnostico', 'string')
ON CONFLICT (chave) DO UPDATE SET 
  valor = EXCLUDED.valor,
  updated_at = NOW();

SELECT 'Teste de insercao concluido com sucesso' as resultado;

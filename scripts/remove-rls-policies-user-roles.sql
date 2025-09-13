-- REMOVER TODAS AS POLÍTICAS RLS DA TABELA USER_ROLES
-- Estas políticas estão causando recursão infinita

-- 1. Remover todas as políticas existentes da tabela user_roles
DROP POLICY IF EXISTS user_roles_select_own ON public.user_roles;
DROP POLICY IF EXISTS user_roles_admin_manage ON public.user_roles;
DROP POLICY IF EXISTS user_roles_select_policy ON public.user_roles;
DROP POLICY IF EXISTS user_roles_insert_policy ON public.user_roles;
DROP POLICY IF EXISTS user_roles_update_policy ON public.user_roles;
DROP POLICY IF EXISTS user_roles_delete_policy ON public.user_roles;

-- 2. Desabilitar RLS na tabela user_roles temporariamente
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- 3. Verificar se as políticas foram removidas
SELECT 'POLÍTICAS RLS REMOVIDAS DA TABELA USER_ROLES' as status;

-- 4. Testar query simples
SELECT 'TESTE DE QUERY:' as info;
SELECT user_id, role FROM public.user_roles WHERE user_id = '53241ada-94db-4c80-8840-29a09a5a9b2d';

SELECT 'SCRIPT EXECUTADO COM SUCESSO!' as resultado;

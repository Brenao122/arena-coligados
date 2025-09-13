-- DIAGNÓSTICO COMPLETO - SUPABASE PRONTO PARA AUTOMAÇÃO N8N
-- Verificar se todas as estruturas necessárias estão funcionando

-- ========================================
-- 1. VERIFICAR TABELAS PRINCIPAIS
-- ========================================
SELECT '=== TABELAS PRINCIPAIS ===' as secao;

SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('profiles', 'user_roles', 'quadras', 'professores', 'reservas', 'pagamentos', 'leads', 'avaliacoes') 
        THEN '✅ ESSENCIAL'
        ELSE '⚠️ OPCIONAL'
    END as importancia
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY importancia DESC, table_name;

-- ========================================
-- 2. VERIFICAR AUTENTICAÇÃO
-- ========================================
SELECT '=== AUTENTICAÇÃO ===' as secao;

-- Verificar se há usuários de teste
SELECT 
    'Usuários de teste:' as info,
    COUNT(*) as total_usuarios
FROM auth.users;

-- Verificar se há roles configurados
SELECT 
    'Roles configurados:' as info,
    COUNT(*) as total_roles
FROM public.user_roles;

-- ========================================
-- 3. VERIFICAR DADOS DE TESTE
-- ========================================
SELECT '=== DADOS DE TESTE ===' as secao;

-- Contar registros em cada tabela
SELECT 'profiles' as tabela, COUNT(*) as total FROM public.profiles
UNION ALL
SELECT 'user_roles' as tabela, COUNT(*) as total FROM public.user_roles
UNION ALL
SELECT 'quadras' as tabela, COUNT(*) as total FROM public.quadras
UNION ALL
SELECT 'professores' as tabela, COUNT(*) as total FROM public.professores
UNION ALL
SELECT 'leads' as tabela, COUNT(*) as total FROM public.leads
UNION ALL
SELECT 'reservas' as tabela, COUNT(*) as total FROM public.reservas
UNION ALL
SELECT 'pagamentos' as tabela, COUNT(*) as total FROM public.pagamentos;

-- ========================================
-- 4. VERIFICAR RLS (ROW LEVEL SECURITY)
-- ========================================
SELECT '=== RLS (SEGURANÇA) ===' as secao;

-- Verificar se RLS está habilitado nas tabelas principais
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_habilitado
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_roles', 'quadras', 'professores', 'reservas', 'pagamentos', 'leads', 'avaliacoes');

-- ========================================
-- 5. VERIFICAR POLÍTICAS RLS
-- ========================================
SELECT '=== POLÍTICAS RLS ===' as secao;

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ========================================
-- 6. VERIFICAR FUNÇÕES E TRIGGERS
-- ========================================
SELECT '=== FUNÇÕES E TRIGGERS ===' as secao;

-- Verificar funções
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public';

-- Verificar triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- ========================================
-- 7. TESTE DE CONECTIVIDADE
-- ========================================
SELECT '=== TESTE DE CONECTIVIDADE ===' as secao;

-- Teste simples de SELECT
SELECT 'Teste SELECT profiles:' as teste, COUNT(*) as resultado FROM public.profiles;

-- Teste de INSERT (vamos tentar inserir um registro de teste temporário)
DO $$
BEGIN
    -- Tentar inserir um registro de teste
    INSERT INTO public.quadras (nome, tipo, preco_hora, ativa, descricao)
    VALUES ('TESTE-N8N', 'teste', 0.00, false, 'Registro de teste para n8n')
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Teste de INSERT realizado com sucesso';
    
    -- Limpar o registro de teste
    DELETE FROM public.quadras WHERE nome = 'TESTE-N8N';
    
    RAISE NOTICE 'Registro de teste removido';
END $$;

-- ========================================
-- 8. VERIFICAR CONFIGURAÇÕES PARA N8N
-- ========================================
SELECT '=== CONFIGURAÇÕES N8N ===' as secao;

-- Verificar se as tabelas têm as colunas necessárias para automação
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('quadras', 'reservas', 'leads', 'pagamentos')
AND column_name IN ('id', 'created_at', 'updated_at', 'status', 'ativa')
ORDER BY table_name, column_name;

-- ========================================
-- 9. RESUMO FINAL
-- ========================================
SELECT '=== RESUMO FINAL ===' as secao;

SELECT 
    'SUPABASE PRONTO PARA N8N?' as pergunta,
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users) > 0 
        AND (SELECT COUNT(*) FROM public.user_roles) > 0
        AND (SELECT COUNT(*) FROM public.quadras) >= 0
        THEN '✅ SIM - Estrutura básica OK'
        ELSE '❌ NÃO - Faltam dados essenciais'
    END as status;

SELECT 
    'PRÓXIMOS PASSOS:' as acao,
    CASE 
        WHEN (SELECT COUNT(*) FROM public.quadras) = 0 
        THEN '1. Cadastrar quadras reais 2. Configurar n8n 3. Testar integrações'
        ELSE '1. Configurar n8n 2. Testar integrações 3. Implementar automações'
    END as proximos_passos;



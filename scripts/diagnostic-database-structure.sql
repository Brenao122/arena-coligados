-- SCRIPT DE DIAGNÓSTICO COMPLETO DA ESTRUTURA DO BANCO
-- Execute este script para verificar TUDO que existe no Supabase

-- ========================================
-- 1. VERIFICAR TODAS AS TABELAS EXISTENTES
-- ========================================
SELECT 'TABELAS EXISTENTES:' as info;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- ========================================
-- 2. ESTRUTURA DETALHADA DE CADA TABELA
-- ========================================

-- TABELA: profiles
SELECT 'ESTRUTURA DA TABELA PROFILES:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- TABELA: user_roles
SELECT 'ESTRUTURA DA TABELA USER_ROLES:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'user_roles'
ORDER BY ordinal_position;

-- TABELA: quadras
SELECT 'ESTRUTURA DA TABELA QUADRAS:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'quadras'
ORDER BY ordinal_position;

-- TABELA: professores
SELECT 'ESTRUTURA DA TABELA PROFESSORES:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'professores'
ORDER BY ordinal_position;

-- TABELA: reservas
SELECT 'ESTRUTURA DA TABELA RESERVAS:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'reservas'
ORDER BY ordinal_position;

-- TABELA: clientes
SELECT 'ESTRUTURA DA TABELA CLIENTES:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'clientes'
ORDER BY ordinal_position;

-- TABELA: leads
SELECT 'ESTRUTURA DA TABELA LEADS:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'leads'
ORDER BY ordinal_position;

-- TABELA: pagamentos
SELECT 'ESTRUTURA DA TABELA PAGAMENTOS:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'pagamentos'
ORDER BY ordinal_position;

-- TABELA: configuracoes
SELECT 'ESTRUTURA DA TABELA CONFIGURACOES:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'configuracoes'
ORDER BY ordinal_position;

-- ========================================
-- 3. VERIFICAR CONSTRAINTS E RELACIONAMENTOS
-- ========================================
SELECT 'FOREIGN KEYS EXISTENTES:' as info;
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- ========================================
-- 4. VERIFICAR POLÍTICAS RLS
-- ========================================
SELECT 'POLÍTICAS RLS ATIVAS:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ========================================
-- 5. VERIFICAR ÍNDICES
-- ========================================
SELECT 'ÍNDICES EXISTENTES:' as info;
SELECT 
    t.relname as table_name,
    i.relname as index_name,
    a.attname as column_name
FROM pg_class t, pg_class i, pg_index ix, pg_attribute a
WHERE t.oid = ix.indrelid
    AND i.oid = ix.indexrelid
    AND a.attrelid = t.oid
    AND a.attnum = ANY(ix.indkey)
    AND t.relkind = 'r'
    AND t.relname IN ('profiles', 'user_roles', 'quadras', 'professores', 'reservas', 'clientes', 'leads', 'pagamentos', 'configuracoes')
ORDER BY t.relname, i.relname;

-- ========================================
-- 6. CONTAR REGISTROS EM CADA TABELA
-- ========================================
SELECT 'CONTAGEM DE REGISTROS:' as info;

DO $$
DECLARE
    table_name text;
    row_count integer;
BEGIN
    FOR table_name IN 
        SELECT t.table_name 
        FROM information_schema.tables t
        WHERE t.table_schema = 'public' 
        AND t.table_type = 'BASE TABLE'
        AND t.table_name IN ('profiles', 'user_roles', 'quadras', 'professores', 'reservas', 'clientes', 'leads', 'pagamentos', 'configuracoes')
    LOOP
        EXECUTE 'SELECT COUNT(*) FROM ' || table_name INTO row_count;
        RAISE NOTICE 'Tabela %: % registros', table_name, row_count;
    END LOOP;
END $$;

-- ========================================
-- 7. VERIFICAR SEQUENCES (se existirem)
-- ========================================
SELECT 'SEQUENCES EXISTENTES:' as info;
SELECT sequence_name, data_type, start_value, minimum_value, maximum_value, increment
FROM information_schema.sequences
WHERE sequence_schema = 'public';

SELECT 'DIAGNÓSTICO COMPLETO FINALIZADO!' as resultado;

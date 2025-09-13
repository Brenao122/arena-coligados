-- DIAGNÓSTICO COMPLETO - ARENA COLIGADOS
-- Execute este script no Supabase SQL Editor para verificar o estado atual

-- =====================================================
-- 1. VERIFICAÇÃO DE DADOS EXISTENTES
-- =====================================================

SELECT 'PROFILES' as tabela, COUNT(*) as total FROM public.profiles
UNION ALL
SELECT 'CLIENTES', COUNT(*) FROM public.clientes
UNION ALL
SELECT 'PROFESSORES', COUNT(*) FROM public.professores
UNION ALL
SELECT 'QUADRAS', COUNT(*) FROM public.quadras
UNION ALL
SELECT 'RESERVAS', COUNT(*) FROM public.reservas
UNION ALL
SELECT 'LEADS', COUNT(*) FROM public.leads
UNION ALL
SELECT 'PAGAMENTOS', COUNT(*) FROM public.pagamentos
UNION ALL
SELECT 'PENDING_STAFF', COUNT(*) FROM public.pending_staff
UNION ALL
SELECT 'USER_ROLES', COUNT(*) FROM public.user_roles;

-- =====================================================
-- 2. VERIFICAÇÃO DE TIPOS ENUM
-- =====================================================

-- Verificar se user_role_type existe
SELECT typname, typtype 
FROM pg_type 
WHERE typname = 'user_role_type';

-- Verificar constraints de pending_staff
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.pending_staff'::regclass;

-- =====================================================
-- 3. VERIFICAÇÃO DE PROFILES E ROLES
-- =====================================================

-- Verificar profiles com roles
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.phone,
    array_agg(ur.role) as roles
FROM public.profiles p
LEFT JOIN public.user_roles ur ON ur.user_id = p.id
GROUP BY p.id, p.email, p.full_name, p.phone
ORDER BY p.created_at DESC
LIMIT 10;

-- =====================================================
-- 4. VERIFICAÇÃO DE QUADRAS E TIPOS
-- =====================================================

-- Verificar tipos de quadras permitidos
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'quadras'
AND column_name = 'tipo';

-- Verificar quadras existentes
SELECT 
    nome,
    tipo,
    preco_hora,
    ativa,
    created_at
FROM public.quadras
ORDER BY created_at DESC;

-- =====================================================
-- 5. VERIFICAÇÃO DE RESERVAS
-- =====================================================

-- Verificar estrutura da tabela reservas
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'reservas'
ORDER BY ordinal_position;

-- =====================================================
-- 6. VERIFICAÇÃO DE RLS POLICIES
-- =====================================================

-- Verificar políticas RLS ativas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- 7. VERIFICAÇÃO DE TRIGGERS
-- =====================================================

-- Verificar triggers existentes
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- =====================================================
-- 8. VERIFICAÇÃO DE FUNCTIONS
-- =====================================================

-- Verificar funções relacionadas ao sistema
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%pending%'
   OR routine_name LIKE '%user%'
   OR routine_name LIKE '%auth%'
ORDER BY routine_name;

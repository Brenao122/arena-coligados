-- Script completo de verificação da estrutura do banco
-- Execute este comando para verificar se todas as tabelas e colunas existem

-- 1. VERIFICAR TABELAS EXISTENTES
SELECT 
  'TABELAS EXISTENTES' as categoria,
  table_name as nome,
  table_type as tipo
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. VERIFICAR COLUNAS DA TABELA QUADRAS
SELECT 
  'COLUNAS - QUADRAS' as categoria,
  column_name as nome,
  data_type as tipo,
  is_nullable as permite_null
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'quadras'
ORDER BY ordinal_position;

-- 3. VERIFICAR COLUNAS DA TABELA PROFESSORES
SELECT 
  'COLUNAS - PROFESSORES' as categoria,
  column_name as nome,
  data_type as tipo,
  is_nullable as permite_null
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'professores'
ORDER BY ordinal_position;

-- 4. VERIFICAR COLUNAS DA TABELA RESERVAS
SELECT 
  'COLUNAS - RESERVAS' as categoria,
  column_name as nome,
  data_type as tipo,
  is_nullable as permite_null
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'reservas'
ORDER BY ordinal_position;

-- 5. VERIFICAR COLUNAS DA TABELA PROFILES
SELECT 
  'COLUNAS - PROFILES' as categoria,
  column_name as nome,
  data_type as tipo,
  is_nullable as permite_null
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 6. VERIFICAR COLUNAS DA TABELA USER_ROLES
SELECT 
  'COLUNAS - USER_ROLES' as categoria,
  column_name as nome,
  data_type as tipo,
  is_nullable as permite_null
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'user_roles'
ORDER BY ordinal_position;

-- 7. VERIFICAR FOREIGN KEYS
SELECT 
  'FOREIGN KEYS' as categoria,
  tc.table_name as tabela,
  kcu.column_name as coluna,
  ccu.table_name as tabela_referenciada,
  ccu.column_name as coluna_referenciada
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

-- 8. VERIFICAR POLÍTICAS RLS
SELECT 
  'POLÍTICAS RLS' as categoria,
  tablename as tabela,
  policyname as politica,
  cmd as comando,
  roles as roles
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 9. CONTAGEM DE REGISTROS
SELECT 'DADOS - QUADRAS' as categoria, COUNT(*) as total FROM public.quadras;
SELECT 'DADOS - PROFESSORES' as categoria, COUNT(*) as total FROM public.professores;
SELECT 'DADOS - PROFILES' as categoria, COUNT(*) as total FROM public.profiles;
SELECT 'DADOS - USER_ROLES' as categoria, COUNT(*) as total FROM public.user_roles;
SELECT 'DADOS - RESERVAS' as categoria, COUNT(*) as total FROM public.reservas;

-- 10. VERIFICAR STORAGE (se configurado)
SELECT 
  'STORAGE BUCKETS' as categoria,
  name as nome,
  public as publico
FROM storage.buckets;

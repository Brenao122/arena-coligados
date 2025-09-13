-- DIAGNÓSTICO SIMPLES - VERIFICAR O QUE EXISTE

-- 1. LISTAR TODAS AS TABELAS
SELECT 'TABELAS EXISTENTES:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. VERIFICAR SE A TABELA QUADRAS EXISTE E SUAS COLUNAS
SELECT 'COLUNAS DA TABELA QUADRAS:' as info;
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'quadras'
ORDER BY ordinal_position;

-- 3. VERIFICAR SE A TABELA PROFESSORES EXISTE E SUAS COLUNAS  
SELECT 'COLUNAS DA TABELA PROFESSORES:' as info;
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'professores'
ORDER BY ordinal_position;

-- 4. CONTAR REGISTROS NAS TABELAS PRINCIPAIS
SELECT 'CONTAGEM DE REGISTROS:' as info;
SELECT 
  (SELECT COUNT(*) FROM profiles) as profiles_count,
  (SELECT COUNT(*) FROM user_roles) as user_roles_count;

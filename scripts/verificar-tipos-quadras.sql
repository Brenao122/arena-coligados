-- VERIFICAR TIPOS VÁLIDOS PARA QUADRAS
-- Descobrir quais são os tipos permitidos na constraint

-- 1. Verificar a constraint de tipo
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.quadras'::regclass 
AND contype = 'c';

-- 2. Verificar se existe uma tabela de tipos ou enum
SELECT 
    typname as tipo_nome,
    typtype as tipo_categoria
FROM pg_type 
WHERE typname LIKE '%quadra%' 
   OR typname LIKE '%tipo%'
   OR typname LIKE '%modalidade%';

-- 3. Verificar se há dados existentes para ver os tipos usados
SELECT 
    tipo,
    COUNT(*) as quantidade
FROM public.quadras 
GROUP BY tipo
ORDER BY tipo;

-- 4. Verificar a estrutura da tabela quadras
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'quadras'
ORDER BY ordinal_position;

-- 5. Tentar descobrir os tipos válidos baseado no POP
-- Baseado no POP, os tipos devem ser:
-- - futebol
-- - volei  
-- - beach_tennis
-- - futevolei
-- - poliesportiva



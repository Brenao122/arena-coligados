-- VERIFICAR APENAS A TABELA PROFESSORES  
SELECT 'COLUNAS DA TABELA PROFESSORES:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'professores'
ORDER BY ordinal_position;

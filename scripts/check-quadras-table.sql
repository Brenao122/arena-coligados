-- VERIFICAR APENAS A TABELA QUADRAS
SELECT 'COLUNAS DA TABELA QUADRAS:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'quadras'
ORDER BY ordinal_position;

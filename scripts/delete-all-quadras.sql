-- SCRIPT PARA DELETAR TODAS AS QUADRAS
-- Execute este script para limpar a tabela quadras e começar do zero

-- 1. Verificar quantas quadras existem antes de deletar
SELECT 'QUADRAS ANTES DA EXCLUSÃO:' as info;
SELECT COUNT(*) as total_quadras FROM public.quadras;

-- 2. Listar todas as quadras que serão deletadas
SELECT 'QUADRAS QUE SERÃO DELETADAS:' as info;
SELECT id, nome, tipo, preco_hora, ativa 
FROM public.quadras 
ORDER BY nome;

-- 3. Deletar todas as quadras
DELETE FROM public.quadras;

-- 4. Verificar se a exclusão foi bem-sucedida
SELECT 'QUADRAS APÓS A EXCLUSÃO:' as info;
SELECT COUNT(*) as total_quadras FROM public.quadras;

-- 5. Confirmar limpeza completa
SELECT 'LIMPEZA CONCLUÍDA! Tabela quadras está vazia e pronta para cadastro das quadras reais.' as resultado;

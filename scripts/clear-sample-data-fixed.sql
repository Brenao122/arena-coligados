-- Script para limpar dados de exemplo das quadras
-- Funciona com colunas UUID (não usa sequences)

-- Limpar dados de exemplo das quadras
DELETE FROM public.quadras 
WHERE nome IN (
    'Quadra Society 1',
    'Quadra Beach Tennis', 
    'Quadra Tênis',
    'Quadra Vôlei',
    'Quadra Futsal',
    'Tennis',
    'Futebol Society',
    'Beach Tennis'
);

-- Verificar quantas quadras restaram
SELECT COUNT(*) as quadras_restantes FROM public.quadras;

-- Mostrar quadras que sobraram (se houver)
SELECT id, nome, tipo, preco_hora, status 
FROM public.quadras 
ORDER BY created_at DESC;

-- Mensagem de confirmação
SELECT 'Dados de exemplo das quadras foram removidos com sucesso!' as resultado;

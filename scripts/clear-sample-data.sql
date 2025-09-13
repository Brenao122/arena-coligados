-- Script para limpar dados de exemplo das quadras
-- Execute este script para remover as quadras de exemplo e poder cadastrar as reais

-- Limpar dados de exemplo
DELETE FROM public.reservas WHERE quadra_id IN (
  SELECT id FROM public.quadras WHERE nome LIKE '%Society%' OR nome LIKE '%Beach%' OR nome LIKE '%Tênis%'
);

DELETE FROM public.quadras WHERE nome LIKE '%Society%' OR nome LIKE '%Beach%' OR nome LIKE '%Tênis%';

-- Resetar sequence se necessário
SELECT setval('quadras_id_seq', COALESCE((SELECT MAX(id) FROM quadras), 1), false);

-- Verificar limpeza
SELECT 'Quadras restantes:' as status, COUNT(*) as total FROM public.quadras;

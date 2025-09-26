-- Ver todas as quadras no banco
SELECT 
    id,
    nome,
    tipo,
    preco_hora,
    ativa,
    descricao,
    created_at,
    updated_at
FROM public.quadras
ORDER BY nome;

-- Contar total de quadras
SELECT COUNT(*) as total_quadras FROM public.quadras;

-- Ver quadras ativas
SELECT COUNT(*) as quadras_ativas FROM public.quadras WHERE ativa = true;

-- Ver quadras inativas
SELECT COUNT(*) as quadras_inativas FROM public.quadras WHERE ativa = false;

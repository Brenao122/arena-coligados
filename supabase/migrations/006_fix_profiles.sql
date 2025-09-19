-- =============================================
-- ARENA COLIGADOS - CORREÇÃO PROFILES
-- =============================================

-- Primeiro, vamos verificar se a tabela profiles tem a constraint correta
-- Se não, vamos ajustar para permitir inserção sem foreign key

-- Temporariamente desabilitar a constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Agora inserir os perfis sem constraint
INSERT INTO profiles (
    id,
    email,
    nome,
    telefone,
    role,
    ativo
) VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    'admin@arenacoligados.com.br',
    'Administrador Arena',
    '(62) 99999-9999',
    'admin'::user_role,
    true
),
(
    '00000000-0000-0000-0000-000000000002',
    'professor@arenacoligados.com.br',
    'Professor Silva',
    '(62) 88888-8888',
    'professor'::user_role,
    true
),
(
    '00000000-0000-0000-0000-000000000003',
    'cliente@arenacoligados.com.br',
    'Cliente Teste',
    '(62) 77777-7777',
    'cliente'::user_role,
    true
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    nome = EXCLUDED.nome,
    telefone = EXCLUDED.telefone,
    role = EXCLUDED.role,
    ativo = EXCLUDED.ativo;

-- Inserir algumas reservas de exemplo
INSERT INTO reservas (
    id,
    cliente_id,
    quadra_id,
    data_inicio,
    data_fim,
    valor_total,
    status,
    tipo
) VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000003',
    (SELECT id FROM quadras LIMIT 1),
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '1 day 2 hours',
    160.00,
    'confirmada'::reserva_status,
    'locacao'
),
(
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    (SELECT id FROM quadras LIMIT 1 OFFSET 1),
    NOW() + INTERVAL '2 days',
    NOW() + INTERVAL '2 days 1 hour',
    80.00,
    'pendente'::reserva_status,
    'locacao'
)
ON CONFLICT (id) DO NOTHING;




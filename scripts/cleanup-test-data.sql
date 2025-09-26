-- Script para limpar todos os dados de teste da plataforma Arena Coligados
-- Execute este script para remover dados mock/demo/teste

-- Removendo usuários de teste do sistema de autenticação
DELETE FROM auth.users WHERE email IN (
  'admin122@arena.com',
  'teste.admin@arena.com', 
  'teste.professor@arena.com',
  'teste.cliente@arena.com',
  'teste.aluno@arena.com',
  'professor@arena.com',
  'cliente@arena.com'
);

-- Removendo perfis de usuários de teste
DELETE FROM profiles WHERE email IN (
  'admin122@arena.com',
  'teste.admin@arena.com', 
  'teste.professor@arena.com',
  'teste.cliente@arena.com',
  'teste.aluno@arena.com',
  'professor@arena.com',
  'cliente@arena.com',
  'maria.silva@email.com',
  'joao.santos@email.com',
  'ana.costa@email.com',
  'pedro.lima@email.com',
  'carla.mendes@email.com',
  'lucas.oliveira@email.com',
  'fernanda.rocha@email.com',
  'ricardo.alves@email.com',
  'juliana.pereira@email.com',
  'marcos.ferreira@email.com'
);

-- Removendo leads de teste com telefones padronizados
DELETE FROM leads WHERE telefone LIKE '(11) 98888-%' OR email LIKE '%@email.com';

-- Removendo pagamentos de teste com IDs simulados
DELETE FROM pagamentos WHERE transaction_id IN (
  'PIX123456789',
  'CARD987654321', 
  'PIX111222333',
  'CARD444555666',
  'PIX777888999',
  'CARD123789456',
  'PIX456789123',
  'CARD789123456',
  'PIX321654987',
  'CARD654987321',
  'PIX159753486',
  'CARD753159486',
  'PIX486159753',
  'CARD159486753'
);

-- Removendo reservas de clientes de teste
DELETE FROM reservas WHERE cliente_id IN (
  SELECT id FROM profiles WHERE email LIKE '%@email.com'
);

-- Removendo professores de teste
DELETE FROM professores WHERE profile_id IN (
  SELECT id FROM profiles WHERE email IN (
    'carlos.silva@arena.com',
    'ana.santos@arena.com', 
    'roberto.lima@arena.com'
  )
);

-- Removendo quadras de demonstração (manter apenas as reais)
DELETE FROM quadras WHERE nome LIKE '%Quadra%' AND descricao LIKE '%demonstração%';

-- Limpeza final de dados órfãos
DELETE FROM profiles WHERE role = 'cliente' AND email LIKE '%@email.com';
DELETE FROM profiles WHERE full_name IN ('Maria Silva', 'João Santos', 'Ana Costa', 'Pedro Lima');

-- Verificar limpeza
SELECT 'Usuários restantes' as tipo, count(*) as quantidade FROM profiles
UNION ALL
SELECT 'Reservas restantes', count(*) FROM reservas  
UNION ALL
SELECT 'Leads restantes', count(*) FROM leads
UNION ALL
SELECT 'Pagamentos restantes', count(*) FROM pagamentos
UNION ALL
SELECT 'Quadras restantes', count(*) FROM quadras
UNION ALL
SELECT 'Professores restantes', count(*) FROM professores;

-- =============================================
-- ARENA COLIGADOS - DADOS DE TESTE
-- =============================================

-- Limpar dados existentes (cuidado em produção!)
DELETE FROM reservas;
DELETE FROM pagamentos;
DELETE FROM leads;
DELETE FROM profiles WHERE role != 'admin';
DELETE FROM quadras;

-- =============================================
-- QUADRAS DE TESTE
-- =============================================

INSERT INTO quadras (id, nome, tipo, capacidade, preco_hora, descricao, regras, equipamentos, ativo) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Quadra 1 - Matriz', 'Beach Tennis', 6, 80.00, 'Quadra de Beach Tennis com areia premium', 'Capacidade máxima de 6 pessoas', '["Rede oficial", "Raquetes", "Bolas"]', true),
('550e8400-e29b-41d4-a716-446655440002', 'Quadra 2 - Matriz', 'Vôlei', 10, 80.00, 'Quadra de Vôlei com piso profissional', 'Capacidade máxima de 10 pessoas', '["Rede oficial", "Bolas oficiais"]', true),
('550e8400-e29b-41d4-a716-446655440003', 'Quadra 3 - Matriz', 'Futevôlei', 10, 80.00, 'Quadra de Futevôlei com areia especial', 'Capacidade máxima de 10 pessoas', '["Rede regulamentada", "Bolas oficiais"]', true);

-- =============================================
-- PROFILES DE TESTE (CLIENTES E PROFESSORES)
-- =============================================

INSERT INTO profiles (id, email, nome, telefone, data_nascimento, endereco, role, ativo) VALUES
-- Clientes
('650e8400-e29b-41d4-a716-446655440001', 'joao.silva@email.com', 'João Silva Santos', '(62) 99999-1111', '1990-05-15', '{"rua": "Rua das Flores, 123", "bairro": "Centro", "cidade": "Goiânia", "estado": "GO", "cep": "74000-000"}', 'cliente', true),
('650e8400-e29b-41d4-a716-446655440002', 'maria.santos@email.com', 'Maria Santos Oliveira', '(62) 99999-2222', '1985-08-22', '{"rua": "Av. Goiás, 456", "bairro": "Setor Oeste", "cidade": "Goiânia", "estado": "GO", "cep": "74100-000"}', 'cliente', true),
('650e8400-e29b-41d4-a716-446655440003', 'carlos.lima@email.com', 'Carlos Eduardo Lima', '(62) 99999-3333', '1992-12-03', '{"rua": "Rua 7, 789", "bairro": "Setor Marista", "cidade": "Goiânia", "estado": "GO", "cep": "74200-000"}', 'cliente', true),
('650e8400-e29b-41d4-a716-446655440004', 'ana.costa@email.com', 'Ana Paula Costa', '(62) 99999-4444', '1988-07-18', '{"rua": "Av. T-10, 321", "bairro": "Setor Bueno", "cidade": "Goiânia", "estado": "GO", "cep": "74300-000"}', 'cliente', true),
('650e8400-e29b-41d4-a716-446655440005', 'pedro.oliveira@email.com', 'Pedro Oliveira Silva', '(62) 99999-5555', '1995-03-25', '{"rua": "Rua 15, 654", "bairro": "Setor Sul", "cidade": "Goiânia", "estado": "GO", "cep": "74400-000"}', 'cliente', true),

-- Professores
('750e8400-e29b-41d4-a716-446655440001', 'rafael.professor@arenacoligados.com.br', 'Rafael Henrique Professor', '(62) 99999-6666', '1980-04-12', '{"rua": "Rua das Palmeiras, 654", "bairro": "Jardim América", "cidade": "Goiânia", "estado": "GO", "cep": "74400-000"}', 'professor', true),
('750e8400-e29b-41d4-a716-446655440002', 'lucia.professora@arenacoligados.com.br', 'Lucia Maria Professora', '(62) 99999-7777', '1982-09-08', '{"rua": "Av. Universitária, 321", "bairro": "Setor Leste", "cidade": "Goiânia", "estado": "GO", "cep": "74500-000"}', 'professor', true);

-- =============================================
-- RESERVAS DE TESTE
-- =============================================

INSERT INTO reservas (id, cliente_id, quadra_id, professor_id, tipo, data_inicio, data_fim, valor_total, status, observacoes) VALUES
-- Reserva 1 - João Silva
('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'aula', '2025-01-20 14:00:00+00', '2025-01-20 15:00:00+00', 80.00, 'confirmada', 'Aula de Beach Tennis - Quadra 1'),
('850e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', NULL, 'locacao', '2025-01-21 16:00:00+00', '2025-01-21 18:00:00+00', 160.00, 'pendente', 'Locação Quadra 2 - Vôlei'),

-- Reserva 2 - Maria Santos
('850e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440002', 'aula', '2025-01-22 10:00:00+00', '2025-01-22 11:00:00+00', 80.00, 'confirmada', 'Aula de Futevôlei - Quadra 3'),

-- Reserva 3 - Carlos Lima
('850e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', NULL, 'locacao', '2025-01-23 19:00:00+00', '2025-01-23 21:00:00+00', 160.00, 'confirmada', 'Locação Quadra 1 - Beach Tennis'),

-- Reserva 4 - Ana Costa
('850e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 'aula', '2025-01-24 15:00:00+00', '2025-01-24 16:00:00+00', 80.00, 'pendente', 'Aula de Vôlei - Quadra 2');

-- =============================================
-- LEADS DE TESTE
-- =============================================

INSERT INTO leads (id, nome, email, telefone, interesse, origem, status, observacoes) VALUES
('950e8400-e29b-41d4-a716-446655440001', 'Roberto Alves', 'roberto.alves@email.com', '(62) 99999-8888', 'Aula de Beach Tennis', 'instagram', 'novo', 'Interessado em aulas particulares'),
('950e8400-e29b-41d4-a716-446655440002', 'Fernanda Lima', 'fernanda.lima@email.com', '(62) 99999-9999', 'Locação de quadra', 'whatsapp', 'contatado', 'Quer alugar para aniversário'),
('950e8400-e29b-41d4-a716-446655440003', 'Marcos Santos', 'marcos.santos@email.com', '(62) 99999-0000', 'Aula de Vôlei', 'site', 'qualificado', 'Jogador experiente, quer melhorar técnica'),
('950e8400-e29b-41d4-a716-446655440004', 'Juliana Costa', 'juliana.costa@email.com', '(62) 99999-1111', 'Futevôlei', 'indicacao', 'proposta', 'Indicada por cliente atual'),
('950e8400-e29b-41d4-a716-446655440005', 'Thiago Oliveira', 'thiago.oliveira@email.com', '(62) 99999-2222', 'Evento corporativo', 'google', 'convertido', 'Empresa quer fazer evento de integração');

-- =============================================
-- PAGAMENTOS DE TESTE
-- =============================================

INSERT INTO pagamentos (id, reserva_id, cliente_id, valor, status, metodo_pagamento, data_pagamento, observacoes) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 80.00, 'pago', 'PIX', '2025-01-20 13:30:00+00', 'Pagamento antecipado'),
('a50e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', 80.00, 'pago', 'PIX', '2025-01-22 09:30:00+00', 'Pagamento no local'),
('a50e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440003', 160.00, 'pago', 'Dinheiro', '2025-01-23 18:30:00+00', 'Pagamento em dinheiro'),
('a50e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440004', 80.00, 'pendente', 'PIX', NULL, 'Aguardando pagamento');

-- =============================================
-- VERIFICAÇÃO DOS DADOS INSERIDOS
-- =============================================

-- Verificar quadras
SELECT 'QUADRAS' as tabela, COUNT(*) as total FROM quadras;

-- Verificar clientes
SELECT 'CLIENTES' as tabela, COUNT(*) as total FROM profiles WHERE role = 'cliente';

-- Verificar professores
SELECT 'PROFESSORES' as tabela, COUNT(*) as total FROM profiles WHERE role = 'professor';

-- Verificar reservas
SELECT 'RESERVAS' as tabela, COUNT(*) as total FROM reservas;

-- Verificar leads
SELECT 'LEADS' as tabela, COUNT(*) as total FROM leads;

-- Verificar pagamentos
SELECT 'PAGAMENTOS' as tabela, COUNT(*) as total FROM pagamentos;

-- Verificar estatísticas do dashboard
SELECT get_dashboard_stats() as dashboard_stats;

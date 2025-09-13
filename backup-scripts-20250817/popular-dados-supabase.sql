-- SCRIPT COMPLETO PARA POPULAR DADOS NO SUPABASE
-- Execute este script no SQL Editor do Supabase

-- 1. Inserir quadras
INSERT INTO quadras (name, type, price_per_hour, description, active) VALUES
('Quadra Society 1', 'Futebol Society', 80.00, 'Quadra de grama sintética com iluminação LED', true),
('Quadra Beach Tennis', 'Beach Tennis', 60.00, 'Quadra oficial de beach tennis com areia importada', true),
('Quadra Tênis', 'Tênis', 70.00, 'Quadra profissional de tênis com piso sintético', true),
('Quadra Vôlei', 'Vôlei', 50.00, 'Quadra coberta de vôlei com arquibancada', true),
('Quadra Futsal', 'Futsal', 75.00, 'Quadra coberta de futsal com piso oficial', true),
('Quadra Poliesportiva', 'Poliesportiva', 65.00, 'Quadra adaptável para múltiplos esportes', true);

-- 2. Inserir leads de exemplo
INSERT INTO leads (name, email, phone, source, status, notes) VALUES
('João Silva Santos', 'joao.silva@email.com', '(11) 99999-1234', 'whatsapp', 'novo', 'Interessado em aulas de tênis'),
('Maria Oliveira Costa', 'maria.costa@email.com', '(11) 99999-5678', 'instagram', 'contatado', 'Quer reservar quadra para aniversário'),
('Pedro Almeida Lima', 'pedro.lima@email.com', '(11) 99999-9012', 'site', 'interessado', 'Procura professor de beach tennis'),
('Ana Carolina Souza', 'ana.souza@email.com', '(11) 99999-3456', 'indicacao', 'convertido', 'Cliente convertido - primeira aula agendada'),
('Carlos Eduardo Rocha', 'carlos.rocha@email.com', '(11) 99999-7890', 'whatsapp', 'perdido', 'Não respondeu aos contatos');

-- 3. Verificar se dados foram inseridos
SELECT 'Quadras inseridas:' as tabela, COUNT(*) as total FROM quadras
UNION ALL
SELECT 'Leads inseridos:' as tabela, COUNT(*) as total FROM leads;

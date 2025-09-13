-- Limpar dados existentes para demonstração
DELETE FROM pagamentos;
DELETE FROM reservas;
DELETE FROM leads;
DELETE FROM professores;
DELETE FROM quadras;
DELETE FROM profiles WHERE role != 'admin';

-- Inserir quadras com dados realistas
INSERT INTO quadras (nome, tipo, descricao, preco_hora, ativa, imagem_url) VALUES
('Quadra 1 - Futebol Society', 'futebol_society', 'Quadra de futebol society com grama sintética de alta qualidade, iluminação LED e vestiários completos', 80.00, true, '/futebol-society-sintetica.png'),
('Quadra 2 - Beach Tennis', 'beach_tennis', 'Quadra oficial de beach tennis com areia importada, rede regulamentada e arquibancada para 50 pessoas', 60.00, true, '/beach-tennis-court.png'),
('Quadra 3 - Tênis', 'tenis', 'Quadra de tênis com piso rápido, iluminação profissional e sistema de som ambiente', 70.00, true, '/tenis-piso-rapido.png'),
('Quadra 4 - Vôlei', 'volei', 'Quadra de vôlei com piso emborrachado, rede oficial e marcação regulamentada', 65.00, true, '/volei-quadra-emborrachada.png'),
('Quadra 5 - Futsal', 'futsal', 'Quadra de futsal coberta com piso sintético, traves oficiais e sistema de ventilação', 75.00, true, '/quadra-poliesportiva-multipla.png'),
('Quadra 6 - Poliesportiva', 'poliesportiva', 'Quadra poliesportiva para múltiplas modalidades, com marcações para basquete, vôlei e futsal', 85.00, false, '/placeholder-2833s.png');

-- Inserir professores
INSERT INTO profiles (id, full_name, email, phone, role, created_at) VALUES
('prof-1', 'Carlos Silva', 'carlos.silva@arena.com', '(11) 98765-4321', 'professor', NOW() - INTERVAL '6 months'),
('prof-2', 'Ana Santos', 'ana.santos@arena.com', '(11) 97654-3210', 'professor', NOW() - INTERVAL '4 months'),
('prof-3', 'Roberto Lima', 'roberto.lima@arena.com', '(11) 96543-2109', 'professor', NOW() - INTERVAL '3 months');

INSERT INTO professores (profile_id, especialidades, disponibilidade, ativo) VALUES
('prof-1', ARRAY['futebol_society', 'futsal'], '{"segunda": ["08:00-12:00", "14:00-18:00"], "terca": ["08:00-12:00", "14:00-18:00"], "quarta": ["08:00-12:00", "14:00-18:00"], "quinta": ["08:00-12:00", "14:00-18:00"], "sexta": ["08:00-12:00", "14:00-18:00"], "sabado": ["08:00-12:00"], "domingo": []}', true),
('prof-2', ARRAY['beach_tennis', 'tenis'], '{"segunda": ["09:00-13:00", "15:00-19:00"], "terca": ["09:00-13:00", "15:00-19:00"], "quarta": ["09:00-13:00", "15:00-19:00"], "quinta": ["09:00-13:00", "15:00-19:00"], "sexta": ["09:00-13:00", "15:00-19:00"], "sabado": ["09:00-13:00"], "domingo": []}', true),
('prof-3', ARRAY['volei', 'poliesportiva'], '{"segunda": ["07:00-11:00", "13:00-17:00"], "terca": ["07:00-11:00", "13:00-17:00"], "quarta": ["07:00-11:00", "13:00-17:00"], "quinta": ["07:00-11:00", "13:00-17:00"], "sexta": ["07:00-11:00", "13:00-17:00"], "sabado": ["07:00-11:00"], "domingo": []}', true);

-- Inserir clientes
INSERT INTO profiles (id, full_name, email, phone, role, created_at) VALUES
('cliente-1', 'Maria Silva', 'maria.silva@email.com', '(11) 99999-1111', 'cliente', NOW() - INTERVAL '3 months'),
('cliente-2', 'João Santos', 'joao.santos@email.com', '(11) 99999-2222', 'cliente', NOW() - INTERVAL '2 months'),
('cliente-3', 'Ana Costa', 'ana.costa@email.com', '(11) 99999-3333', 'cliente', NOW() - INTERVAL '1 month'),
('cliente-4', 'Pedro Lima', 'pedro.lima@email.com', '(11) 99999-4444', 'cliente', NOW() - INTERVAL '3 weeks'),
('cliente-5', 'Carla Mendes', 'carla.mendes@email.com', '(11) 99999-5555', 'cliente', NOW() - INTERVAL '2 weeks'),
('cliente-6', 'Lucas Oliveira', 'lucas.oliveira@email.com', '(11) 99999-6666', 'cliente', NOW() - INTERVAL '1 week'),
('cliente-7', 'Fernanda Rocha', 'fernanda.rocha@email.com', '(11) 99999-7777', 'cliente', NOW() - INTERVAL '5 days'),
('cliente-8', 'Ricardo Alves', 'ricardo.alves@email.com', '(11) 99999-8888', 'cliente', NOW() - INTERVAL '3 days'),
('cliente-9', 'Juliana Pereira', 'juliana.pereira@email.com', '(11) 99999-9999', 'cliente', NOW() - INTERVAL '2 days'),
('cliente-10', 'Marcos Ferreira', 'marcos.ferreira@email.com', '(11) 99999-0000', 'cliente', NOW() - INTERVAL '1 day');

-- Inserir leads
INSERT INTO leads (nome, telefone, email, origem, status, observacoes, created_at) VALUES
('Beatriz Martins', '(11) 98888-1111', 'beatriz.martins@email.com', 'instagram', 'novo', 'Interessada em aulas de beach tennis', NOW() - INTERVAL '2 hours'),
('Gabriel Costa', '(11) 98888-2222', 'gabriel.costa@email.com', 'whatsapp', 'contatado', 'Quer agendar aula experimental de futebol', NOW() - INTERVAL '4 hours'),
('Larissa Souza', '(11) 98888-3333', 'larissa.souza@email.com', 'instagram', 'novo', 'Perguntou sobre preços de locação', NOW() - INTERVAL '6 hours'),
('Diego Ribeiro', '(11) 98888-4444', 'diego.ribeiro@email.com', 'site', 'convertido', 'Agendou aula experimental para amanhã', NOW() - INTERVAL '1 day'),
('Camila Torres', '(11) 98888-5555', 'camila.torres@email.com', 'instagram', 'contatado', 'Interessada em aulas de tênis', NOW() - INTERVAL '1 day'),
('Rafael Gomes', '(11) 98888-6666', 'rafael.gomes@email.com', 'whatsapp', 'novo', 'Quer informações sobre futsal', NOW() - INTERVAL '2 days'),
('Patrícia Dias', '(11) 98888-7777', 'patricia.dias@email.com', 'instagram', 'perdido', 'Não respondeu após 3 tentativas', NOW() - INTERVAL '3 days'),
('Thiago Moura', '(11) 98888-8888', 'thiago.moura@email.com', 'site', 'contatado', 'Agendou visita para conhecer as quadras', NOW() - INTERVAL '4 days');

-- Inserir reservas (passadas, presentes e futuras)
INSERT INTO reservas (cliente_id, quadra_id, professor_id, data_inicio, data_fim, tipo, status, valor, observacoes, created_at) VALUES
-- Reservas passadas (concluídas)
('cliente-1', (SELECT id FROM quadras WHERE nome = 'Quadra 2 - Beach Tennis'), 'prof-2', NOW() - INTERVAL '7 days' + INTERVAL '14 hours', NOW() - INTERVAL '7 days' + INTERVAL '15 hours', 'Aula Experimental', 'concluida', 50.00, 'Primeira aula da Maria, gostou muito!', NOW() - INTERVAL '8 days'),
('cliente-2', (SELECT id FROM quadras WHERE nome = 'Quadra 1 - Futebol Society'), NULL, NOW() - INTERVAL '5 days' + INTERVAL '16 hours', NOW() - INTERVAL '5 days' + INTERVAL '17 hours', 'Locação', 'concluida', 80.00, 'Pelada com os amigos', NOW() - INTERVAL '6 days'),
('cliente-3', (SELECT id FROM quadras WHERE nome = 'Quadra 3 - Tênis'), 'prof-2', NOW() - INTERVAL '4 days' + INTERVAL '10 hours', NOW() - INTERVAL '4 days' + INTERVAL '11 hours', 'Aula Particular', 'concluida', 120.00, 'Aula focada em saque', NOW() - INTERVAL '5 days'),
('cliente-4', (SELECT id FROM quadras WHERE nome = 'Quadra 4 - Vôlei'), 'prof-3', NOW() - INTERVAL '3 days' + INTERVAL '15 hours', NOW() - INTERVAL '3 days' + INTERVAL '16 hours', 'Aula Experimental', 'concluida', 50.00, 'Pedro adorou, quer continuar', NOW() - INTERVAL '4 days'),
('cliente-5', (SELECT id FROM quadras WHERE nome = 'Quadra 5 - Futsal'), 'prof-1', NOW() - INTERVAL '2 days' + INTERVAL '18 hours', NOW() - INTERVAL '2 days' + INTERVAL '19 hours', 'Aula Particular', 'concluida', 110.00, 'Treino de finalização', NOW() - INTERVAL '3 days'),

-- Reservas de hoje
('cliente-1', (SELECT id FROM quadras WHERE nome = 'Quadra 2 - Beach Tennis'), 'prof-2', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '3 hours', 'Aula Particular', 'confirmada', 100.00, 'Segunda aula da Maria', NOW() - INTERVAL '1 day'),
('cliente-6', (SELECT id FROM quadras WHERE nome = 'Quadra 1 - Futebol Society'), NULL, NOW() + INTERVAL '4 hours', NOW() + INTERVAL '5 hours', 'Locação', 'confirmada', 80.00, 'Jogo com colegas de trabalho', NOW() - INTERVAL '2 days'),
('cliente-7', (SELECT id FROM quadras WHERE nome = 'Quadra 3 - Tênis'), 'prof-2', NOW() + INTERVAL '6 hours', NOW() + INTERVAL '7 hours', 'Aula Experimental', 'confirmada', 50.00, 'Primeira aula da Fernanda', NOW() - INTERVAL '1 day'),

-- Reservas futuras
('cliente-8', (SELECT id FROM quadras WHERE nome = 'Quadra 4 - Vôlei'), 'prof-3', NOW() + INTERVAL '1 day' + INTERVAL '16 hours', NOW() + INTERVAL '1 day' + INTERVAL '17 hours', 'Aula Experimental', 'confirmada', 50.00, 'Aula experimental do Ricardo', NOW() - INTERVAL '1 day'),
('cliente-9', (SELECT id FROM quadras WHERE nome = 'Quadra 5 - Futsal'), 'prof-1', NOW() + INTERVAL '2 days' + INTERVAL '19 hours', NOW() + INTERVAL '2 days' + INTERVAL '20 hours', 'Aula Particular', 'confirmada', 110.00, 'Treino técnico', NOW() - INTERVAL '1 day'),
('cliente-10', (SELECT id FROM quadras WHERE nome = 'Quadra 1 - Futebol Society'), NULL, NOW() + INTERVAL '3 days' + INTERVAL '15 hours', NOW() + INTERVAL '3 days' + INTERVAL '16 hours', 'Locação', 'pendente', 80.00, 'Aguardando confirmação de pagamento', NOW()),
('cliente-2', (SELECT id FROM quadras WHERE nome = 'Quadra 2 - Beach Tennis'), 'prof-2', NOW() + INTERVAL '4 days' + INTERVAL '14 hours', NOW() + INTERVAL '4 days' + INTERVAL '15 hours', 'Aula Particular', 'confirmada', 100.00, 'Aula de aperfeiçoamento', NOW() - INTERVAL '1 day'),
('cliente-3', (SELECT id FROM quadras WHERE nome = 'Quadra 3 - Tênis'), 'prof-2', NOW() + INTERVAL '5 days' + INTERVAL '11 hours', NOW() + INTERVAL '5 days' + INTERVAL '12 hours', 'Aula Particular', 'confirmada', 120.00, 'Preparação para torneio', NOW() - INTERVAL '2 days'),
('cliente-4', (SELECT id FROM quadras WHERE nome = 'Quadra 4 - Vôlei'), 'prof-3', NOW() + INTERVAL '6 days' + INTERVAL '17 hours', NOW() + INTERVAL '6 days' + INTERVAL '18 hours', 'Aula Particular', 'confirmada', 105.00, 'Treino de ataque', NOW() - INTERVAL '1 day'),
('cliente-5', (SELECT id FROM quadras WHERE nome = 'Quadra 5 - Futsal'), NULL, NOW() + INTERVAL '7 days' + INTERVAL '20 hours', NOW() + INTERVAL '7 days' + INTERVAL '21 hours', 'Locação', 'confirmada', 75.00, 'Jogo da empresa', NOW() - INTERVAL '3 days');

-- Inserir pagamentos correspondentes às reservas
INSERT INTO pagamentos (reserva_id, valor, metodo, status, transaction_id, created_at) VALUES
-- Pagamentos das reservas concluídas
((SELECT id FROM reservas WHERE cliente_id = 'cliente-1' AND status = 'concluida' LIMIT 1), 50.00, 'pix', 'aprovado', 'PIX123456789', NOW() - INTERVAL '8 days'),
((SELECT id FROM reservas WHERE cliente_id = 'cliente-2' AND status = 'concluida' LIMIT 1), 80.00, 'cartao', 'aprovado', 'CARD987654321', NOW() - INTERVAL '6 days'),
((SELECT id FROM reservas WHERE cliente_id = 'cliente-3' AND status = 'concluida' LIMIT 1), 120.00, 'pix', 'aprovado', 'PIX111222333', NOW() - INTERVAL '5 days'),
((SELECT id FROM reservas WHERE cliente_id = 'cliente-4' AND status = 'concluida' LIMIT 1), 50.00, 'cartao', 'aprovado', 'CARD444555666', NOW() - INTERVAL '4 days'),
((SELECT id FROM reservas WHERE cliente_id = 'cliente-5' AND status = 'concluida' LIMIT 1), 110.00, 'pix', 'aprovado', 'PIX777888999', NOW() - INTERVAL '3 days'),

-- Pagamentos das reservas confirmadas de hoje
((SELECT id FROM reservas WHERE cliente_id = 'cliente-1' AND data_inicio::date = CURRENT_DATE LIMIT 1), 100.00, 'cartao', 'aprovado', 'CARD123789456', NOW() - INTERVAL '1 day'),
((SELECT id FROM reservas WHERE cliente_id = 'cliente-6' AND data_inicio::date = CURRENT_DATE LIMIT 1), 80.00, 'pix', 'aprovado', 'PIX456789123', NOW() - INTERVAL '2 days'),
((SELECT id FROM reservas WHERE cliente_id = 'cliente-7' AND data_inicio::date = CURRENT_DATE LIMIT 1), 50.00, 'cartao', 'aprovado', 'CARD789123456', NOW() - INTERVAL '1 day'),

-- Pagamentos das reservas futuras confirmadas
((SELECT id FROM reservas WHERE cliente_id = 'cliente-8' AND status = 'confirmada' AND data_inicio > NOW() LIMIT 1), 50.00, 'pix', 'aprovado', 'PIX321654987', NOW() - INTERVAL '1 day'),
((SELECT id FROM reservas WHERE cliente_id = 'cliente-9' AND status = 'confirmada' AND data_inicio > NOW() LIMIT 1), 110.00, 'cartao', 'aprovado', 'CARD654987321', NOW() - INTERVAL '1 day'),
((SELECT id FROM reservas WHERE cliente_id = 'cliente-2' AND status = 'confirmada' AND data_inicio > NOW() + INTERVAL '3 days' LIMIT 1), 100.00, 'pix', 'aprovado', 'PIX159753486', NOW() - INTERVAL '1 day'),
((SELECT id FROM reservas WHERE cliente_id = 'cliente-3' AND status = 'confirmada' AND data_inicio > NOW() + INTERVAL '4 days' LIMIT 1), 120.00, 'cartao', 'aprovado', 'CARD753159486', NOW() - INTERVAL '2 days'),
((SELECT id FROM reservas WHERE cliente_id = 'cliente-4' AND status = 'confirmada' AND data_inicio > NOW() + INTERVAL '5 days' LIMIT 1), 105.00, 'pix', 'aprovado', 'PIX486159753', NOW() - INTERVAL '1 day'),
((SELECT id FROM reservas WHERE cliente_id = 'cliente-5' AND status = 'confirmada' AND data_inicio > NOW() + INTERVAL '6 days' LIMIT 1), 75.00, 'cartao', 'aprovado', 'CARD159486753', NOW() - INTERVAL '3 days');

-- Inserir um pagamento pendente para a reserva pendente
INSERT INTO pagamentos (reserva_id, valor, metodo, status, created_at) VALUES
((SELECT id FROM reservas WHERE status = 'pendente' LIMIT 1), 80.00, 'pix', 'pendente', NOW());

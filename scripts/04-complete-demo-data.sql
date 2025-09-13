-- Dados completos de demonstração para Arena Coligados
-- Execute após as tabelas estarem criadas

-- Limpar dados existentes
DELETE FROM public.reservas;
DELETE FROM public.pagamentos;
DELETE FROM public.leads;
DELETE FROM public.professores;
DELETE FROM public.quadras;

-- Inserir quadras com mais detalhes
INSERT INTO public.quadras (nome, tipo, preco_hora, descricao, imagem_url, ativo) VALUES
('Quadra Central - Futsal', 'futsal', 120.00, 'Quadra principal com grama sintética premium, iluminação LED e arquibancada para 200 pessoas', '/placeholder.svg?height=300&width=400', true),
('Arena Vôlei Pro', 'volei', 90.00, 'Quadra oficial de vôlei com piso Taraflex, rede profissional e sistema de som', '/placeholder.svg?height=300&width=400', true),
('Court Basketball Elite', 'basquete', 100.00, 'Quadra de basquete com piso de madeira, tabelas oficiais NBA e climatização', '/placeholder.svg?height=300&width=400', true),
('Campo Society Premium', 'society', 150.00, 'Campo society com grama natural, vestiários completos e estacionamento', '/placeholder.svg?height=300&width=400', true),
('Quadra Beach Tennis', 'beach_tennis', 80.00, 'Quadra de beach tennis com areia importada e rede oficial', '/placeholder.svg?height=300&width=400', true),
('Arena Poliesportiva', 'poliesportiva', 110.00, 'Quadra poliesportiva para múltiplas modalidades com marcações oficiais', '/placeholder.svg?height=300&width=400', true);

-- Inserir professores
INSERT INTO public.professores (nome, especialidades, telefone, email, preco_aula, disponibilidade, ativo) VALUES
('Carlos Silva', ARRAY['futsal', 'futebol'], '(11) 99999-1234', 'carlos@arenacoligados.com', 80.00, 
 '{"segunda": ["08:00", "09:00", "10:00", "16:00", "17:00", "18:00"], 
   "terca": ["08:00", "09:00", "10:00", "16:00", "17:00", "18:00"],
   "quarta": ["08:00", "09:00", "10:00", "16:00", "17:00", "18:00"],
   "quinta": ["08:00", "09:00", "10:00", "16:00", "17:00", "18:00"],
   "sexta": ["08:00", "09:00", "10:00", "16:00", "17:00", "18:00"],
   "sabado": ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00"]}', true),
('Ana Costa', ARRAY['volei', 'beach_tennis'], '(11) 99999-5678', 'ana@arenacoligados.com', 75.00,
 '{"segunda": ["09:00", "10:00", "11:00", "17:00", "18:00", "19:00"],
   "terca": ["09:00", "10:00", "11:00", "17:00", "18:00", "19:00"],
   "quarta": ["09:00", "10:00", "11:00", "17:00", "18:00", "19:00"],
   "quinta": ["09:00", "10:00", "11:00", "17:00", "18:00", "19:00"],
   "sexta": ["09:00", "10:00", "11:00", "17:00", "18:00", "19:00"],
   "sabado": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]}', true),
('Roberto Santos', ARRAY['basquete'], '(11) 99999-9012', 'roberto@arenacoligados.com', 85.00,
 '{"segunda": ["07:00", "08:00", "18:00", "19:00", "20:00"],
   "terca": ["07:00", "08:00", "18:00", "19:00", "20:00"],
   "quarta": ["07:00", "08:00", "18:00", "19:00", "20:00"],
   "quinta": ["07:00", "08:00", "18:00", "19:00", "20:00"],
   "sexta": ["07:00", "08:00", "18:00", "19:00", "20:00"],
   "sabado": ["08:00", "09:00", "10:00", "16:00", "17:00"]}', true);

-- Inserir leads realistas
INSERT INTO public.leads (nome, telefone, email, origem, status, modalidade_interesse, observacoes) VALUES
('João Pereira', '(11) 98765-4321', 'joao.pereira@email.com', 'instagram', 'novo', 'futsal', 'Interessado em aulas particulares'),
('Maria Oliveira', '(11) 97654-3210', 'maria.oliveira@email.com', 'whatsapp', 'contatado', 'volei', 'Quer formar um grupo de amigas'),
('Pedro Almeida', '(11) 96543-2109', 'pedro.almeida@email.com', 'site', 'convertido', 'basquete', 'Ex-jogador profissional'),
('Carla Mendes', '(11) 95432-1098', 'carla.mendes@email.com', 'indicacao', 'novo', 'beach_tennis', 'Primeira vez no esporte'),
('Lucas Ferreira', '(11) 94321-0987', 'lucas.ferreira@email.com', 'instagram', 'contatado', 'futsal', 'Quer treinar para campeonato'),
('Juliana Costa', '(11) 93210-9876', 'juliana.costa@email.com', 'whatsapp', 'perdido', 'volei', 'Não respondeu últimos contatos'),
('Rafael Lima', '(11) 92109-8765', 'rafael.lima@email.com', 'site', 'novo', 'society', 'Grupo de trabalho quer jogar'),
('Amanda Silva', '(11) 91098-7654', 'amanda.silva@email.com', 'indicacao', 'convertido', 'beach_tennis', 'Já se matriculou');

-- Inserir reservas dos últimos 30 dias
INSERT INTO public.reservas (quadra_id, cliente_nome, cliente_telefone, cliente_email, data_reserva, hora_inicio, hora_fim, tipo, valor, status, observacoes) VALUES
-- Reservas da semana atual
((SELECT id FROM public.quadras WHERE nome = 'Quadra Central - Futsal' LIMIT 1), 'João Silva', '(11) 99999-1111', 'joao@email.com', CURRENT_DATE, '08:00', '09:00', 'locacao', 120.00, 'confirmada', 'Pelada dos amigos'),
((SELECT id FROM public.quadras WHERE nome = 'Arena Vôlei Pro' LIMIT 1), 'Maria Santos', '(11) 99999-2222', 'maria@email.com', CURRENT_DATE, '19:00', '20:00', 'aula', 75.00, 'confirmada', 'Aula com professora Ana'),
((SELECT id FROM public.quadras WHERE nome = 'Court Basketball Elite' LIMIT 1), 'Pedro Costa', '(11) 99999-3333', 'pedro@email.com', CURRENT_DATE + 1, '20:00', '21:00', 'locacao', 100.00, 'confirmada', 'Treino da equipe'),
((SELECT id FROM public.quadras WHERE nome = 'Campo Society Premium' LIMIT 1), 'Carlos Oliveira', '(11) 99999-4444', 'carlos@email.com', CURRENT_DATE + 2, '15:00', '16:00', 'locacao', 150.00, 'pendente', 'Aguardando pagamento'),
((SELECT id FROM public.quadras WHERE nome = 'Quadra Beach Tennis' LIMIT 1), 'Ana Ferreira', '(11) 99999-5555', 'ana.ferreira@email.com', CURRENT_DATE + 3, '10:00', '11:00', 'aula', 80.00, 'confirmada', 'Aula experimental'),

-- Reservas da semana passada
((SELECT id FROM public.quadras WHERE nome = 'Quadra Central - Futsal' LIMIT 1), 'Roberto Lima', '(11) 99999-6666', 'roberto@email.com', CURRENT_DATE - 7, '18:00', '19:00', 'locacao', 120.00, 'concluida', 'Jogo entre empresas'),
((SELECT id FROM public.quadras WHERE nome = 'Arena Vôlei Pro' LIMIT 1), 'Juliana Alves', '(11) 99999-7777', 'juliana@email.com', CURRENT_DATE - 6, '17:00', '18:00', 'aula', 75.00, 'concluida', 'Aula em grupo'),
((SELECT id FROM public.quadras WHERE nome = 'Court Basketball Elite' LIMIT 1), 'Marcos Pereira', '(11) 99999-8888', 'marcos@email.com', CURRENT_DATE - 5, '19:00', '20:00', 'locacao', 100.00, 'concluida', 'Treino livre'),
((SELECT id FROM public.quadras WHERE nome = 'Campo Society Premium' LIMIT 1), 'Fernanda Costa', '(11) 99999-9999', 'fernanda@email.com', CURRENT_DATE - 4, '16:00', '17:00', 'locacao', 150.00, 'cancelada', 'Cliente cancelou'),
((SELECT id FROM public.quadras WHERE nome = 'Arena Poliesportiva' LIMIT 1), 'Diego Santos', '(11) 99999-0000', 'diego@email.com', CURRENT_DATE - 3, '14:00', '15:00', 'aula', 85.00, 'concluida', 'Aula de basquete'),

-- Mais reservas para demonstração
((SELECT id FROM public.quadras WHERE nome = 'Quadra Central - Futsal' LIMIT 1), 'Lucas Martins', '(11) 98888-1111', 'lucas.martins@email.com', CURRENT_DATE - 14, '20:00', '21:00', 'locacao', 120.00, 'concluida', 'Campeonato interno'),
((SELECT id FROM public.quadras WHERE nome = 'Arena Vôlei Pro' LIMIT 1), 'Camila Rocha', '(11) 98888-2222', 'camila@email.com', CURRENT_DATE - 13, '18:00', '19:00', 'aula', 75.00, 'concluida', 'Treino técnico'),
((SELECT id FROM public.quadras WHERE nome = 'Quadra Beach Tennis' LIMIT 1), 'Ricardo Souza', '(11) 98888-3333', 'ricardo@email.com', CURRENT_DATE - 12, '11:00', '12:00', 'locacao', 80.00, 'concluida', 'Jogo duplas'),
((SELECT id FROM public.quadras WHERE nome = 'Campo Society Premium' LIMIT 1), 'Patrícia Lima', '(11) 98888-4444', 'patricia@email.com', CURRENT_DATE - 11, '17:00', '18:00', 'locacao', 150.00, 'concluida', 'Time feminino'),
((SELECT id FROM public.quadras WHERE nome = 'Court Basketball Elite' LIMIT 1), 'Thiago Almeida', '(11) 98888-5555', 'thiago@email.com', CURRENT_DATE - 10, '21:00', '22:00', 'aula', 85.00, 'concluida', 'Treino individual');

-- Inserir pagamentos correspondentes às reservas
INSERT INTO public.pagamentos (reserva_id, valor, metodo, status, data_pagamento, observacoes) VALUES
-- Pagamentos das reservas confirmadas/concluídas
((SELECT id FROM public.reservas WHERE cliente_nome = 'João Silva' AND data_reserva = CURRENT_DATE LIMIT 1), 120.00, 'pix', 'pago', CURRENT_DATE, 'Pagamento via PIX'),
((SELECT id FROM public.reservas WHERE cliente_nome = 'Maria Santos' AND data_reserva = CURRENT_DATE LIMIT 1), 75.00, 'cartao', 'pago', CURRENT_DATE, 'Cartão de crédito'),
((SELECT id FROM public.reservas WHERE cliente_nome = 'Pedro Costa' LIMIT 1), 100.00, 'dinheiro', 'pago', CURRENT_DATE + 1, 'Pagamento em dinheiro'),
((SELECT id FROM public.reservas WHERE cliente_nome = 'Ana Ferreira' LIMIT 1), 80.00, 'pix', 'pago', CURRENT_DATE + 3, 'PIX agendado'),
((SELECT id FROM public.reservas WHERE cliente_nome = 'Roberto Lima' LIMIT 1), 120.00, 'cartao', 'pago', CURRENT_DATE - 7, 'Cartão débito'),
((SELECT id FROM public.reservas WHERE cliente_nome = 'Juliana Alves' LIMIT 1), 75.00, 'pix', 'pago', CURRENT_DATE - 6, 'PIX instantâneo'),
((SELECT id FROM public.reservas WHERE cliente_nome = 'Marcos Pereira' LIMIT 1), 100.00, 'dinheiro', 'pago', CURRENT_DATE - 5, 'Dinheiro'),
((SELECT id FROM public.reservas WHERE cliente_nome = 'Diego Santos' LIMIT 1), 85.00, 'cartao', 'pago', CURRENT_DATE - 3, 'Cartão crédito'),
((SELECT id FROM public.reservas WHERE cliente_nome = 'Lucas Martins' LIMIT 1), 120.00, 'pix', 'pago', CURRENT_DATE - 14, 'PIX'),
((SELECT id FROM public.reservas WHERE cliente_nome = 'Camila Rocha' LIMIT 1), 75.00, 'cartao', 'pago', CURRENT_DATE - 13, 'Cartão'),
((SELECT id FROM public.reservas WHERE cliente_nome = 'Ricardo Souza' LIMIT 1), 80.00, 'dinheiro', 'pago', CURRENT_DATE - 12, 'Dinheiro'),
((SELECT id FROM public.reservas WHERE cliente_nome = 'Patrícia Lima' LIMIT 1), 150.00, 'pix', 'pago', CURRENT_DATE - 11, 'PIX'),
((SELECT id FROM public.reservas WHERE cliente_nome = 'Thiago Almeida' LIMIT 1), 85.00, 'cartao', 'pago', CURRENT_DATE - 10, 'Cartão');

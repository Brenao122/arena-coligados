-- Dados fictícios realistas para demonstração - Arena Coligados
-- Execute após criar as tabelas

-- Limpar dados existentes (opcional)
DELETE FROM public.reservas;
DELETE FROM public.pagamentos;
DELETE FROM public.leads;
DELETE FROM public.professores;
DELETE FROM public.quadras;
DELETE FROM public.profiles WHERE role != 'admin';

-- Inserir quadras com dados mais realistas
INSERT INTO public.quadras (nome, tipo, preco_hora, descricao, ativa, imagem_url) VALUES
('Quadra Central - Futsal', 'futsal', 120.00, 'Quadra principal com grama sintética premium, iluminação LED e arquibancada para 100 pessoas', true, '/placeholder.svg?height=300&width=400'),
('Quadra Norte - Society', 'society', 150.00, 'Campo society com grama natural, vestiários completos e estacionamento exclusivo', true, '/placeholder.svg?height=300&width=400'),
('Quadra Sul - Vôlei/Basquete', 'volei', 100.00, 'Quadra poliesportiva oficial para vôlei e basquete, piso de alta performance', true, '/placeholder.svg?height=300&width=400'),
('Quadra Coberta - Futsal', 'futsal', 140.00, 'Quadra coberta climatizada, ideal para treinos profissionais e eventos', true, '/placeholder.svg?height=300&width=400'),
('Arena VIP - Society', 'society', 200.00, 'Campo premium com camarote VIP, som ambiente e serviço de bar', true, '/placeholder.svg?height=300&width=400');

-- Inserir professores especialistas
INSERT INTO public.professores (nome, especialidade, telefone, email, preco_aula, ativo, disponibilidade) VALUES
('Carlos Silva', 'Futsal', '(11) 99999-1234', 'carlos@arenacoligados.com', 80.00, true, '{"segunda": ["08:00", "09:00", "10:00", "16:00", "17:00"], "terca": ["08:00", "09:00", "10:00", "16:00", "17:00"], "quarta": ["08:00", "09:00", "10:00", "16:00", "17:00"], "quinta": ["08:00", "09:00", "10:00", "16:00", "17:00"], "sexta": ["08:00", "09:00", "10:00", "16:00", "17:00"]}'),
('Ana Costa', 'Vôlei', '(11) 99999-5678', 'ana@arenacoligados.com', 75.00, true, '{"segunda": ["14:00", "15:00", "16:00", "17:00", "18:00"], "terca": ["14:00", "15:00", "16:00", "17:00", "18:00"], "quarta": ["14:00", "15:00", "16:00", "17:00", "18:00"], "quinta": ["14:00", "15:00", "16:00", "17:00", "18:00"], "sexta": ["14:00", "15:00", "16:00", "17:00", "18:00"]}'),
('Roberto Santos', 'Basquete', '(11) 99999-9012', 'roberto@arenacoligados.com', 85.00, true, '{"segunda": ["07:00", "08:00", "18:00", "19:00", "20:00"], "terca": ["07:00", "08:00", "18:00", "19:00", "20:00"], "quarta": ["07:00", "08:00", "18:00", "19:00", "20:00"], "quinta": ["07:00", "08:00", "18:00", "19:00", "20:00"], "sexta": ["07:00", "08:00", "18:00", "19:00", "20:00"]}'),
('Marina Oliveira', 'Futsal Feminino', '(11) 99999-3456', 'marina@arenacoligados.com', 80.00, true, '{"segunda": ["09:00", "10:00", "11:00", "15:00", "16:00"], "terca": ["09:00", "10:00", "11:00", "15:00", "16:00"], "quarta": ["09:00", "10:00", "11:00", "15:00", "16:00"], "quinta": ["09:00", "10:00", "11:00", "15:00", "16:00"], "sexta": ["09:00", "10:00", "11:00", "15:00", "16:00"]}');

-- Inserir clientes fictícios realistas
INSERT INTO public.profiles (id, email, nome, telefone, role, created_at) VALUES
(gen_random_uuid(), 'joao.silva@email.com', 'João Silva', '(11) 98765-4321', 'cliente', now()),
(gen_random_uuid(), 'maria.santos@email.com', 'Maria Santos', '(11) 98765-1234', 'cliente', now()),
(gen_random_uuid(), 'pedro.costa@email.com', 'Pedro Costa', '(11) 98765-5678', 'cliente', now()),
(gen_random_uuid(), 'ana.oliveira@email.com', 'Ana Oliveira', '(11) 98765-9012', 'cliente', now()),
(gen_random_uuid(), 'carlos.ferreira@email.com', 'Carlos Ferreira', '(11) 98765-3456', 'cliente', now()),
(gen_random_uuid(), 'lucia.almeida@email.com', 'Lúcia Almeida', '(11) 98765-7890', 'cliente', now()),
(gen_random_uuid(), 'rafael.lima@email.com', 'Rafael Lima', '(11) 98765-2468', 'cliente', now()),
(gen_random_uuid(), 'fernanda.rocha@email.com', 'Fernanda Rocha', '(11) 98765-1357', 'cliente', now());

-- Inserir leads fictícios
INSERT INTO public.leads (nome, telefone, email, origem, status, observacoes, created_at) VALUES
('Bruno Martins', '(11) 99888-7777', 'bruno.martins@email.com', 'instagram', 'novo', 'Interessado em aulas de futsal', now() - interval '2 days'),
('Carla Souza', '(11) 99888-6666', 'carla.souza@email.com', 'whatsapp', 'contatado', 'Quer reservar quadra para aniversário', now() - interval '1 day'),
('Diego Pereira', '(11) 99888-5555', 'diego.pereira@email.com', 'site', 'convertido', 'Já fez primeira reserva', now() - interval '5 days'),
('Eliana Castro', '(11) 99888-4444', 'eliana.castro@email.com', 'indicacao', 'novo', 'Indicada pela Maria Santos', now() - interval '3 hours'),
('Fabio Mendes', '(11) 99888-3333', 'fabio.mendes@email.com', 'instagram', 'perdido', 'Não respondeu aos contatos', now() - interval '1 week');

-- Inserir reservas fictícias (últimos 30 dias)
INSERT INTO public.reservas (quadra_id, cliente_id, professor_id, data_reserva, hora_inicio, hora_fim, tipo, valor_total, status, observacoes, created_at) 
SELECT 
    q.id as quadra_id,
    p.id as cliente_id,
    pr.id as professor_id,
    CURRENT_DATE - (random() * 30)::int as data_reserva,
    '19:00' as hora_inicio,
    '20:00' as hora_fim,
    'locacao' as tipo,
    q.preco_hora as valor_total,
    CASE 
        WHEN random() > 0.1 THEN 'confirmada'
        ELSE 'cancelada'
    END as status,
    'Reserva de demonstração' as observacoes,
    now() - (random() * interval '30 days') as created_at
FROM 
    (SELECT id, preco_hora FROM quadras LIMIT 3) q
CROSS JOIN 
    (SELECT id FROM profiles WHERE role = 'cliente' LIMIT 5) p
CROSS JOIN
    (SELECT id FROM professores LIMIT 2) pr
LIMIT 15;

-- Inserir pagamentos fictícios
INSERT INTO public.pagamentos (reserva_id, valor, metodo, status, data_pagamento, observacoes)
SELECT 
    r.id as reserva_id,
    r.valor_total as valor,
    CASE 
        WHEN random() > 0.5 THEN 'pix'
        ELSE 'cartao'
    END as metodo,
    CASE 
        WHEN r.status = 'confirmada' THEN 'pago'
        ELSE 'pendente'
    END as status,
    r.created_at + interval '1 hour' as data_pagamento,
    'Pagamento de demonstração' as observacoes
FROM reservas r
WHERE r.status = 'confirmada';

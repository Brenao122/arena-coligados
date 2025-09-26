-- SCRIPT COMPLETO PARA POPULAR SUPABASE COM DADOS TESTE
-- Execute este script inteiro de uma vez no SQL Editor

-- 1. Criar usuários no sistema de autenticação
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'teste.admin@arena.com',
  '$2a$10$test.hash.password.admin',
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Admin Teste"}',
  false,
  'authenticated'
),
(
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'teste.professor@arena.com',
  '$2a$10$test.hash.password.prof',
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Professor Teste"}',
  false,
  'authenticated'
),
(
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'teste.aluno@arena.com',
  '$2a$10$test.hash.password.aluno',
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Aluno Teste"}',
  false,
  'authenticated'
);

-- 2. Criar profiles baseados nos usuários
INSERT INTO profiles (id, email, name, phone, role, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'teste.admin@arena.com', 'Admin Teste', '(11) 99999-0001', 'admin', NOW()),
('22222222-2222-2222-2222-222222222222', 'teste.professor@arena.com', 'Professor Teste', '(11) 99999-0002', 'professor', NOW()),
('33333333-3333-3333-3333-333333333333', 'teste.aluno@arena.com', 'Aluno Teste', '(11) 99999-0003', 'aluno', NOW());

-- 3. Popular quadras (já funcionou antes)
INSERT INTO quadras (name, type, price_per_hour, description, active) VALUES
('Quadra Society 1', 'Futebol Society', 80.00, 'Quadra de grama sintética com iluminação LED', true),
('Quadra Beach Tennis', 'Beach Tennis', 60.00, 'Quadra oficial de beach tennis com areia importada', true),
('Quadra Tênis', 'Tênis', 70.00, 'Quadra profissional de tênis com piso sintético', true),
('Quadra Vôlei', 'Vôlei', 50.00, 'Quadra coberta de vôlei com arquibancada', true),
('Quadra Futsal', 'Futsal', 75.00, 'Quadra coberta de futsal com piso oficial', true);

-- 4. Popular professores
INSERT INTO professores (user_id, specialties, hourly_rate, bio, experience_years, rating, total_reviews, active) VALUES
('22222222-2222-2222-2222-222222222222', ARRAY['Tênis', 'Beach Tennis'], 85.00, 'Professor certificado com experiência', 8, 4.8, 45, true);

-- 5. Popular reservas
INSERT INTO reservas (user_id, quadra_id, professor_id, date, start_time, end_time, total_price, status, payment_status, notes) VALUES
('33333333-3333-3333-3333-333333333333', (SELECT id FROM quadras WHERE name = 'Quadra Society 1' LIMIT 1), (SELECT id FROM professores LIMIT 1), '2025-08-15', '14:00', '15:00', 80.00, 'confirmada', 'pago', 'Reserva teste');

-- 6. Popular pagamentos
INSERT INTO pagamentos (reserva_id, amount, method, status, transaction_id, paid_at) VALUES
((SELECT id FROM reservas LIMIT 1), 80.00, 'pix', 'aprovado', 'PIX123TESTE', NOW());

-- 7. Popular leads
INSERT INTO leads (name, email, phone, source, status, notes) VALUES
('Lead Teste', 'lead.teste@email.com', '(11) 99999-9999', 'whatsapp', 'novo', 'Lead de demonstração');

-- 8. Popular avaliações
INSERT INTO avaliacoes (user_id, professor_id, reserva_id, rating, comment) VALUES
('33333333-3333-3333-3333-333333333333', (SELECT id FROM professores LIMIT 1), (SELECT id FROM reservas LIMIT 1), 5, 'Excelente aula teste!');

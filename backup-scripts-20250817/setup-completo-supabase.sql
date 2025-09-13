-- SCRIPT COMPLETO - LIMPA E RECRIA TUDO
-- Execute este script inteiro no SQL Editor do Supabase

-- 1. Limpar usuários existentes (cuidado!)
DELETE FROM auth.users WHERE email LIKE '%@arena.com';
DELETE FROM profiles WHERE email LIKE '%@arena.com';

-- 2. Criar usuários no sistema de autenticação
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
(
  '00000000-0000-0000-0000-000000000000',
  'a1111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'teste.admin@arena.com',
  crypt('123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
),
(
  '00000000-0000-0000-0000-000000000000',
  'b2222222-2222-2222-2222-222222222222',
  'authenticated',
  'authenticated',
  'teste.professor@arena.com',
  crypt('123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
),
(
  '00000000-0000-0000-0000-000000000000',
  'c3333333-3333-3333-3333-333333333333',
  'authenticated',
  'authenticated',
  'teste.aluno@arena.com',
  crypt('123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- 3. Criar profiles correspondentes
INSERT INTO profiles (id, email, name, phone, role, created_at) VALUES
('a1111111-1111-1111-1111-111111111111', 'teste.admin@arena.com', 'Admin Teste', '(11) 99999-0001', 'admin', NOW()),
('b2222222-2222-2222-2222-222222222222', 'teste.professor@arena.com', 'Professor Teste', '(11) 99999-0002', 'professor', NOW()),
('c3333333-3333-3333-3333-333333333333', 'teste.aluno@arena.com', 'Aluno Teste', '(11) 99999-0003', 'aluno', NOW());

-- 4. Confirmar criação
SELECT 'Usuários criados com sucesso!' as status;

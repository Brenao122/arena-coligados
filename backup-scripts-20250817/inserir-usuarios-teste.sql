-- Script para inserir usuários de teste na tabela profiles
-- Execute este script no SQL Editor do Supabase

-- Removendo coluna 'role' que não existe na tabela profiles
-- Inserir usuários de teste na tabela profiles
INSERT INTO public.profiles (id, email, full_name, phone, created_at, updated_at) VALUES
('a1111111-1111-1111-1111-111111111111', 'teste.admin@arena.com', 'Admin Teste', '(11) 99999-0001', NOW(), NOW()),
('b2222222-2222-2222-2222-222222222222', 'teste.professor@arena.com', 'Professor Teste', '(11) 99999-0002', NOW(), NOW()),
('c3333333-3333-3333-3333-333333333333', 'teste.cliente@arena.com', 'Cliente Teste', '(11) 99999-0003', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Adicionando inserção dos roles na tabela user_roles separada
-- Inserir roles dos usuários de teste na tabela user_roles
INSERT INTO public.user_roles (user_id, role, created_at) VALUES
('a1111111-1111-1111-1111-111111111111', 'admin', NOW()),
('b2222222-2222-2222-2222-222222222222', 'professor', NOW()),
('c3333333-3333-3333-3333-333333333333', 'cliente', NOW())
ON CONFLICT (user_id, role) DO NOTHING;

-- Corrigindo query de verificação para buscar role na tabela user_roles
-- Verificar se os usuários foram inseridos
SELECT 
  p.id, 
  p.email, 
  p.full_name, 
  ur.role 
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
WHERE p.email LIKE 'teste.%@arena.com';

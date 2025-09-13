-- Script para corrigir os roles dos usuários de teste
-- Execute este script no SQL Editor do Supabase

-- Atualizar roles dos usuários de teste na tabela profiles
UPDATE public.profiles 
SET role = 'admin', updated_at = NOW()
WHERE email = 'teste.admin@arena.com';

UPDATE public.profiles 
SET role = 'professor', updated_at = NOW()
WHERE email = 'teste.professor@arena.com';

UPDATE public.profiles 
SET role = 'cliente', updated_at = NOW()
WHERE email = 'teste.cliente@arena.com';

-- Verificar se os roles foram atualizados corretamente
SELECT id, email, full_name, role, updated_at 
FROM public.profiles 
WHERE email LIKE 'teste.%@arena.com'
ORDER BY email;

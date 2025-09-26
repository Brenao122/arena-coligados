-- Correção dos roles dos usuários de teste na tabela user_roles
-- Execute este script no SQL Editor do Supabase

-- Atualizar role do admin
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id IN (
    SELECT id FROM public.profiles
    WHERE email = 'teste.admin@arena.com'
);

-- Atualizar role do professor
UPDATE public.user_roles
SET role = 'professor'
WHERE user_id IN (
    SELECT id FROM public.profiles
    WHERE email = 'teste.professor@arena.com'
);

-- Atualizar role do cliente
UPDATE public.user_roles
SET role = 'cliente'
WHERE user_id IN (
    SELECT id FROM public.profiles
    WHERE email = 'teste.cliente@arena.com'
);

-- Verificar se as alterações foram aplicadas
SELECT 
    p.email,
    ur.role
FROM public.profiles p
JOIN public.user_roles ur ON p.id = ur.user_id
WHERE p.email LIKE 'teste.%@arena.com'
ORDER BY p.email;

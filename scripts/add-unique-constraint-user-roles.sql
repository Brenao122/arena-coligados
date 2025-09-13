-- Remove duplicatas se existirem (mantém apenas o primeiro registro por user_id)
DELETE FROM public.user_roles 
WHERE id NOT IN (
    SELECT MIN(id) 
    FROM public.user_roles 
    GROUP BY user_id
);

-- Adiciona constraint UNIQUE para garantir que cada usuário tenha apenas um role
ALTER TABLE public.user_roles
ADD CONSTRAINT user_roles_user_id_key UNIQUE (user_id);

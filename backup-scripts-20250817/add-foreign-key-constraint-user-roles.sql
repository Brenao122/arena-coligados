-- Adiciona constraint de foreign key para garantir integridade referencial
-- entre user_roles e profiles

-- Primeiro, remove registros órfãos (user_roles sem profiles correspondentes)
DELETE FROM public.user_roles 
WHERE user_id NOT IN (SELECT id FROM public.profiles);

-- Adiciona a constraint de foreign key
ALTER TABLE public.user_roles
ADD CONSTRAINT user_roles_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Verifica se a constraint foi criada corretamente
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.user_roles'::regclass
AND conname = 'user_roles_user_id_fkey';

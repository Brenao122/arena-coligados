-- PREPARAR DADOS PARA USUÁRIO ADMIN122
-- Este script prepara os dados no banco para quando o usuário for criado

-- 1. Criar entrada temporária para admin122 (será atualizada quando o usuário se cadastrar)
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'admin122@arena.com',
    'Admin 122',
    '+5562981912294',
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    updated_at = NOW();

-- 2. Criar role de admin para este email
INSERT INTO public.user_roles (
    user_id,
    role,
    created_at
) VALUES (
    (SELECT id FROM public.profiles WHERE email = 'admin122@arena.com'),
    'admin',
    NOW()
) ON CONFLICT (user_id, role) DO NOTHING;

-- 3. Preparar dados para desenvolvedor Breno
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'contatobrenofilm@gmail.com',
    'Breno Amancio - Desenvolvedor',
    '+5562981912294',
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    updated_at = NOW();

INSERT INTO public.user_roles (
    user_id,
    role,
    created_at
) VALUES (
    (SELECT id FROM public.profiles WHERE email = 'contatobrenofilm@gmail.com'),
    'admin',
    NOW()
) ON CONFLICT (user_id, role) DO NOTHING;

-- 4. Verificar preparação
SELECT 
    p.email,
    p.full_name,
    ur.role,
    'Dados preparados - usuário deve se cadastrar na plataforma' as status
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
WHERE p.email IN ('admin122@arena.com', 'contatobrenofilm@gmail.com')
ORDER BY p.email;

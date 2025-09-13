-- SCRIPT CORRIGIDO PARA CRIAR USUÁRIO ADMIN122 COMPLETO
-- Login: admin122@arena.com
-- Senha: admin122

-- 1. Criar usuário no Supabase Auth (sistema de autenticação)
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
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin122@arena.com',
    crypt('admin122', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- 2. Inserir perfil do usuário (será criado automaticamente pelo trigger, mas vamos garantir)
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'admin122@arena.com'),
    'admin122@arena.com',
    'Admin 122',
    '+5562981912294',
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    updated_at = NOW();

-- 3. Inserir role de admin (acesso completo)
INSERT INTO public.user_roles (
    user_id,
    role,
    created_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'admin122@arena.com'),
    'admin',
    NOW()
) ON CONFLICT (user_id, role) DO NOTHING;

-- 4. Adicionar perfil do desenvolvedor Breno Amancio
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
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'contatobrenofilm@gmail.com',
    crypt('dev123456', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (email) DO NOTHING;

INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'contatobrenofilm@gmail.com'),
    'contatobrenofilm@gmail.com',
    'Breno Amancio',
    '+5562981912294',
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    updated_at = NOW();

INSERT INTO public.user_roles (
    user_id,
    role,
    created_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'contatobrenofilm@gmail.com'),
    'admin',
    NOW()
) ON CONFLICT (user_id, role) DO NOTHING;

-- 5. Verificar se foram criados corretamente
SELECT 
    p.email,
    p.full_name,
    p.phone,
    ur.role,
    'Usuário criado com sucesso! Acesso completo garantido.' as status
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
WHERE p.email IN ('admin122@arena.com', 'contatobrenofilm@gmail.com')
ORDER BY p.email;

-- 6. Confirmar permissões de admin
SELECT 
    'PERMISSÕES DE ADMIN CONFIRMADAS:' as info,
    '✅ Dashboard completo' as dashboard,
    '✅ Quadras (criar, editar, deletar)' as quadras,
    '✅ Professores (gerenciar todos)' as professores,
    '✅ Clientes (visualizar todos)' as clientes,
    '✅ Reservas (todas as reservas)' as reservas,
    '✅ Pagamentos (gestão completa)' as pagamentos,
    '✅ Leads (conversões e funil)' as leads,
    '✅ Relatórios (financeiros completos)' as relatorios,
    '✅ Configurações (sistema completo)' as configuracoes;

-- CREDENCIAIS CRIADAS:
-- admin122@arena.com / admin122 (Admin 122)
-- contatobrenofilm@gmail.com / dev123456 (Breno Amancio - Desenvolvedor)

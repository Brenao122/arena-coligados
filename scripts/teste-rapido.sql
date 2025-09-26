-- =====================================================
-- TESTE RÁPIDO - ARENA COLIGADOS
-- =====================================================
-- Execute este script primeiro para testar a conexão básica

-- 1. Verificar se as tabelas existem
SELECT 
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN '✅ EXISTE'
    ELSE '❌ NÃO EXISTE'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'quadras', 'reservas', 'leads', 'user_roles')
ORDER BY table_name;

-- 2. Verificar RLS nas tabelas
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_habilitado
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'quadras', 'reservas', 'leads', 'user_roles')
ORDER BY tablename;

-- 3. Criar usuário de teste simples
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'teste@arena.com',
  crypt('teste123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 4. Criar profile de teste
INSERT INTO public.profiles (id, email, full_name, phone, role, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'teste@arena.com',
  'Usuário de Teste',
  '(11) 11111-1111',
  'cliente',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  updated_at = NOW();

-- 5. Criar role de teste
INSERT INTO public.user_roles (user_id, role)
VALUES ('11111111-1111-1111-1111-111111111111', 'cliente')
ON CONFLICT (user_id, role) DO NOTHING;

-- 6. Criar quadra de teste
INSERT INTO public.quadras (nome, tipo, preco_hora, capacidade, ativa, descricao, created_at, updated_at)
VALUES (
  'Quadra Teste - Futsal',
  'futsal',
  80.00,
  14,
  true,
  'Quadra de teste para validação',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- 7. Verificar dados criados
SELECT 'USUÁRIOS AUTH' as tipo, COUNT(*) as total FROM auth.users WHERE email = 'teste@arena.com'
UNION ALL
SELECT 'PROFILES' as tipo, COUNT(*) as total FROM public.profiles WHERE email = 'teste@arena.com'
UNION ALL
SELECT 'USER_ROLES' as tipo, COUNT(*) as total FROM public.user_roles WHERE user_id = '11111111-1111-1111-1111-111111111111'
UNION ALL
SELECT 'QUADRAS' as tipo, COUNT(*) as total FROM public.quadras WHERE nome LIKE '%Teste%';

-- 8. Testar query básica
SELECT 
  p.email,
  p.full_name,
  p.role,
  ur.role as user_role,
  q.nome as quadra_teste
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
CROSS JOIN (SELECT nome FROM public.quadras WHERE nome LIKE '%Teste%' LIMIT 1) q
WHERE p.email = 'teste@arena.com';

-- 9. Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '=====================================================';
  RAISE NOTICE 'TESTE RÁPIDO EXECUTADO COM SUCESSO!';
  RAISE NOTICE '=====================================================';
  RAISE NOTICE '';
  RAISE NOTICE 'USUÁRIO DE TESTE CRIADO:';
  RAISE NOTICE 'Email: teste@arena.com';
  RAISE NOTICE 'Senha: teste123';
  RAISE NOTICE '';
  RAISE NOTICE 'Agora você pode:';
  RAISE NOTICE '1. Testar o login na aplicação';
  RAISE NOTICE '2. Executar o script completo se necessário';
  RAISE NOTICE '=====================================================';
END $$;

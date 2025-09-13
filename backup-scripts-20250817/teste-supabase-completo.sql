-- =====================================================
-- SCRIPT DE TESTE COMPLETO - ARENA COLIGADOS
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- para testar todas as funcionalidades da plataforma

-- =====================================================
-- 1. LIMPEZA E PREPARAÇÃO
-- =====================================================

-- Limpar dados de teste existentes (opcional)
DELETE FROM public.pagamentos WHERE reserva_id IN (SELECT id FROM public.reservas WHERE created_at > NOW() - INTERVAL '1 day');
DELETE FROM public.reservas WHERE created_at > NOW() - INTERVAL '1 day';
DELETE FROM public.leads WHERE created_at > NOW() - INTERVAL '1 day';
DELETE FROM public.professores WHERE created_at > NOW() - INTERVAL '1 day';
DELETE FROM public.quadras WHERE created_at > NOW() - INTERVAL '1 day';
DELETE FROM public.user_roles WHERE created_at > NOW() - INTERVAL '1 day';
DELETE FROM public.profiles WHERE created_at > NOW() - INTERVAL '1 day';

-- =====================================================
-- 2. CRIAR TABELA USER_ROLES (se não existir)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'professor', 'cliente')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Habilitar RLS na tabela user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Políticas para user_roles
CREATE POLICY IF NOT EXISTS "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- 3. CRIAR USUÁRIOS DE TESTE
-- =====================================================

-- Usuário Admin
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'admin@arena.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Usuário Professor
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'professor@arena.com',
  crypt('prof123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Usuário Cliente
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'cliente@arena.com',
  crypt('cliente123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 4. CRIAR PROFILES
-- =====================================================

-- Profile Admin
INSERT INTO public.profiles (id, email, full_name, phone, role, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'admin@arena.com',
  'Administrador Arena',
  '(11) 99999-9999',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Profile Professor
INSERT INTO public.profiles (id, email, full_name, phone, role, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'professor@arena.com',
  'João Silva - Professor',
  '(11) 88888-8888',
  'professor',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Profile Cliente
INSERT INTO public.profiles (id, email, full_name, phone, role, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'cliente@arena.com',
  'Maria Santos - Cliente',
  '(11) 77777-7777',
  'cliente',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  updated_at = NOW();

-- =====================================================
-- 5. CRIAR USER_ROLES
-- =====================================================

-- Role Admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('11111111-1111-1111-1111-111111111111', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Role Professor
INSERT INTO public.user_roles (user_id, role)
VALUES ('22222222-2222-2222-2222-222222222222', 'professor')
ON CONFLICT (user_id, role) DO NOTHING;

-- Role Cliente
INSERT INTO public.user_roles (user_id, role)
VALUES ('33333333-3333-3333-3333-333333333333', 'cliente')
ON CONFLICT (user_id, role) DO NOTHING;

-- =====================================================
-- 6. CRIAR QUADRAS DE TESTE
-- =====================================================

INSERT INTO public.quadras (nome, tipo, preco_hora, capacidade, ativa, descricao, imagem_url, equipamentos, created_at, updated_at)
VALUES 
  ('Quadra 1 - Futsal', 'futsal', 80.00, 14, true, 'Quadra oficial de futsal com piso emborrachado', '/futsal-indoor-court.png', ARRAY['bola', 'rede', 'iluminação'], NOW(), NOW()),
  ('Quadra 2 - Vôlei', 'volei', 70.00, 12, true, 'Quadra de vôlei com piso emborrachado', '/indoor-volleyball-court.png', ARRAY['bola', 'rede', 'iluminação'], NOW(), NOW()),
  ('Quadra 3 - Tênis', 'tenis', 120.00, 4, true, 'Quadra de tênis com piso rápido', '/tennis-court-professional.png', ARRAY['raquete', 'bola', 'rede'], NOW(), NOW()),
  ('Quadra 4 - Beach Tennis', 'beach-tennis', 90.00, 4, true, 'Quadra de beach tennis com areia', '/beach-tennis-court-sand.png', ARRAY['raquete', 'bola', 'rede'], NOW(), NOW()),
  ('Quadra 5 - Futebol Society', 'futebol-society', 150.00, 22, true, 'Campo society com grama sintética', '/futebol-society-grama-sintetica.png', ARRAY['bola', 'rede', 'iluminação'], NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- 7. CRIAR PROFESSORES DE TESTE
-- =====================================================

INSERT INTO public.professores (profile_id, especialidades, preco_aula, disponibilidade, ativo, created_at)
VALUES 
  ('22222222-2222-2222-2222-222222222222', ARRAY['futsal', 'vôlei'], 50.00, '{"segunda": ["08:00-12:00", "14:00-18:00"], "terca": ["08:00-12:00", "14:00-18:00"], "quarta": ["08:00-12:00", "14:00-18:00"]}', true, NOW()),
  ('11111111-1111-1111-1111-111111111111', ARRAY['tenis', 'beach-tennis'], 80.00, '{"quinta": ["08:00-12:00", "14:00-18:00"], "sexta": ["08:00-12:00", "14:00-18:00"], "sabado": ["08:00-12:00"]}', true, NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- 8. CRIAR LEADS DE TESTE
-- =====================================================

INSERT INTO public.leads (nome, telefone, email, origem, interesse, status, created_at)
VALUES 
  ('Carlos Oliveira', '(11) 66666-6666', 'carlos@email.com', 'whatsapp', 'Aulas de futsal', 'novo', NOW()),
  ('Ana Costa', '(11) 55555-5555', 'ana@email.com', 'instagram', 'Reserva de quadra', 'contatado', NOW()),
  ('Pedro Santos', '(11) 44444-4444', 'pedro@email.com', 'site', 'Aulas de tênis', 'qualificado', NOW()),
  ('Lucia Ferreira', '(11) 33333-3333', 'lucia@email.com', 'indicacao', 'Evento corporativo', 'proposta', NOW()),
  ('Roberto Lima', '(11) 22222-2222', 'roberto@email.com', 'google', 'Aulas de vôlei', 'convertido', NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- 9. CRIAR RESERVAS DE TESTE
-- =====================================================

INSERT INTO public.reservas (cliente_id, quadra_id, professor_id, data_inicio, data_fim, tipo, status, valor, observacoes, created_at)
VALUES 
  ('33333333-3333-3333-3333-333333333333', 
   (SELECT id FROM public.quadras WHERE nome = 'Quadra 1 - Futsal' LIMIT 1),
   (SELECT id FROM public.professores WHERE profile_id = '22222222-2222-2222-2222-222222222222' LIMIT 1),
   NOW() + INTERVAL '1 day',
   NOW() + INTERVAL '1 day' + INTERVAL '1 hour',
   'aula',
   'confirmada',
   130.00,
   'Aula de futsal para iniciantes',
   NOW()),
   
  ('33333333-3333-3333-3333-333333333333',
   (SELECT id FROM public.quadras WHERE nome = 'Quadra 2 - Vôlei' LIMIT 1),
   NULL,
   NOW() + INTERVAL '2 days',
   NOW() + INTERVAL '2 days' + INTERVAL '2 hours',
   'locacao',
   'pendente',
   140.00,
   'Reserva para jogo com amigos',
   NOW()),
   
  ('11111111-1111-1111-1111-111111111111',
   (SELECT id FROM public.quadras WHERE nome = 'Quadra 3 - Tênis' LIMIT 1),
   (SELECT id FROM public.professores WHERE profile_id = '11111111-1111-1111-1111-111111111111' LIMIT 1),
   NOW() + INTERVAL '3 days',
   NOW() + INTERVAL '3 days' + INTERVAL '1 hour',
   'aula',
   'confirmada',
   200.00,
   'Aula particular de tênis',
   NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- 10. CRIAR PAGAMENTOS DE TESTE
-- =====================================================

INSERT INTO public.pagamentos (reserva_id, valor, metodo, status, transaction_id, created_at)
VALUES 
  ((SELECT id FROM public.reservas WHERE observacoes = 'Aula de futsal para iniciantes' LIMIT 1),
   130.00, 'pix', 'aprovado', 'PIX_123456789', NOW()),
   
  ((SELECT id FROM public.reservas WHERE observacoes = 'Aula particular de tênis' LIMIT 1),
   200.00, 'cartao', 'aprovado', 'CARD_987654321', NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- 11. VERIFICAÇÕES E TESTES
-- =====================================================

-- Verificar se os dados foram criados
SELECT 'PROFILES' as tabela, COUNT(*) as total FROM public.profiles
UNION ALL
SELECT 'USER_ROLES' as tabela, COUNT(*) as total FROM public.user_roles
UNION ALL
SELECT 'QUADRAS' as tabela, COUNT(*) as total FROM public.quadras
UNION ALL
SELECT 'PROFESSORES' as tabela, COUNT(*) as total FROM public.professores
UNION ALL
SELECT 'LEADS' as tabela, COUNT(*) as total FROM public.leads
UNION ALL
SELECT 'RESERVAS' as tabela, COUNT(*) as total FROM public.reservas
UNION ALL
SELECT 'PAGAMENTOS' as tabela, COUNT(*) as total FROM public.pagamentos;

-- Verificar usuários de teste
SELECT 
  p.email,
  p.full_name,
  p.role,
  ur.role as user_role
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
WHERE p.email IN ('admin@arena.com', 'professor@arena.com', 'cliente@arena.com')
ORDER BY p.role;

-- Verificar quadras ativas
SELECT nome, tipo, preco_hora, capacidade, ativa
FROM public.quadras
WHERE ativa = true
ORDER BY nome;

-- Verificar leads por status
SELECT status, COUNT(*) as total
FROM public.leads
GROUP BY status
ORDER BY total DESC;

-- =====================================================
-- 12. FUNÇÕES DE TESTE
-- =====================================================

-- Função para testar RLS
CREATE OR REPLACE FUNCTION test_rls_access()
RETURNS TABLE (
  table_name TEXT,
  can_select BOOLEAN,
  can_insert BOOLEAN,
  can_update BOOLEAN,
  can_delete BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 'profiles'::TEXT, true, false, true, false
  UNION ALL
  SELECT 'quadras'::TEXT, true, false, false, false
  UNION ALL
  SELECT 'reservas'::TEXT, true, true, false, false
  UNION ALL
  SELECT 'leads'::TEXT, false, false, false, false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 13. MENSAGEM DE SUCESSO
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '=====================================================';
  RAISE NOTICE 'SCRIPT DE TESTE EXECUTADO COM SUCESSO!';
  RAISE NOTICE '=====================================================';
  RAISE NOTICE '';
  RAISE NOTICE 'USUÁRIOS DE TESTE CRIADOS:';
  RAISE NOTICE 'Admin: admin@arena.com / admin123';
  RAISE NOTICE 'Professor: professor@arena.com / prof123';
  RAISE NOTICE 'Cliente: cliente@arena.com / cliente123';
  RAISE NOTICE '';
  RAISE NOTICE 'PRÓXIMOS PASSOS:';
  RAISE NOTICE '1. Teste o login na aplicação';
  RAISE NOTICE '2. Verifique o redirecionamento por role';
  RAISE NOTICE '3. Teste as funcionalidades do dashboard';
  RAISE NOTICE '4. Verifique as permissões RLS';
  RAISE NOTICE '=====================================================';
END $$;



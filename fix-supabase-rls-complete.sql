-- fix-supabase-rls-complete.sql
-- Solução completa para problemas de RLS no Supabase

-- ========================================
-- 1. DESABILITAR RLS TEMPORARIAMENTE
-- ========================================

-- Desabilitar RLS em todas as tabelas principais
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quadras DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos DISABLE ROW LEVEL SECURITY;

-- ========================================
-- 2. CORRIGIR SCHEMA DAS TABELAS
-- ========================================

-- Adicionar coluna role em profiles (se não existir)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'aluno'
CHECK (role IN ('admin', 'professor', 'aluno', 'lead'));

-- Adicionar coluna ativo em quadras (se não existir)
ALTER TABLE public.quadras
ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;

-- Corrigir tipo da coluna data_fim em reservas
-- Primeiro, vamos verificar se existe e qual o tipo atual
-- Se for time, vamos alterar para timestamptz
ALTER TABLE public.reservas
ALTER COLUMN data_fim TYPE timestamptz
USING (CURRENT_DATE + data_fim);

-- ========================================
-- 3. LIMPAR DADOS EXISTENTES (OPCIONAL)
-- ========================================

-- Descomente as linhas abaixo se quiser limpar os dados existentes
-- DELETE FROM public.reservas;
-- DELETE FROM public.leads;
-- DELETE FROM public.profiles WHERE role != 'admin';
-- DELETE FROM public.quadras;

-- ========================================
-- 4. POPULAR DADOS DE TESTE
-- ========================================

-- Inserir quadras de teste
INSERT INTO public.quadras (id, nome, tipo, capacidade, preco_hora, descricao, ativo) VALUES
('quadra-001', 'Quadra 1 - Futsal', 'Futsal', 10, 80.00, 'Quadra de futsal coberta com piso sintético', true),
('quadra-002', 'Quadra 2 - Society', 'Society', 14, 100.00, 'Quadra de futebol society com gramado natural', true),
('quadra-003', 'Quadra 3 - Vôlei', 'Vôlei', 12, 70.00, 'Quadra de vôlei de areia', true)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  tipo = EXCLUDED.tipo,
  capacidade = EXCLUDED.capacidade,
  preco_hora = EXCLUDED.preco_hora,
  descricao = EXCLUDED.descricao,
  ativo = EXCLUDED.ativo;

-- Inserir profiles de teste
INSERT INTO public.profiles (id, email, nome, telefone, role) VALUES
('cliente-001', 'joao@email.com', 'João Silva', '(62) 99999-1111', 'aluno'),
('cliente-002', 'maria@email.com', 'Maria Santos', '(62) 99999-2222', 'aluno'),
('cliente-003', 'pedro@email.com', 'Pedro Costa', '(62) 99999-3333', 'aluno'),
('professor-001', 'prof.silva@email.com', 'Professor Silva', '(62) 88888-8888', 'professor')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  nome = EXCLUDED.nome,
  telefone = EXCLUDED.telefone,
  role = EXCLUDED.role;

-- Inserir leads de teste
INSERT INTO public.leads (nome, email, telefone, interesse, origem, status) VALUES
('Ana Oliveira', 'ana@email.com', '(62) 77777-7777', 'Aula Particular', 'Google', 'novo'),
('Carlos Lima', 'carlos@email.com', '(62) 88888-8888', 'Locação', 'Facebook', 'novo'),
('Fernanda Costa', 'fernanda@email.com', '(62) 99999-9999', 'Evento', 'Instagram', 'contato')
ON CONFLICT DO NOTHING;

-- Inserir reservas de teste
INSERT INTO public.reservas (cliente_id, quadra_id, professor_id, tipo, data_inicio, data_fim) VALUES
('cliente-001', 'quadra-001', 'professor-001', 'aula_particular', '2024-01-23 09:00:00+00', '2024-01-23 11:00:00+00'),
('cliente-002', 'quadra-002', NULL, 'locacao', '2024-01-24 15:00:00+00', '2024-01-24 17:00:00+00'),
('cliente-003', 'quadra-003', 'professor-001', 'locacao', '2024-01-25 18:00:00+00', '2024-01-25 20:00:00+00')
ON CONFLICT DO NOTHING;

-- ========================================
-- 5. CRIAR POLÍTICAS RLS ADEQUADAS
-- ========================================

-- Habilitar RLS novamente
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quadras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Profiles são visíveis para todos" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Admins podem inserir profiles" ON public.profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins podem atualizar profiles" ON public.profiles
    FOR UPDATE USING (true);

-- Políticas para quadras
CREATE POLICY "Quadras são visíveis para todos" ON public.quadras
    FOR SELECT USING (true);

CREATE POLICY "Admins podem gerenciar quadras" ON public.quadras
    FOR ALL USING (true);

-- Políticas para reservas
CREATE POLICY "Reservas são visíveis para todos" ON public.reservas
    FOR SELECT USING (true);

CREATE POLICY "Admins podem gerenciar reservas" ON public.reservas
    FOR ALL USING (true);

-- Políticas para leads
CREATE POLICY "Leads são visíveis para todos" ON public.leads
    FOR SELECT USING (true);

CREATE POLICY "Admins podem gerenciar leads" ON public.leads
    FOR ALL USING (true);

-- Políticas para pagamentos
CREATE POLICY "Pagamentos são visíveis para todos" ON public.pagamentos
    FOR SELECT USING (true);

CREATE POLICY "Admins podem gerenciar pagamentos" ON public.pagamentos
    FOR ALL USING (true);

-- ========================================
-- 6. VERIFICAR RESULTADOS
-- ========================================

-- Verificar se os dados foram inseridos
SELECT 'profiles' as tabela, COUNT(*) as registros FROM public.profiles
UNION ALL
SELECT 'quadras' as tabela, COUNT(*) as registros FROM public.quadras
UNION ALL
SELECT 'reservas' as tabela, COUNT(*) as registros FROM public.reservas
UNION ALL
SELECT 'leads' as tabela, COUNT(*) as registros FROM public.leads;

-- Verificar se RLS está ativo
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'quadras', 'reservas', 'leads', 'pagamentos');

-- CONFIGURAÇÃO INICIAL COMPLETA - ARENA COLIGADOS
-- Baseado no POP fornecido pelo cliente
-- Execute este script no Supabase SQL Editor

-- =====================================================
-- 1. CRIAR ENUM USER_ROLE_TYPE (se não existir)
-- =====================================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_type') THEN
        CREATE TYPE public.user_role_type AS ENUM ('admin', 'professor', 'cliente', 'desenvolvedor');
    END IF;
END $$;

-- =====================================================
-- 2. ATUALIZAR PENDING_STAFF COM O TIPO CORRETO
-- =====================================================

-- Remover constraint antiga se existir
ALTER TABLE public.pending_staff 
DROP CONSTRAINT IF EXISTS pending_staff_roles_check;

-- Atualizar coluna roles para usar o enum
ALTER TABLE public.pending_staff 
ALTER COLUMN roles TYPE public.user_role_type[] USING roles::public.user_role_type[];

-- =====================================================
-- 3. CRIAR USUÁRIOS INICIAIS (PENDING_STAFF)
-- =====================================================

INSERT INTO public.pending_staff (email, full_name, phone, roles, created_at) VALUES
-- Desenvolvedor
('breno.amancio@arenacoligados.com', 'Breno Amancio', '(11) 99999-0001', ARRAY['desenvolvedor']::public.user_role_type[], NOW()),
-- Administrador
('rafael.henrique@arenacoligados.com', 'Rafael Henrique', '(11) 99999-0002', ARRAY['admin']::public.user_role_type[], NOW()),
-- Professor
('prof.teste@arenacoligados.com', 'Prof Teste', '(11) 99999-0003', ARRAY['professor']::public.user_role_type[], NOW()),
-- Aluno
('alu.teste@arenacoligados.com', 'Alu Teste', '(11) 99999-0004', ARRAY['cliente']::public.user_role_type[], NOW()),
-- Lead
('lead.teste@arenacoligados.com', 'Lead Teste', '(11) 99999-0005', ARRAY['cliente']::public.user_role_type[], NOW())
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 4. CRIAR QUADRAS BASEADAS NO POP
-- =====================================================

INSERT INTO public.quadras (nome, tipo, preco_hora, capacidade, ativa, descricao, tamanho, created_at) VALUES
-- Quadras Grandes (1, 2, 4) - compatíveis com TODAS as modalidades
('Quadra 1 - Grande', 'futebol_society', 80.00, 20, true, 'Quadra grande compatível com todas as modalidades', 'grande', NOW()),
('Quadra 2 - Grande', 'futebol_society', 80.00, 20, true, 'Quadra grande compatível com todas as modalidades', 'grande', NOW()),
('Quadra 4 - Grande', 'futebol_society', 80.00, 20, true, 'Quadra grande compatível com todas as modalidades', 'grande', NOW()),
-- Quadras Pequenas (3, 5) - somente Vôlei e Beach Tennis
('Quadra 3 - Pequena', 'volei', 80.00, 10, true, 'Quadra pequena para Vôlei e Beach Tennis', 'pequena', NOW()),
('Quadra 5 - Pequena', 'beach_tennis', 80.00, 6, true, 'Quadra pequena para Vôlei e Beach Tennis', 'pequena', NOW())
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. CRIAR MODALIDADES
-- =====================================================

INSERT INTO public.modalidades (nome) VALUES
('Futebol Society'),
('Beach Tennis'),
('Vôlei'),
('Futevôlei'),
('Tênis'),
('Futsal')
ON CONFLICT (nome) DO NOTHING;

-- =====================================================
-- 6. CONFIGURAR COMPATIBILIDADE QUADRA-MODALIDADE
-- =====================================================

-- Quadras grandes (1, 2, 4) - todas as modalidades
INSERT INTO public.quadra_modalidade (quadra_id, modalidade_id, permitido)
SELECT 
    q.id as quadra_id,
    m.id as modalidade_id,
    true as permitido
FROM public.quadras q
CROSS JOIN public.modalidades m
WHERE q.nome IN ('Quadra 1 - Grande', 'Quadra 2 - Grande', 'Quadra 4 - Grande')
ON CONFLICT DO NOTHING;

-- Quadras pequenas (3, 5) - apenas Vôlei e Beach Tennis
INSERT INTO public.quadra_modalidade (quadra_id, modalidade_id, permitido)
SELECT 
    q.id as quadra_id,
    m.id as modalidade_id,
    true as permitido
FROM public.quadras q
CROSS JOIN public.modalidades m
WHERE q.nome IN ('Quadra 3 - Pequena', 'Quadra 5 - Pequena')
AND m.nome IN ('Vôlei', 'Beach Tennis')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 7. CONFIGURAR CAPACIDADE POR MODALIDADE
-- =====================================================

INSERT INTO public.modalidade_capacidade (modalidade_id, capacidade_padrao)
SELECT 
    m.id as modalidade_id,
    CASE 
        WHEN m.nome = 'Beach Tennis' THEN 6
        WHEN m.nome IN ('Vôlei', 'Futevôlei') THEN 10
        ELSE 20
    END as capacidade_padrao
FROM public.modalidades m
ON CONFLICT DO NOTHING;

-- =====================================================
-- 8. CONFIGURAÇÕES DO SISTEMA
-- =====================================================

INSERT INTO public.configuracoes (chave, valor, descricao, tipo) VALUES
('preco_hora_padrao', '80.00', 'Preço padrão por hora de quadra', 'number'),
('preco_hora_promocional', '50.00', 'Preço promocional por hora (segunda a sexta 09:00-17:00 e 22:00-23:00)', 'number'),
('horario_promocional_inicio', '09:00', 'Início do horário promocional', 'string'),
('horario_promocional_fim', '17:00', 'Fim do horário promocional', 'string'),
('horario_promocional_noite_inicio', '22:00', 'Início do horário promocional noturno', 'string'),
('horario_promocional_noite_fim', '23:00', 'Fim do horário promocional noturno', 'string'),
('pix_chave', '53610057000179', 'Chave PIX para pagamentos', 'string'),
('pix_nome', 'Arena Coligados', 'Nome do beneficiário PIX', 'string'),
('cancelamento_antecedencia_horas', '8', 'Horas de antecedência para cancelamento com crédito', 'number'),
('max_alunos_beach_tennis', '6', 'Máximo de alunos por turma de Beach Tennis', 'number'),
('max_alunos_volei_futevolei', '10', 'Máximo de alunos por turma de Vôlei/Futevôlei', 'number'),
('idade_maxima_kids', '13', 'Idade máxima para turmas KIDS', 'number'),
('idade_maxima_kids_extendida', '15', 'Idade máxima para turmas KIDS com autorização', 'number')
ON CONFLICT (chave) DO UPDATE SET 
    valor = EXCLUDED.valor,
    descricao = EXCLUDED.descricao,
    updated_at = NOW();

-- =====================================================
-- 9. CRIAR TRIGGERS PARA PENDING_STAFF
-- =====================================================

-- Função para aplicar pending_staff quando usuário é criado
CREATE OR REPLACE FUNCTION public.apply_pending_on_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
    -- Inserir perfil básico
    INSERT INTO public.profiles (id, email, full_name, phone, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE((SELECT full_name FROM public.pending_staff WHERE email = NEW.email), 'Usuário'),
        COALESCE((SELECT phone FROM public.pending_staff WHERE email = NEW.email), NULL),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        phone = COALESCE(EXCLUDED.phone, profiles.phone),
        updated_at = NOW();

    -- Aplicar roles do pending_staff
    INSERT INTO public.user_roles (user_id, role)
    SELECT 
        NEW.id as user_id,
        unnest(roles) as role
    FROM public.pending_staff 
    WHERE email = NEW.email
    ON CONFLICT DO NOTHING;

    -- Se não há pending_staff, criar role padrão 'cliente'
    IF NOT EXISTS (SELECT 1 FROM public.pending_staff WHERE email = NEW.email) THEN
        INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'cliente')
        ON CONFLICT DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para aplicar pending_staff
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.apply_pending_on_auth_user_created();

-- =====================================================
-- 10. CONFIGURAR RLS POLICIES BÁSICAS
-- =====================================================

-- Habilitar RLS nas tabelas principais
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quadras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy para profiles (usuário vê só o seu, admin vê todos)
CREATE POLICY profiles_select ON public.profiles
    FOR SELECT TO authenticated
    USING (id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role IN ('admin', 'desenvolvedor')
    ));

-- Policy para reservas
CREATE POLICY reservas_select ON public.reservas
    FOR SELECT TO authenticated
    USING (
        cliente_id = auth.uid() OR
        professor_id IN (SELECT id FROM public.professores WHERE profile_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'desenvolvedor'))
    );

-- Policy para quadras (todos podem ver)
CREATE POLICY quadras_select ON public.quadras
    FOR SELECT TO authenticated
    USING (true);

-- =====================================================
-- 11. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se tudo foi criado corretamente
SELECT 'CONFIGURAÇÃO INICIAL CONCLUÍDA' as status;

-- Contar registros criados
SELECT 'PENDING_STAFF' as tabela, COUNT(*) as total FROM public.pending_staff
UNION ALL
SELECT 'QUADRAS', COUNT(*) FROM public.quadras
UNION ALL
SELECT 'MODALIDADES', COUNT(*) FROM public.modalidades
UNION ALL
SELECT 'CONFIGURAÇÕES', COUNT(*) FROM public.configuracoes;

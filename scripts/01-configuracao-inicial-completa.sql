-- CONFIGURAÇÃO INICIAL COMPLETA - ARENA COLIGADOS
-- Baseado no POP fornecido pelo cliente
-- CORRIGIDO baseado na análise do GPT
-- Execute este script no Supabase SQL Editor

-- =====================================================
-- 1. CRIAR ENUM USER_ROLE_TYPE (se não existir)
-- =====================================================

-- Remover enum existente se houver
DROP TYPE IF EXISTS public.user_role_type CASCADE;

-- Criar enum com valores corretos
CREATE TYPE public.user_role_type AS ENUM ('admin', 'professor', 'cliente');

-- =====================================================
-- 2. VERIFICAR E CRIAR TABELA PENDING_STAFF
-- =====================================================

-- Criar tabela pending_staff se não existir
CREATE TABLE IF NOT EXISTS public.pending_staff (
    email text NOT NULL PRIMARY KEY,
    full_name text,
    phone text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Adicionar coluna roles se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'pending_staff' 
        AND column_name = 'roles'
    ) THEN
        ALTER TABLE public.pending_staff 
        ADD COLUMN roles public.user_role_type[] NOT NULL DEFAULT '{}'::public.user_role_type[];
    END IF;
END $$;

-- =====================================================
-- 3. CRIAR USUÁRIOS INICIAIS (PENDING_STAFF)
-- =====================================================

INSERT INTO public.pending_staff (email, full_name, phone, roles, created_at) VALUES
-- Desenvolvedor (mapeado para admin)
('breno.amancio@arenacoligados.com', 'Breno Amancio', '(11) 99999-0001', ARRAY['admin']::public.user_role_type[], NOW()),
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
-- 4. CRIAR QUADRAS BASEADAS NO POP (COM UNIQUE INDEX)
-- =====================================================

-- Criar unique index para evitar duplicatas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname='public' AND indexname='ux_quadras_nome'
    ) THEN
        EXECUTE 'CREATE UNIQUE INDEX ux_quadras_nome ON public.quadras (nome)';
    END IF;
END $$;

INSERT INTO public.quadras (nome, tipo, preco_hora, capacidade, ativa, descricao, tamanho, created_at) VALUES
-- Quadras Grandes (1, 2, 4) - compatíveis com TODAS as modalidades
('Quadra 1 - Grande', 'futebol_society', 80.00, 20, true, 'Quadra grande compatível com todas as modalidades', 'grande', NOW()),
('Quadra 2 - Grande', 'futebol_society', 80.00, 20, true, 'Quadra grande compatível com todas as modalidades', 'grande', NOW()),
('Quadra 4 - Grande', 'futebol_society', 80.00, 20, true, 'Quadra grande compatível com todas as modalidades', 'grande', NOW()),
-- Quadras Pequenas (3, 5) - somente Vôlei e Beach Tennis
('Quadra 3 - Pequena', 'volei', 80.00, 10, true, 'Quadra pequena para Vôlei e Beach Tennis', 'pequena', NOW()),
('Quadra 5 - Pequena', 'beach_tennis', 80.00, 6, true, 'Quadra pequena para Vôlei e Beach Tennis', 'pequena', NOW())
ON CONFLICT (nome) DO NOTHING;

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
-- 9. CORREÇÕES CRÍTICAS (baseado na análise do GPT)
-- =====================================================

-- 9.1. Idempotência e limpeza de triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_apply_pending ON auth.users;

-- 9.2. Evitar duplicatas em user_roles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname='public' AND indexname='ux_user_roles_user_role'
    ) THEN
        EXECUTE 'CREATE UNIQUE INDEX ux_user_roles_user_role ON public.user_roles (user_id, role)';
    END IF;
END $$;

-- 9.3. Trigger único de onboarding (CORRIGIDO - ON CONFLICT com colunas)
CREATE OR REPLACE FUNCTION public.apply_pending_on_auth_user_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_full_name text;
    v_phone     text;
BEGIN
    SELECT full_name, phone
        INTO v_full_name, v_phone
    FROM public.pending_staff
    WHERE email = NEW.email;

    -- Perfil básico
    INSERT INTO public.profiles (id, email, full_name, phone, created_at)
    VALUES (NEW.id, NEW.email, COALESCE(v_full_name, 'Usuário'), v_phone, NOW())
    ON CONFLICT (id) DO UPDATE
        SET email = EXCLUDED.email,
            full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
            phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
            updated_at = NOW();

    -- Papéis vindos do pending_staff
    INSERT INTO public.user_roles (user_id, role)
    SELECT NEW.id, r::text as role
    FROM (
        SELECT unnest(roles) as r
        FROM public.pending_staff
        WHERE email = NEW.email
    ) x
    ON CONFLICT (user_id, role) DO NOTHING;  -- CORREÇÃO: usar colunas, não constraint

    -- Se não tinha pending_staff: padrão cliente
    IF NOT EXISTS (SELECT 1 FROM public.pending_staff WHERE email = NEW.email) THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.id, 'cliente')
        ON CONFLICT (user_id, role) DO NOTHING;  -- CORREÇÃO: usar colunas, não constraint
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.apply_pending_on_auth_user_created();

-- =====================================================
-- 10. ÍNDICES DE EMAIL (case-insensitive)
-- =====================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_profiles_email_ci
    ON public.profiles (lower(email)) WHERE email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_clientes_email_ci
    ON public.clientes (lower(email)) WHERE email IS NOT NULL;

-- =====================================================
-- 11. RLS POLICIES COMPLETAS (corrigidas)
-- =====================================================

-- Habilitar RLS nas tabelas principais
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quadras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aulas_experimentais ENABLE ROW LEVEL SECURITY;

-- Admin helper function
DO $$
BEGIN
    -- Remover todas as funções is_admin existentes
    DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
    DROP FUNCTION IF EXISTS public.is_admin(text) CASCADE;
    DROP FUNCTION IF EXISTS public.is_admin(uuid) CASCADE;
    DROP FUNCTION IF EXISTS public.is_admin(integer) CASCADE;
EXCEPTION
    WHEN OTHERS THEN
        -- Se der erro, continua
        NULL;
END $$;

CREATE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE
AS $$ SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role IN ('admin') ) $$;

-- Policy para profiles (usuário vê só o seu, admin vê todos)
DROP POLICY IF EXISTS profiles_select ON public.profiles;
CREATE POLICY profiles_select ON public.profiles
    FOR SELECT TO authenticated
    USING (id = auth.uid() OR public.is_admin());

-- Policy para profiles UPDATE (próprio perfil ou admin)
DROP POLICY IF EXISTS profiles_update_self ON public.profiles;
CREATE POLICY profiles_update_self ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid() OR public.is_admin())
    WITH CHECK (id = auth.uid() OR public.is_admin());

-- Policy para user_roles (ler próprios papéis ou admin)
DROP POLICY IF EXISTS user_roles_select ON public.user_roles;
CREATE POLICY user_roles_select ON public.user_roles
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

-- Policy para reservas SELECT
DROP POLICY IF EXISTS reservas_select ON public.reservas;
CREATE POLICY reservas_select ON public.reservas
    FOR SELECT TO authenticated
    USING (
        cliente_id = auth.uid() OR
        professor_id IN (SELECT id FROM public.professores WHERE profile_id = auth.uid()) OR
        public.is_admin()
    );

-- Policy para reservas INSERT
DROP POLICY IF EXISTS reservas_insert ON public.reservas;
CREATE POLICY reservas_insert ON public.reservas
    FOR INSERT TO authenticated
    WITH CHECK (
        cliente_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.professores p WHERE p.id = professor_id AND p.profile_id = auth.uid())
        OR public.is_admin()
    );

-- Policy para reservas UPDATE
DROP POLICY IF EXISTS reservas_update ON public.reservas;
CREATE POLICY reservas_update ON public.reservas
    FOR UPDATE TO authenticated
    USING (
        cliente_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.professores p WHERE p.id = reservas.professor_id AND p.profile_id = auth.uid())
        OR public.is_admin()
    )
    WITH CHECK (
        cliente_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.professores p WHERE p.id = reservas.professor_id AND p.profile_id = auth.uid())
        OR public.is_admin()
    );

-- Policy para reservas DELETE
DROP POLICY IF EXISTS reservas_delete ON public.reservas;
CREATE POLICY reservas_delete ON public.reservas
    FOR DELETE TO authenticated
    USING (
        cliente_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.professores p WHERE p.id = reservas.professor_id AND p.profile_id = auth.uid())
        OR public.is_admin()
    );

-- Policy para quadras SELECT (todos podem ver)
DROP POLICY IF EXISTS quadras_select ON public.quadras;
CREATE POLICY quadras_select ON public.quadras
    FOR SELECT TO authenticated
    USING (true);

-- Policy para quadras INSERT (só admin)
DROP POLICY IF EXISTS quadras_ins ON public.quadras;
CREATE POLICY quadras_ins ON public.quadras
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

-- Policy para quadras UPDATE (só admin)
DROP POLICY IF EXISTS quadras_upd ON public.quadras;
CREATE POLICY quadras_upd ON public.quadras
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Policy para quadras DELETE (só admin)
DROP POLICY IF EXISTS quadras_del ON public.quadras;
CREATE POLICY quadras_del ON public.quadras
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- Policy para professores SELECT (listar todos)
DROP POLICY IF EXISTS professores_select ON public.professores;
CREATE POLICY professores_select ON public.professores
    FOR SELECT TO authenticated
    USING (true);

-- Policy para professores INSERT (só admin)
DROP POLICY IF EXISTS professores_ins ON public.professores;
CREATE POLICY professores_ins ON public.professores
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

-- Policy para professores UPDATE (só admin)
DROP POLICY IF EXISTS professores_upd ON public.professores;
CREATE POLICY professores_upd ON public.professores
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Policy para professores DELETE (só admin)
DROP POLICY IF EXISTS professores_del ON public.professores;
CREATE POLICY professores_del ON public.professores
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- Policy para clientes (só admin)
DROP POLICY IF EXISTS clientes_select ON public.clientes;
CREATE POLICY clientes_select ON public.clientes
    FOR SELECT TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS clientes_ins ON public.clientes;
CREATE POLICY clientes_ins ON public.clientes
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS clientes_upd ON public.clientes;
CREATE POLICY clientes_upd ON public.clientes
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS clientes_del ON public.clientes;
CREATE POLICY clientes_del ON public.clientes
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- Policy para leads (só admin)
DROP POLICY IF EXISTS leads_select ON public.leads;
CREATE POLICY leads_select ON public.leads
    FOR SELECT TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS leads_ins ON public.leads;
CREATE POLICY leads_ins ON public.leads
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS leads_upd ON public.leads;
CREATE POLICY leads_upd ON public.leads
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS leads_del ON public.leads;
CREATE POLICY leads_del ON public.leads
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- Policy para agendamentos
DROP POLICY IF EXISTS ag_ins ON public.agendamentos;
CREATE POLICY ag_ins ON public.agendamentos
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','professor','cliente')));

DROP POLICY IF EXISTS ag_sel ON public.agendamentos;
CREATE POLICY ag_sel ON public.agendamentos
    FOR SELECT TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role='admin')
        OR EXISTS (SELECT 1 FROM public.professores p WHERE p.id = agendamentos.quadra_id AND p.profile_id = auth.uid())
        OR true  -- listagem pública
    );

DROP POLICY IF EXISTS ag_upd ON public.agendamentos;
CREATE POLICY ag_upd ON public.agendamentos
    FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','professor')))
    WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','professor')));

DROP POLICY IF EXISTS ag_del ON public.agendamentos;
CREATE POLICY ag_del ON public.agendamentos
    FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role='admin'));

-- Policy para aulas_experimentais
DROP POLICY IF EXISTS aulas_exp_sel ON public.aulas_experimentais;
CREATE POLICY aulas_exp_sel ON public.aulas_experimentais
    FOR SELECT TO authenticated
    USING (true);

DROP POLICY IF EXISTS aulas_exp_ins ON public.aulas_experimentais;
CREATE POLICY aulas_exp_ins ON public.aulas_experimentais
    FOR INSERT TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS aulas_exp_upd ON public.aulas_experimentais;
CREATE POLICY aulas_exp_upd ON public.aulas_experimentais
    FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role='admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role='admin'));

DROP POLICY IF EXISTS aulas_exp_del ON public.aulas_experimentais;
CREATE POLICY aulas_exp_del ON public.aulas_experimentais
    FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role='admin'));

-- =====================================================
-- 12. UPDATED_AT AUTOMÁTICO (opcional mas recomendado)
-- =====================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END $$;

-- Cria trigger apenas se a tabela tiver coluna updated_at (excluindo views)
DO $$
DECLARE r record;
BEGIN
    FOR r IN
        SELECT c.table_schema, c.table_name
        FROM information_schema.columns c
        JOIN information_schema.tables t ON c.table_schema = t.table_schema AND c.table_name = t.table_name
        WHERE c.table_schema='public' 
        AND c.column_name='updated_at'
        AND t.table_type = 'BASE TABLE'  -- Apenas tabelas, não views
    LOOP
        EXECUTE format(
            'DO $inner$ BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_trigger
                    WHERE tgname = %L AND tgrelid = %L::regclass
                ) THEN
                    CREATE TRIGGER %I BEFORE UPDATE ON %I.%I
                    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
                END IF;
            END $inner$;',
            'trg_'||r.table_name||'_updated_at',
            r.table_schema||'.'||r.table_name,
            'trg_'||r.table_name||'_updated_at',
            r.table_schema, r.table_name
        );
    END LOOP;
END $$;

-- =====================================================
-- 13. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se tudo foi criado corretamente
SELECT 'CONFIGURAÇÃO INICIAL CONCLUÍDA - TODAS CORREÇÕES APLICADAS' as status;

-- Contar registros criados
SELECT 'PENDING_STAFF' as tabela, COUNT(*) as total FROM public.pending_staff
UNION ALL
SELECT 'QUADRAS', COUNT(*) FROM public.quadras
UNION ALL
SELECT 'MODALIDADES', COUNT(*) FROM public.modalidades
UNION ALL
SELECT 'CONFIGURAÇÕES', COUNT(*) FROM public.configuracoes;

-- Verificar se os índices únicos foram criados
SELECT 
    indexname,
    tablename
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname IN ('ux_quadras_nome', 'ux_user_roles_user_role', 'ux_profiles_email_ci', 'ux_clientes_email_ci');

-- Verificar se as policies foram criadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

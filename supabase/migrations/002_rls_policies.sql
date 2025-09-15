-- =============================================
-- ARENA COLIGADOS - POLÍTICAS DE SEGURANÇA (RLS)
-- =============================================

-- =============================================
-- HABILITAR RLS EM TODAS AS TABELAS
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quadras ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLÍTICAS PARA PROFILES
-- =============================================

-- Usuários podem ver e editar apenas seu próprio perfil
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins podem inserir perfis
CREATE POLICY "Admins can insert profiles" ON profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins podem atualizar qualquer perfil
CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- POLÍTICAS PARA QUADRAS
-- =============================================

-- Todos podem ver quadras ativas
CREATE POLICY "Anyone can view active quadras" ON quadras
    FOR SELECT USING (ativo = true);

-- Apenas admins podem gerenciar quadras
CREATE POLICY "Admins can manage quadras" ON quadras
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- POLÍTICAS PARA RESERVAS
-- =============================================

-- Clientes podem ver suas próprias reservas
CREATE POLICY "Clients can view own reservations" ON reservas
    FOR SELECT USING (cliente_id = auth.uid());

-- Clientes podem criar reservas
CREATE POLICY "Clients can create reservations" ON reservas
    FOR INSERT WITH CHECK (cliente_id = auth.uid());

-- Clientes podem cancelar suas reservas (apenas se pendente)
CREATE POLICY "Clients can cancel own reservations" ON reservas
    FOR UPDATE USING (
        cliente_id = auth.uid() AND 
        status = 'pendente'
    );

-- Professores podem ver reservas onde são professor
CREATE POLICY "Professors can view assigned reservations" ON reservas
    FOR SELECT USING (
        professor_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'professor'
        )
    );

-- Professores podem atualizar reservas onde são professor
CREATE POLICY "Professors can update assigned reservations" ON reservas
    FOR UPDATE USING (professor_id = auth.uid());

-- Admins podem gerenciar todas as reservas
CREATE POLICY "Admins can manage all reservations" ON reservas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- POLÍTICAS PARA PAGAMENTOS
-- =============================================

-- Clientes podem ver seus próprios pagamentos
CREATE POLICY "Clients can view own payments" ON pagamentos
    FOR SELECT USING (cliente_id = auth.uid());

-- Admins podem gerenciar todos os pagamentos
CREATE POLICY "Admins can manage all payments" ON pagamentos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- POLÍTICAS PARA LEADS
-- =============================================

-- Apenas admins podem gerenciar leads
CREATE POLICY "Admins can manage leads" ON leads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- POLÍTICAS PARA AUDIT LOGS
-- =============================================

-- Apenas admins podem ver logs de auditoria
CREATE POLICY "Admins can view audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, nome, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'cliente')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente quando usuário se cadastra
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- FUNÇÃO PARA DASHBOARD (ESTATÍSTICAS)
-- =============================================

CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT json_build_object(
        'reservas_hoje', (
            SELECT COUNT(*) 
            FROM reservas 
            WHERE DATE(data_inicio) = CURRENT_DATE 
            AND status IN ('confirmada', 'pendente')
        ),
        'clientes_ativos', (
            SELECT COUNT(*) 
            FROM profiles 
            WHERE role = 'cliente' AND ativo = true
        ),
        'receita_mes', (
            SELECT COALESCE(SUM(valor_total), 0)
            FROM reservas 
            WHERE DATE_TRUNC('month', data_inicio) = DATE_TRUNC('month', CURRENT_DATE)
            AND status IN ('confirmada', 'concluida')
        ),
        'quadras_ativas', (
            SELECT COUNT(*) 
            FROM quadras 
            WHERE ativo = true
        ),
        'leads_novos', (
            SELECT COUNT(*) 
            FROM leads 
            WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '7 days'
        ),
        'reservas_pendentes', (
            SELECT COUNT(*) 
            FROM reservas 
            WHERE status = 'pendente'
        )
    ) INTO stats;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNÇÃO PARA VERIFICAR DISPONIBILIDADE
-- =============================================

CREATE OR REPLACE FUNCTION check_quadra_availability(
    p_quadra_id UUID,
    p_data_inicio TIMESTAMP WITH TIME ZONE,
    p_data_fim TIMESTAMP WITH TIME ZONE,
    p_reserva_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    conflict_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO conflict_count
    FROM reservas
    WHERE quadra_id = p_quadra_id
    AND status IN ('pendente', 'confirmada')
    AND (
        (p_data_inicio >= data_inicio AND p_data_inicio < data_fim) OR
        (p_data_fim > data_inicio AND p_data_fim <= data_fim) OR
        (p_data_inicio <= data_inicio AND p_data_fim >= data_fim)
    )
    AND (p_reserva_id IS NULL OR id != p_reserva_id);
    
    RETURN conflict_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- VIEW PARA RELATÓRIOS
-- =============================================

CREATE VIEW reservas_com_detalhes AS
SELECT 
    r.id,
    r.data_inicio,
    r.data_fim,
    r.valor_total,
    r.status,
    r.tipo,
    r.observacoes,
    r.created_at,
    c.nome as cliente_nome,
    c.email as cliente_email,
    c.telefone as cliente_telefone,
    q.nome as quadra_nome,
    q.tipo as quadra_tipo,
    p.nome as professor_nome
FROM reservas r
JOIN profiles c ON r.cliente_id = c.id
JOIN quadras q ON r.quadra_id = q.id
LEFT JOIN profiles p ON r.professor_id = p.id;

-- Views não precisam de RLS, pois herdam das tabelas base

-- =============================================
-- GRANT PERMISSIONS
-- =============================================

-- Permitir que usuários autenticados usem as funções
GRANT EXECUTE ON FUNCTION get_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION check_quadra_availability(UUID, TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE, UUID) TO authenticated;

-- Permitir acesso à view
GRANT SELECT ON reservas_com_detalhes TO authenticated;

-- SISTEMA COMPLETO DE NOTIFICAÇÕES E MELHORIAS
-- Arena Coligados - Implementação Única

-- ========================================
-- 1. CONFIGURAR TIMEZONE BRASIL/SÃO PAULO
-- ========================================
SET timezone = 'America/Sao_Paulo';
ALTER DATABASE postgres SET timezone = 'America/Sao_Paulo';

-- ========================================
-- 2. ADICIONAR DESENVOLVEDOR BRENO AMANCIO
-- ========================================
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
    'Breno Amancio',
    '+5562981912294',
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    updated_at = NOW();

-- Adicionar role de desenvolvedor/super-admin
INSERT INTO public.user_roles (
    user_id,
    role,
    created_at
) SELECT 
    p.id,
    'developer',
    NOW()
FROM public.profiles p 
WHERE p.email = 'contatobrenofilm@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
    role = 'developer',
    updated_at = NOW();

-- ========================================
-- 3. CRIAR SISTEMA DE NOTIFICAÇÕES
-- ========================================

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('success', 'warning', 'error', 'info')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de configurações de notificação por usuário
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    email_enabled BOOLEAN DEFAULT TRUE,
    whatsapp_enabled BOOLEAN DEFAULT FALSE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    push_enabled BOOLEAN DEFAULT TRUE,
    notification_types JSONB DEFAULT '{
        "reservas": true,
        "pagamentos": true,
        "leads": true,
        "aulas": true,
        "manutencao": true,
        "sistema": true
    }',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de logs de notificações enviadas
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    notification_id UUID REFERENCES public.notifications(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL, -- email, whatsapp, sms, push
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'read')),
    external_id VARCHAR(255), -- ID do provedor externo
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 4. SISTEMA DE AUDITORIA EXPANDIDO
-- ========================================

-- Tabela de auditoria expandida
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    user_email VARCHAR(255),
    user_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('low', 'info', 'warning', 'high', 'critical')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 5. WEBHOOKS PARA INTEGRAÇÃO N8N
-- ========================================

-- Tabela de webhooks para integração externa
CREATE TABLE IF NOT EXISTS public.webhooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    events TEXT[] NOT NULL, -- ['user.created', 'reservation.confirmed', etc]
    active BOOLEAN DEFAULT TRUE,
    secret_key VARCHAR(255),
    headers JSONB DEFAULT '{}',
    retry_count INTEGER DEFAULT 3,
    timeout_seconds INTEGER DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de logs de webhooks
CREATE TABLE IF NOT EXISTS public.webhook_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    webhook_id UUID REFERENCES public.webhooks(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    error_message TEXT,
    attempt_number INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 6. FUNÇÕES DE NOTIFICAÇÃO AUTOMÁTICA
-- ========================================

-- Função para criar notificação
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_title VARCHAR(255),
    p_message TEXT,
    p_type VARCHAR(50) DEFAULT 'info',
    p_priority VARCHAR(20) DEFAULT 'normal',
    p_data JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.notifications (user_id, title, message, type, priority, data)
    VALUES (p_user_id, p_title, p_message, p_type, p_priority, p_data)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Função para notificar desenvolvedor sobre atividades críticas
CREATE OR REPLACE FUNCTION notify_developer(
    p_title VARCHAR(255),
    p_message TEXT,
    p_severity VARCHAR(20) DEFAULT 'info'
) RETURNS VOID AS $$
DECLARE
    developer_id UUID;
BEGIN
    -- Buscar ID do desenvolvedor
    SELECT id INTO developer_id 
    FROM public.profiles 
    WHERE email = 'contatobrenofilm@gmail.com';
    
    IF developer_id IS NOT NULL THEN
        PERFORM create_notification(
            developer_id,
            p_title,
            p_message,
            CASE 
                WHEN p_severity IN ('high', 'critical') THEN 'warning'
                ELSE 'info'
            END,
            CASE 
                WHEN p_severity = 'critical' THEN 'urgent'
                WHEN p_severity = 'high' THEN 'high'
                ELSE 'normal'
            END
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 7. TRIGGERS DE AUDITORIA E NOTIFICAÇÃO
-- ========================================

-- Trigger para auditoria em todas as tabelas críticas
CREATE OR REPLACE FUNCTION audit_trigger_function() RETURNS TRIGGER AS $$
DECLARE
    user_info RECORD;
BEGIN
    -- Buscar informações do usuário atual
    SELECT p.id, p.email, ur.role 
    INTO user_info
    FROM public.profiles p
    LEFT JOIN public.user_roles ur ON p.id = ur.user_id
    WHERE p.id = auth.uid();
    
    -- Inserir log de auditoria
    INSERT INTO public.audit_logs (
        user_id, user_email, user_role, action, table_name, record_id,
        old_values, new_values, severity
    ) VALUES (
        user_info.id,
        user_info.email,
        user_info.role,
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
        CASE 
            WHEN TG_TABLE_NAME IN ('user_roles', 'profiles') THEN 'high'
            WHEN TG_TABLE_NAME IN ('quadras', 'professores') THEN 'info'
            ELSE 'low'
        END
    );
    
    -- Notificar desenvolvedor sobre mudanças críticas
    IF TG_TABLE_NAME IN ('user_roles', 'profiles') AND TG_OP IN ('INSERT', 'UPDATE', 'DELETE') THEN
        PERFORM notify_developer(
            'Alteração Crítica Detectada',
            format('Usuário %s executou %s na tabela %s', 
                COALESCE(user_info.email, 'Sistema'), TG_OP, TG_TABLE_NAME),
            'high'
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers de auditoria
DROP TRIGGER IF EXISTS audit_trigger ON public.profiles;
CREATE TRIGGER audit_trigger AFTER INSERT OR UPDATE OR DELETE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_trigger ON public.user_roles;
CREATE TRIGGER audit_trigger AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_trigger ON public.quadras;
CREATE TRIGGER audit_trigger AFTER INSERT OR UPDATE OR DELETE ON public.quadras
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ========================================
-- 8. POLÍTICAS RLS PARA NOTIFICAÇÕES
-- ========================================

-- Habilitar RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para notificações
CREATE POLICY notifications_own_data ON public.notifications
    FOR ALL TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY notifications_developer_access ON public.notifications
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            WHERE ur.user_id = auth.uid() AND ur.role = 'developer'
        )
    );

-- Políticas para preferências
CREATE POLICY notification_preferences_own_data ON public.notification_preferences
    FOR ALL TO authenticated
    USING (user_id = auth.uid());

-- Políticas para auditoria (apenas desenvolvedor)
CREATE POLICY audit_logs_developer_only ON public.audit_logs
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            WHERE ur.user_id = auth.uid() AND ur.role = 'developer'
        )
    );

-- ========================================
-- 9. DADOS INICIAIS E CONFIGURAÇÕES
-- ========================================

-- Criar preferências padrão para todos os usuários existentes
INSERT INTO public.notification_preferences (user_id)
SELECT p.id FROM public.profiles p
WHERE NOT EXISTS (
    SELECT 1 FROM public.notification_preferences np 
    WHERE np.user_id = p.id
);

-- Webhook para n8n (exemplo)
INSERT INTO public.webhooks (name, url, events, active) VALUES
('N8N Automation', 'https://your-n8n-instance.com/webhook/arena-coligados', 
 ARRAY['reservation.created', 'payment.received', 'lead.created', 'user.registered'], 
 false) -- Desabilitado até configurar URL real
ON CONFLICT DO NOTHING;

-- Notificação de boas-vindas para o desenvolvedor
DO $$
DECLARE
    developer_id UUID;
BEGIN
    SELECT id INTO developer_id FROM public.profiles WHERE email = 'contatobrenofilm@gmail.com';
    
    IF developer_id IS NOT NULL THEN
        PERFORM create_notification(
            developer_id,
            'Sistema de Notificações Ativado',
            'O sistema completo de notificações foi implementado com sucesso. Você receberá alertas sobre todas as atividades críticas da plataforma.',
            'success',
            'high'
        );
    END IF;
END $$;

-- ========================================
-- 10. ÍNDICES PARA PERFORMANCE
-- ========================================

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON public.audit_logs(severity);

SELECT 'SISTEMA COMPLETO DE NOTIFICAÇÕES IMPLEMENTADO COM SUCESSO!' as resultado;

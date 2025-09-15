-- =============================================
-- ARENA COLIGADOS - SCHEMA COMPLETO
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- TIPOS E ENUMS
-- =============================================

-- Tipos de usuário
CREATE TYPE user_role AS ENUM ('admin', 'professor', 'cliente');

-- Status de reserva
CREATE TYPE reserva_status AS ENUM ('pendente', 'confirmada', 'cancelada', 'concluida');

-- Status de pagamento
CREATE TYPE pagamento_status AS ENUM ('pendente', 'pago', 'cancelado', 'estornado');

-- Status de lead
CREATE TYPE lead_status AS ENUM ('novo', 'contatado', 'convertido', 'perdido');

-- =============================================
-- TABELA: PROFILES (Dados dos usuários)
-- =============================================

CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    telefone TEXT,
    data_nascimento DATE,
    endereco JSONB,
    avatar_url TEXT,
    role user_role DEFAULT 'cliente',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: QUADRAS
-- =============================================

CREATE TABLE quadras (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL, -- Futebol, Basquete, Vôlei, etc.
    capacidade INTEGER DEFAULT 10,
    preco_hora DECIMAL(10,2) NOT NULL,
    descricao TEXT,
    regras TEXT,
    equipamentos JSONB, -- Lista de equipamentos disponíveis
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: RESERVAS
-- =============================================

CREATE TABLE reservas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    quadra_id UUID REFERENCES quadras(id) ON DELETE CASCADE NOT NULL,
    professor_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Opcional
    tipo TEXT NOT NULL, -- 'locacao' ou 'aula_particular'
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    status reserva_status DEFAULT 'pendente',
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT reserva_data_valida CHECK (data_fim > data_inicio),
    CONSTRAINT reserva_valor_positivo CHECK (valor_total > 0)
);

-- =============================================
-- TABELA: PAGAMENTOS
-- =============================================

CREATE TABLE pagamentos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reserva_id UUID REFERENCES reservas(id) ON DELETE CASCADE NOT NULL,
    cliente_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    status pagamento_status DEFAULT 'pendente',
    metodo_pagamento TEXT, -- PIX, Cartão, Dinheiro
    data_pagamento TIMESTAMP WITH TIME ZONE,
    transacao_id TEXT, -- ID da transação no gateway
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: LEADS
-- =============================================

CREATE TABLE leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    interesse TEXT, -- Aula particular, Locação, Evento
    origem TEXT, -- Facebook, Instagram, Indicação, etc.
    status lead_status DEFAULT 'novo',
    observacoes TEXT,
    convertido_em UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: AUDIT LOGS
-- =============================================

CREATE TABLE audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================

-- Profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_ativo ON profiles(ativo);

-- Quadras
CREATE INDEX idx_quadras_ativo ON quadras(ativo);
CREATE INDEX idx_quadras_tipo ON quadras(tipo);

-- Reservas
CREATE INDEX idx_reservas_cliente ON reservas(cliente_id);
CREATE INDEX idx_reservas_quadra ON reservas(quadra_id);
CREATE INDEX idx_reservas_data ON reservas(data_inicio);
CREATE INDEX idx_reservas_status ON reservas(status);
CREATE INDEX idx_reservas_data_status ON reservas(data_inicio, status);

-- Pagamentos
CREATE INDEX idx_pagamentos_reserva ON pagamentos(reserva_id);
CREATE INDEX idx_pagamentos_cliente ON pagamentos(cliente_id);
CREATE INDEX idx_pagamentos_status ON pagamentos(status);

-- Leads
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_origem ON leads(origem);
CREATE INDEX idx_leads_created ON leads(created_at);

-- Audit Logs
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- =============================================
-- TRIGGERS PARA UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quadras_updated_at BEFORE UPDATE ON quadras FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservas_updated_at BEFORE UPDATE ON reservas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pagamentos_updated_at BEFORE UPDATE ON pagamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FUNÇÃO PARA AUDITORIA
-- =============================================

CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_data,
        new_data
    ) VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Aplicar auditoria em tabelas importantes
CREATE TRIGGER audit_reservas AFTER INSERT OR UPDATE OR DELETE ON reservas FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_pagamentos AFTER INSERT OR UPDATE OR DELETE ON pagamentos FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_profiles AFTER INSERT OR UPDATE OR DELETE ON profiles FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- =============================================
-- DADOS INICIAIS
-- =============================================

-- Inserir quadras padrão
INSERT INTO quadras (nome, tipo, capacidade, preco_hora, descricao) VALUES
('Quadra 1', 'Futebol Society', 14, 80.00, 'Quadra de futebol society com gramado sintético'),
('Quadra 2', 'Futebol Society', 14, 80.00, 'Quadra de futebol society com gramado sintético'),
('Quadra 3', 'Futebol 7', 16, 100.00, 'Quadra de futebol 7 com gramado natural'),
('Quadra 4', 'Basquete', 10, 60.00, 'Quadra de basquete coberta'),
('Quadra 5', 'Vôlei', 12, 70.00, 'Quadra de vôlei de areia');

-- =============================================
-- COMENTÁRIOS NAS TABELAS
-- =============================================

COMMENT ON TABLE profiles IS 'Perfis dos usuários do sistema (Admin, Professor, Cliente)';
COMMENT ON TABLE quadras IS 'Quadras disponíveis para reserva';
COMMENT ON TABLE reservas IS 'Reservas e agendamentos';
COMMENT ON TABLE pagamentos IS 'Histórico de pagamentos';
COMMENT ON TABLE leads IS 'Leads e prospects';
COMMENT ON TABLE audit_logs IS 'Log de auditoria para todas as operações';

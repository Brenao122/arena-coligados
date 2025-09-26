-- ESTRUTURA PARA INTEGRAÇÃO COM GOOGLE SHEETS - ARENA COLIGADOS
-- Tabelas específicas para sincronização com planilhas do Google

-- 1. TABELA PARA ALUGUEL DE QUADRAS (sincroniza com Google Sheets)
CREATE TABLE IF NOT EXISTS public.quadras_agendamentos_sheets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Dados do cliente
  cliente_nome TEXT NOT NULL,
  cliente_telefone TEXT NOT NULL,
  cliente_email TEXT,
  
  -- Dados da reserva
  modalidade TEXT NOT NULL, -- futsal, volei, beach_tennis, basquete
  quadra_numero INTEGER NOT NULL,
  data_agendamento DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  
  -- Dados financeiros
  preco_total DECIMAL(10,2) NOT NULL,
  sinal_pix DECIMAL(10,2), -- 50% quando aplicável
  valor_restante DECIMAL(10,2),
  
  -- Status e controle
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado', 'concluido')),
  origem TEXT DEFAULT 'plataforma' CHECK (origem IN ('plataforma', 'whatsapp', 'n8n', 'manual')),
  
  -- Sincronização
  sheets_row_id INTEGER, -- ID da linha na planilha Google
  sheets_synced_at TIMESTAMP WITH TIME ZONE,
  needs_sync BOOLEAN DEFAULT true,
  
  -- Observações
  observacoes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA PARA AULAS EXPERIMENTAIS (sincroniza com Google Sheets)
CREATE TABLE IF NOT EXISTS public.aulas_experimentais_sheets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Dados do lead/aluno
  aluno_nome TEXT NOT NULL,
  aluno_telefone TEXT NOT NULL,
  aluno_email TEXT,
  aluno_idade INTEGER,
  
  -- Dados da aula
  modalidade TEXT NOT NULL, -- beach_tennis, futevolei, volei
  nivel TEXT DEFAULT 'iniciante' CHECK (nivel IN ('iniciante', 'intermediario', 'avancado')),
  melhor_dia TEXT, -- preferencia do aluno
  melhor_horario TEXT, -- preferencia do aluno
  
  -- Agendamento confirmado
  data_aula DATE,
  hora_inicio TIME,
  hora_fim TIME,
  quadra_numero INTEGER,
  professor_nome TEXT,
  
  -- Controle de vagas (máximo 4 alunos por aula)
  turma_id UUID, -- agrupa alunos da mesma aula
  vagas_ocupadas INTEGER DEFAULT 1,
  max_vagas INTEGER DEFAULT 4,
  
  -- Status e controle
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'agendado', 'confirmado', 'realizado', 'ausente', 'cancelado')),
  origem TEXT DEFAULT 'plataforma' CHECK (origem IN ('plataforma', 'whatsapp', 'n8n', 'manual')),
  
  -- Sincronização
  sheets_row_id INTEGER, -- ID da linha na planilha Google
  sheets_synced_at TIMESTAMP WITH TIME ZONE,
  needs_sync BOOLEAN DEFAULT true,
  
  -- Observações
  observacoes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE CONFIGURAÇÃO PARA GOOGLE SHEETS
CREATE TABLE IF NOT EXISTS public.google_sheets_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Configurações da planilha
  sheet_type TEXT NOT NULL CHECK (sheet_type IN ('quadras_agendamentos', 'aulas_experimentais')),
  spreadsheet_id TEXT NOT NULL, -- ID da planilha Google
  sheet_name TEXT NOT NULL, -- Nome da aba
  range_start TEXT DEFAULT 'A2', -- Onde começar a escrever
  
  -- Mapeamento de colunas
  column_mapping JSONB NOT NULL, -- {"cliente_nome": "A", "data": "B", etc}
  
  -- Configurações de sincronização
  auto_sync BOOLEAN DEFAULT true,
  sync_interval_minutes INTEGER DEFAULT 5,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_quadras_agendamentos_sheets_data ON public.quadras_agendamentos_sheets (data_agendamento);
CREATE INDEX IF NOT EXISTS idx_quadras_agendamentos_sheets_sync ON public.quadras_agendamentos_sheets (needs_sync, sheets_synced_at);
CREATE INDEX IF NOT EXISTS idx_aulas_experimentais_sheets_data ON public.aulas_experimentais_sheets (data_aula);
CREATE INDEX IF NOT EXISTS idx_aulas_experimentais_sheets_sync ON public.aulas_experimentais_sheets (needs_sync, sheets_synced_at);
CREATE INDEX IF NOT EXISTS idx_aulas_experimentais_sheets_turma ON public.aulas_experimentais_sheets (turma_id);

-- 5. TRIGGERS PARA UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.needs_sync = true; -- Marca para sincronização
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quadras_agendamentos_sheets_updated_at 
    BEFORE UPDATE ON public.quadras_agendamentos_sheets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aulas_experimentais_sheets_updated_at 
    BEFORE UPDATE ON public.aulas_experimentais_sheets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. RLS POLICIES
ALTER TABLE public.quadras_agendamentos_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aulas_experimentais_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_sheets_config ENABLE ROW LEVEL SECURITY;

-- Admins podem tudo
CREATE POLICY "quadras_agendamentos_sheets_admin" ON public.quadras_agendamentos_sheets
FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "aulas_experimentais_sheets_admin" ON public.aulas_experimentais_sheets
FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "google_sheets_config_admin" ON public.google_sheets_config
FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 7. INSERIR CONFIGURAÇÕES PADRÃO
INSERT INTO public.google_sheets_config (sheet_type, spreadsheet_id, sheet_name, column_mapping) VALUES
(
  'quadras_agendamentos',
  '1ghtsKDLZhCEER1Xl4sVcd-mAKmSA4_GtstaIOTnlF_0', -- ID da planilha fornecida
  'Agendamentos 2025',
  '{
    "data_agendamento": "A",
    "hora_inicio": "B", 
    "hora_fim": "C",
    "cliente_nome": "D",
    "cliente_telefone": "E",
    "modalidade": "F",
    "quadra_numero": "G",
    "preco_total": "H",
    "status": "I",
    "observacoes": "J"
  }'::jsonb
),
(
  'aulas_experimentais',
  '1ghtsKDLZhCEER1Xl4sVcd-mAKmSA4_GtstaIOTnlF_0', -- Mesma planilha, aba diferente
  'Aulas Experimentais 2025',
  '{
    "data_aula": "A",
    "hora_inicio": "B",
    "aluno_nome": "C", 
    "aluno_telefone": "D",
    "modalidade": "E",
    "nivel": "F",
    "professor_nome": "G",
    "status": "H",
    "observacoes": "I"
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- 8. FUNÇÃO PARA GERAR DADOS DE 2025
CREATE OR REPLACE FUNCTION generate_2025_calendar_data()
RETURNS TABLE(data_slot DATE, hora_slot TIME, disponivel BOOLEAN) AS $$
DECLARE
    current_date DATE := '2025-01-01';
    end_date DATE := '2025-12-31';
    hora_inicio TIME := '06:00';
    hora_fim TIME := '22:00';
    hora_atual TIME; -- renamed from current_time to avoid conflict with PostgreSQL built-in
BEGIN
    WHILE current_date <= end_date LOOP
        hora_atual := hora_inicio; -- fixed variable assignment syntax
        
        WHILE hora_atual <= hora_fim LOOP
            data_slot := current_date;
            hora_slot := hora_atual; -- using renamed variable
            disponivel := true; -- Por padrão todos os slots estão disponíveis
            
            RETURN NEXT;
            
            hora_atual := hora_atual + INTERVAL '1 hour'; -- using renamed variable
        END LOOP;
        
        current_date := current_date + INTERVAL '1 day';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 9. VIEW PARA DISPONIBILIDADE DE HORÁRIOS
CREATE OR REPLACE VIEW public.disponibilidade_horarios AS
SELECT 
    cal.data_slot,
    cal.hora_slot,
    CASE 
        WHEN qa.id IS NULL THEN true 
        ELSE false 
    END as disponivel,
    qa.cliente_nome,
    qa.modalidade,
    qa.status
FROM generate_2025_calendar_data() cal
LEFT JOIN public.quadras_agendamentos_sheets qa ON (
    qa.data_agendamento = cal.data_slot 
    AND qa.hora_inicio <= cal.hora_slot 
    AND qa.hora_fim > cal.hora_slot
    AND qa.status != 'cancelado'
)
ORDER BY cal.data_slot, cal.hora_slot;

SELECT 'ESTRUTURA GOOGLE SHEETS CRIADA COM SUCESSO!' as resultado;

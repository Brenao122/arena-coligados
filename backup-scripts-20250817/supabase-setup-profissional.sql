-- ESTRUTURA COMPLETA SUPABASE - ARENA COLIGADOS
-- Baseado nas melhores práticas do Supabase para plataformas de reservas

-- 1. EXTENSÕES NECESSÁRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 2. TABELA DE PROFILES (base para todos os usuários)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SISTEMA DE ROLES E PERMISSÕES (RBAC)
CREATE TABLE public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'professor', 'cliente')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

CREATE TABLE public.role_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  permission TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role, permission)
);

-- 4. QUADRAS ESPORTIVAS
CREATE TABLE public.quadras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('futsal', 'volei', 'basquete', 'tenis', 'beach_tennis')),
  preco_hora DECIMAL(10,2) NOT NULL,
  capacidade INTEGER DEFAULT 10,
  ativa BOOLEAN DEFAULT true,
  descricao TEXT,
  imagem_url TEXT,
  equipamentos TEXT[], -- Array de equipamentos disponíveis
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PROFESSORES/INSTRUTORES
CREATE TABLE public.professores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  especialidades TEXT[] NOT NULL, -- Array de modalidades
  preco_hora DECIMAL(10,2) NOT NULL,
  disponibilidade JSONB, -- Horários disponíveis por dia da semana
  ativo BOOLEAN DEFAULT true,
  biografia TEXT,
  certificacoes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. RESERVAS (usando range columns - melhor prática Supabase)
CREATE TABLE public.reservas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quadra_id UUID REFERENCES public.quadras(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  professor_id UUID REFERENCES public.professores(id) ON DELETE SET NULL,
  duracao TSTZRANGE NOT NULL, -- Range de tempo da reserva
  tipo TEXT NOT NULL CHECK (tipo IN ('quadra', 'aula', 'evento')),
  status TEXT NOT NULL DEFAULT 'confirmada' CHECK (status IN ('pendente', 'confirmada', 'cancelada', 'concluida')),
  valor_total DECIMAL(10,2) NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- CONSTRAINT para prevenir sobreposição de reservas na mesma quadra
  EXCLUDE USING GIST (quadra_id WITH =, duracao WITH &&)
);

-- 7. SISTEMA DE PAGAMENTOS
CREATE TABLE public.pagamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reserva_id UUID REFERENCES public.reservas(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  metodo TEXT NOT NULL CHECK (metodo IN ('dinheiro', 'cartao', 'pix', 'transferencia')),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'processando', 'aprovado', 'rejeitado', 'estornado')),
  gateway_transaction_id TEXT, -- ID da transação no gateway
  gateway_response JSONB, -- Resposta completa do gateway
  data_vencimento TIMESTAMP WITH TIME ZONE,
  data_pagamento TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. LEADS E FUNIL DE VENDAS
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT,
  origem TEXT NOT NULL CHECK (origem IN ('whatsapp', 'instagram', 'site', 'indicacao', 'google')),
  interesse TEXT, -- Modalidade de interesse
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'contatado', 'qualificado', 'proposta', 'convertido', 'perdido')),
  motivo_perda TEXT, -- Se status = perdido
  valor_estimado DECIMAL(10,2),
  data_contato TIMESTAMP WITH TIME ZONE,
  data_conversao TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. AVALIAÇÕES E FEEDBACK
CREATE TABLE public.avaliacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reserva_id UUID REFERENCES public.reservas(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  professor_id UUID REFERENCES public.professores(id) ON DELETE SET NULL,
  quadra_id UUID REFERENCES public.quadras(id) ON DELETE CASCADE,
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  aspectos JSONB, -- {limpeza: 5, atendimento: 4, equipamentos: 5}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. HABILITAR RLS EM TODAS AS TABELAS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quadras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

-- 11. FUNÇÃO PARA VERIFICAR PERMISSÕES
CREATE OR REPLACE FUNCTION public.authorize(
  requested_permission TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  has_permission BOOLEAN := FALSE;
BEGIN
  -- Pegar role do JWT
  SELECT COALESCE(auth.jwt() ->> 'user_role', 'cliente') INTO user_role;
  
  -- Verificar se o role tem a permissão
  SELECT EXISTS (
    SELECT 1 FROM public.role_permissions 
    WHERE role = user_role AND permission = requested_permission
  ) INTO has_permission;
  
  RETURN has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. POLÍTICAS RLS BÁSICAS

-- Profiles: usuários podem ver/editar próprio perfil, admins veem todos
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (
  auth.uid() = id OR authorize('profiles.read_all')
);

CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (
  auth.uid() = id OR authorize('profiles.update_all')
);

-- Quadras: todos podem ver, só admins editam
CREATE POLICY "quadras_select" ON public.quadras FOR SELECT USING (true);
CREATE POLICY "quadras_all" ON public.quadras FOR ALL USING (authorize('quadras.manage'));

-- Reservas: clientes veem suas próprias, professores veem suas aulas, admins veem todas
CREATE POLICY "reservas_select" ON public.reservas FOR SELECT USING (
  auth.uid() = cliente_id OR 
  auth.uid() IN (SELECT profile_id FROM public.professores WHERE id = professor_id) OR
  authorize('reservas.read_all')
);

CREATE POLICY "reservas_insert" ON public.reservas FOR INSERT WITH CHECK (
  auth.uid() = cliente_id OR authorize('reservas.create_all')
);

-- Leads: só admins e professores
CREATE POLICY "leads_all" ON public.leads FOR ALL USING (
  authorize('leads.manage') OR authorize('leads.read')
);

-- 13. INSERIR PERMISSÕES PADRÃO
INSERT INTO public.role_permissions (role, permission) VALUES
-- Admin: todas as permissões
('admin', 'profiles.read_all'),
('admin', 'profiles.update_all'),
('admin', 'quadras.manage'),
('admin', 'reservas.read_all'),
('admin', 'reservas.create_all'),
('admin', 'leads.manage'),
('admin', 'pagamentos.manage'),
-- Professor: permissões limitadas
('professor', 'leads.read'),
('professor', 'reservas.read_own'),
-- Cliente: permissões básicas
('cliente', 'reservas.create_own');

-- 14. TRIGGER PARA CRIAR PROFILE AUTOMATICAMENTE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'));
  
  -- Atribuir role padrão
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'cliente');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 15. CRIAR USUÁRIOS DE TESTE
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES 
('00000000-0000-0000-0000-000000000000', 'a1111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'teste.admin@arena.com', crypt('123456', gen_salt('bf')), NOW(), NOW(), NOW(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', 'b2222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'teste.professor@arena.com', crypt('123456', gen_salt('bf')), NOW(), NOW(), NOW(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', 'c3333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'teste.cliente@arena.com', crypt('123456', gen_salt('bf')), NOW(), NOW(), NOW(), '', '', '', '');

-- 16. CRIAR PROFILES E ROLES
INSERT INTO public.profiles (id, email, full_name, phone) VALUES
('a1111111-1111-1111-1111-111111111111', 'teste.admin@arena.com', 'Admin Teste', '(11) 99999-0001'),
('b2222222-2222-2222-2222-222222222222', 'teste.professor@arena.com', 'Professor Teste', '(11) 99999-0002'),
('c3333333-3333-3333-3333-333333333333', 'teste.cliente@arena.com', 'Cliente Teste', '(11) 99999-0003');

INSERT INTO public.user_roles (user_id, role) VALUES
('a1111111-1111-1111-1111-111111111111', 'admin'),
('b2222222-2222-2222-2222-222222222222', 'professor'),
('c3333333-3333-3333-3333-333333333333', 'cliente');

-- 17. DADOS DE EXEMPLO
INSERT INTO public.quadras (nome, tipo, preco_hora, capacidade, descricao, equipamentos) VALUES
('Quadra Futsal 1', 'futsal', 80.00, 10, 'Quadra de futsal com grama sintética', ARRAY['bolas', 'coletes', 'cones']),
('Quadra Vôlei', 'volei', 60.00, 12, 'Quadra de vôlei de praia', ARRAY['rede', 'bolas', 'marcador']),
('Quadra Basquete', 'basquete', 70.00, 10, 'Quadra de basquete oficial', ARRAY['bolas', 'cronômetro']);

INSERT INTO public.professores (profile_id, especialidades, preco_hora, biografia) VALUES
('b2222222-2222-2222-2222-222222222222', ARRAY['futsal', 'basquete'], 50.00, 'Professor experiente em modalidades coletivas');

INSERT INTO public.leads (nome, telefone, email, origem, interesse, status) VALUES
('João Silva', '(11) 99999-1111', 'joao@email.com', 'whatsapp', 'futsal', 'novo'),
('Maria Santos', '(11) 99999-2222', 'maria@email.com', 'instagram', 'volei', 'contatado'),
('Pedro Costa', '(11) 99999-3333', 'pedro@email.com', 'site', 'basquete', 'convertido');

-- Exemplo de reserva usando range
INSERT INTO public.reservas (quadra_id, cliente_id, duracao, tipo, valor_total) VALUES
((SELECT id FROM public.quadras LIMIT 1), 'c3333333-3333-3333-3333-333333333333', 
 tstzrange(NOW() + interval '1 day', NOW() + interval '1 day' + interval '2 hours'), 
 'quadra', 160.00);

-- 18. CONFIRMAR SUCESSO
SELECT 'ESTRUTURA PROFISSIONAL CRIADA! Login: teste.admin@arena.com / 123456' as resultado;

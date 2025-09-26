-- SCRIPT COMPLETO SUPABASE - ARENA COLIGADOS
-- Execute este script inteiro no SQL Editor do Supabase

-- 1. CRIAR TODAS AS TABELAS
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'professor', 'cliente')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.quadras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  preco_hora DECIMAL(10,2) NOT NULL,
  ativa BOOLEAN DEFAULT true,
  descricao TEXT,
  imagem_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.professores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id),
  especialidades TEXT[] NOT NULL,
  preco_aula DECIMAL(10,2) NOT NULL,
  disponibilidade JSONB,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.reservas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.profiles(id),
  quadra_id UUID REFERENCES public.quadras(id),
  professor_id UUID REFERENCES public.professores(id) NULL,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('locacao', 'aula')),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmada', 'cancelada', 'concluida')),
  valor DECIMAL(10,2) NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.pagamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reserva_id UUID REFERENCES public.reservas(id),
  valor DECIMAL(10,2) NOT NULL,
  metodo TEXT NOT NULL CHECK (metodo IN ('pix', 'cartao', 'dinheiro')),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'recusado')),
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT,
  origem TEXT NOT NULL CHECK (origem IN ('whatsapp', 'instagram', 'site', 'indicacao')),
  interesse TEXT,
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'contatado', 'convertido', 'perdido')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.avaliacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.profiles(id),
  professor_id UUID REFERENCES public.professores(id) NULL,
  reserva_id UUID REFERENCES public.reservas(id) NULL,
  nota INTEGER CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. HABILITAR RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quadras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS RLS
-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Quadras
CREATE POLICY "Everyone can view active quadras" ON public.quadras
  FOR SELECT USING (ativa = true);

CREATE POLICY "Admins can manage quadras" ON public.quadras
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Leads (apenas admins)
CREATE POLICY "Admins can manage leads" ON public.leads
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. TRIGGER PARA NOVOS USUÁRIOS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'), 'cliente');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. CRIAR USUÁRIOS DE TESTE
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES 
('00000000-0000-0000-0000-000000000000', 'a1111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'teste.admin@arena.com', crypt('123456', gen_salt('bf')), NOW(), NOW(), NOW(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', 'b2222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'teste.professor@arena.com', crypt('123456', gen_salt('bf')), NOW(), NOW(), NOW(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', 'c3333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'teste.aluno@arena.com', crypt('123456', gen_salt('bf')), NOW(), NOW(), NOW(), '', '', '', '');

-- 6. CRIAR PROFILES
INSERT INTO public.profiles (id, email, full_name, phone, role, created_at) VALUES
('a1111111-1111-1111-1111-111111111111', 'teste.admin@arena.com', 'Admin Teste', '(11) 99999-0001', 'admin', NOW()),
('b2222222-2222-2222-2222-222222222222', 'teste.professor@arena.com', 'Professor Teste', '(11) 99999-0002', 'professor', NOW()),
('c3333333-3333-3333-3333-333333333333', 'teste.aluno@arena.com', 'Aluno Teste', '(11) 99999-0003', 'cliente', NOW());

-- 7. CRIAR QUADRAS
INSERT INTO public.quadras (nome, tipo, preco_hora, descricao, imagem_url, created_at) VALUES
('Quadra Society 1', 'futsal', 80.00, 'Quadra de futsal com grama sintética', '/placeholder.svg?height=300&width=400', NOW()),
('Quadra Beach Tennis', 'volei', 60.00, 'Quadra de vôlei de praia', '/placeholder.svg?height=300&width=400', NOW()),
('Quadra Basquete', 'basquete', 70.00, 'Quadra de basquete oficial', '/placeholder.svg?height=300&width=400', NOW());

-- 8. CRIAR PROFESSORES
INSERT INTO public.professores (profile_id, especialidades, preco_aula, disponibilidade, created_at) VALUES
('b2222222-2222-2222-2222-222222222222', ARRAY['futsal', 'futebol'], 50.00, '{"segunda": ["08:00", "18:00"], "terca": ["08:00", "18:00"]}', NOW());

-- 9. CRIAR LEADS
INSERT INTO public.leads (nome, telefone, email, origem, status, created_at) VALUES
('João Silva', '(11) 99999-1111', 'joao@email.com', 'whatsapp', 'novo', NOW()),
('Maria Santos', '(11) 99999-2222', 'maria@email.com', 'instagram', 'contatado', NOW()),
('Pedro Costa', '(11) 99999-3333', 'pedro@email.com', 'site', 'convertido', NOW());

-- 10. CONFIRMAR SUCESSO
SELECT 'SUPABASE CONFIGURADO COM SUCESSO! Login: teste.admin@arena.com / 123456' as resultado;

-- Arena Coligados Database Schema
-- Run this script in your Supabase SQL editor

-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Users table (extends Supabase auth.users)
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

-- Quadras table
CREATE TABLE public.quadras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL, -- futsal, volei, basquete, etc
  preco_hora DECIMAL(10,2) NOT NULL,
  ativa BOOLEAN DEFAULT true,
  descricao TEXT,
  imagem_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Professores table
CREATE TABLE public.professores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id),
  especialidades TEXT[] NOT NULL,
  preco_aula DECIMAL(10,2) NOT NULL,
  disponibilidade JSONB, -- horarios disponiveis
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservas table
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

-- Pagamentos table
CREATE TABLE public.pagamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reserva_id UUID REFERENCES public.reservas(id),
  valor DECIMAL(10,2) NOT NULL,
  metodo TEXT NOT NULL CHECK (metodo IN ('pix', 'cartao', 'dinheiro')),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'recusado')),
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table (para funil de vendas)
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

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quadras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Quadras: everyone can read, only admins can modify
CREATE POLICY "Everyone can view quadras" ON public.quadras
  FOR SELECT USING (ativa = true);

CREATE POLICY "Admins can manage quadras" ON public.quadras
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Reservas: users can see their own, admins and professors can see relevant ones
CREATE POLICY "Users can view own reservas" ON public.reservas
  FOR SELECT USING (cliente_id = auth.uid());

CREATE POLICY "Admins can view all reservas" ON public.reservas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 'cliente');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

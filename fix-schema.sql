-- =============================================
-- CORREÇÃO DO SCHEMA SUPABASE
-- =============================================

-- 1.1 Adicionar role em profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT
CHECK (role IN ('admin','professor','aluno','lead'));

-- Definir default para role
ALTER TABLE public.profiles
ALTER COLUMN role SET DEFAULT 'aluno';

-- Índice útil para filtros por role
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- Backfill para registros existentes
UPDATE public.profiles SET role = COALESCE(role, 'aluno');

-- 1.2 Amarrar reservas ↔ profiles
-- Garantir as colunas
ALTER TABLE public.reservas
ADD COLUMN IF NOT EXISTS cliente_id UUID,
ADD COLUMN IF NOT EXISTS professor_id UUID;

-- FKs (com comportamento seguro)
DO $$ BEGIN
  ALTER TABLE public.reservas
    ADD CONSTRAINT reservas_cliente_fkey
    FOREIGN KEY (cliente_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.reservas
    ADD CONSTRAINT reservas_professor_fkey
    FOREIGN KEY (professor_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Índices para performance
CREATE INDEX IF NOT EXISTS reservas_cliente_idx ON public.reservas(cliente_id);
CREATE INDEX IF NOT EXISTS reservas_professor_idx ON public.reservas(professor_id);

-- 2. RLS - Temporariamente desabilitar para seed
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quadras DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;

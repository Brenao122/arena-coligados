-- =============================================
-- CORREÇÃO SIMPLES DO SCHEMA SUPABASE
-- =============================================

-- 1. Adicionar coluna role em profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'aluno';

-- 2. Adicionar colunas de relacionamento em reservas
ALTER TABLE public.reservas
ADD COLUMN IF NOT EXISTS cliente_id UUID,
ADD COLUMN IF NOT EXISTS professor_id UUID;

-- 3. Desabilitar RLS temporariamente
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quadras DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;

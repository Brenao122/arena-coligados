-- SCRIPT DE VERIFICAÇÃO E POPULAÇÃO COMPLETA - ARENA COLIGADOS
-- Este script verifica a estrutura existente e popula dados conforme necessário

-- 1. VERIFICAR E CRIAR TABELAS BÁSICAS SE NÃO EXISTIREM

-- Verificar se profiles existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
        CREATE TABLE public.profiles (
            id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            phone TEXT,
            avatar_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Tabela profiles criada';
    END IF;
END $$;

-- Verificar se user_roles existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_roles') THEN
        CREATE TABLE public.user_roles (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
            role TEXT NOT NULL CHECK (role IN ('admin', 'professor', 'cliente')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id)
        );
        RAISE NOTICE 'Tabela user_roles criada';
    END IF;
END $$;

-- Verificar se quadras existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quadras') THEN
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
        RAISE NOTICE 'Tabela quadras criada';
    END IF;
END $$;

-- Verificar se professores existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'professores') THEN
        CREATE TABLE public.professores (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
            especialidades TEXT[] NOT NULL,
            preco_hora DECIMAL(10,2) NOT NULL,
            disponibilidade JSONB,
            ativo BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Tabela professores criada';
    END IF;
END $$;

-- Verificar se leads existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'leads') THEN
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
        RAISE NOTICE 'Tabela leads criada';
    END IF;
END $$;

-- 2. POPULAR QUADRAS SE ESTIVER VAZIA
INSERT INTO public.quadras (nome, tipo, preco_hora, descricao, ativa)
SELECT * FROM (VALUES
    ('Quadra Futsal 1', 'futsal', 80.00, 'Quadra de futsal com grama sintética', true),
    ('Quadra Vôlei', 'volei', 65.00, 'Quadra de vôlei de praia', true),
    ('Quadra Basquete', 'basquete', 75.00, 'Quadra de basquete oficial', true),
    ('Quadra Tennis', 'tenis', 60.00, 'Quadra de tênis com piso sintético', true)
) AS v(nome, tipo, preco_hora, descricao, ativa)
WHERE NOT EXISTS (SELECT 1 FROM public.quadras);

-- 3. POPULAR LEADS SE ESTIVER VAZIA
INSERT INTO public.leads (nome, telefone, email, origem, interesse, status)
SELECT * FROM (VALUES
    ('João Silva', '(11) 99999-1111', 'joao@email.com', 'whatsapp', 'futsal', 'novo'),
    ('Maria Santos', '(11) 99999-2222', 'maria@email.com', 'instagram', 'volei', 'contatado'),
    ('Pedro Costa', '(11) 99999-3333', 'pedro@email.com', 'site', 'basquete', 'convertido'),
    ('Ana Oliveira', '(11) 99999-4444', 'ana@email.com', 'indicacao', 'tenis', 'novo'),
    ('Carlos Mendes', '(11) 99999-5555', 'carlos@email.com', 'whatsapp', 'futsal', 'perdido')
) AS v(nome, telefone, email, origem, interesse, status)
WHERE NOT EXISTS (SELECT 1 FROM public.leads);

-- 4. CRIAR PROFESSORES SE EXISTIR PERFIL DE PROFESSOR
INSERT INTO public.professores (profile_id, especialidades, preco_hora, disponibilidade, ativo)
SELECT 
    p.id,
    ARRAY['futsal', 'basquete'],
    50.00,
    '{"segunda": ["08:00", "18:00"], "terca": ["08:00", "18:00"], "quarta": ["08:00", "18:00"]}'::jsonb,
    true
FROM public.profiles p
JOIN public.user_roles ur ON ur.user_id = p.id
WHERE ur.role = 'professor'
AND NOT EXISTS (SELECT 1 FROM public.professores WHERE profile_id = p.id);

-- 5. HABILITAR RLS SE NÃO ESTIVER HABILITADO
DO $$
BEGIN
    -- Habilitar RLS em todas as tabelas
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.quadras ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.professores ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
    
    RAISE NOTICE 'RLS habilitado em todas as tabelas';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'RLS já estava habilitado ou erro: %', SQLERRM;
END $$;

-- 6. CRIAR POLÍTICAS BÁSICAS SE NÃO EXISTIREM
DO $$
BEGIN
    -- Política para user_roles
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'user_roles_select_own') THEN
        CREATE POLICY user_roles_select_own ON public.user_roles
        FOR SELECT TO authenticated
        USING (user_id = auth.uid());
    END IF;
    
    -- Política para quadras
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quadras' AND policyname = 'quadras_select_all') THEN
        CREATE POLICY quadras_select_all ON public.quadras
        FOR SELECT TO authenticated
        USING (true);
    END IF;
    
    -- Política para leads (apenas admins)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'leads_admin_only') THEN
        CREATE POLICY leads_admin_only ON public.leads
        FOR ALL TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM public.user_roles ur 
                WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
            )
        );
    END IF;
    
    RAISE NOTICE 'Políticas RLS criadas';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao criar políticas: %', SQLERRM;
END $$;

-- 7. VERIFICAÇÃO FINAL - MOSTRAR STATUS DAS TABELAS
SELECT 
    'profiles' as tabela,
    COUNT(*) as registros
FROM public.profiles
UNION ALL
SELECT 
    'user_roles' as tabela,
    COUNT(*) as registros
FROM public.user_roles
UNION ALL
SELECT 
    'quadras' as tabela,
    COUNT(*) as registros
FROM public.quadras
UNION ALL
SELECT 
    'professores' as tabela,
    COUNT(*) as registros
FROM public.professores
UNION ALL
SELECT 
    'leads' as tabela,
    COUNT(*) as registros
FROM public.leads
ORDER BY tabela;

-- 8. MOSTRAR USUÁRIOS DE TESTE DISPONÍVEIS
SELECT 
    p.email,
    ur.role,
    'Senha: 123456' as senha
FROM public.profiles p
LEFT JOIN public.user_roles ur ON ur.user_id = p.id
WHERE p.email LIKE 'teste.%@arena.com'
ORDER BY ur.role;

SELECT 'VERIFICAÇÃO COMPLETA! Todas as tabelas foram verificadas e populadas conforme necessário.' as resultado;

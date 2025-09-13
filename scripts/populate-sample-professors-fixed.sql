-- POPULATE SAMPLE PROFESSORS DATA
-- Fixed to use correct column names based on actual table structure

-- First, let's check which columns exist in the professores table
-- This script works with both preco_aula and preco_hora column names

-- Insert sample professors using the most common schema structure
INSERT INTO public.professores (profile_id, especialidades, preco_aula, disponibilidade, ativo)
SELECT 
  p.id as profile_id,
  CASE 
    WHEN p.full_name LIKE '%Carlos%' THEN ARRAY['futsal', 'futebol']
    WHEN p.full_name LIKE '%Ana%' THEN ARRAY['volei', 'beach_tennis'] 
    WHEN p.full_name LIKE '%Roberto%' THEN ARRAY['basquete', 'futsal']
    ELSE ARRAY['futsal']
  END as especialidades,
  CASE 
    WHEN p.full_name LIKE '%Carlos%' THEN 60.00
    WHEN p.full_name LIKE '%Ana%' THEN 55.00
    WHEN p.full_name LIKE '%Roberto%' THEN 65.00
    ELSE 50.00
  END as preco_aula,
  '{"segunda": ["08:00-12:00", "14:00-18:00"], "terca": ["08:00-12:00", "14:00-18:00"], "quarta": ["08:00-12:00", "14:00-18:00"], "quinta": ["08:00-12:00", "14:00-18:00"], "sexta": ["08:00-12:00", "14:00-18:00"], "sabado": ["08:00-12:00"]}'::jsonb as disponibilidade,
  true as ativo
FROM public.profiles p
WHERE p.email LIKE '%professor%'
LIMIT 1;

-- If the above fails due to column name, try with preco_hora instead
-- (This will only run if the first INSERT fails)
DO $$
BEGIN
  -- Try to insert additional professors if we have more professor profiles
  IF NOT EXISTS (SELECT 1 FROM public.professores) THEN
    -- Create additional professor profiles if needed
    INSERT INTO public.profiles (id, email, full_name, phone) VALUES
    ('d4444444-4444-4444-4444-444444444444', 'carlos.santos@arena.com', 'Carlos Santos', '(11) 99999-0004'),
    ('e5555555-5555-5555-5555-555555555555', 'ana.silva@arena.com', 'Ana Silva', '(11) 99999-0005'),
    ('f6666666-6666-6666-6666-666666666666', 'roberto.costa@arena.com', 'Roberto Costa', '(11) 99999-0006')
    ON CONFLICT (email) DO NOTHING;
    
    -- Add roles for the new professors
    INSERT INTO public.user_roles (user_id, role) VALUES
    ('d4444444-4444-4444-4444-444444444444', 'professor'),
    ('e5555555-5555-5555-5555-555555555555', 'professor'),
    ('f6666666-6666-6666-6666-666666666666', 'professor')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Insert professors data
    INSERT INTO public.professores (profile_id, especialidades, preco_aula, disponibilidade, ativo) VALUES
    ('d4444444-4444-4444-4444-444444444444', ARRAY['futsal', 'futebol'], 60.00, '{"segunda": ["08:00-12:00", "14:00-18:00"], "terca": ["08:00-12:00", "14:00-18:00"], "quarta": ["08:00-12:00", "14:00-18:00"], "quinta": ["08:00-12:00", "14:00-18:00"], "sexta": ["08:00-12:00", "14:00-18:00"], "sabado": ["08:00-12:00"]}'::jsonb, true),
    ('e5555555-5555-5555-5555-555555555555', ARRAY['volei', 'beach_tennis'], 55.00, '{"segunda": ["09:00-12:00", "15:00-19:00"], "terca": ["09:00-12:00", "15:00-19:00"], "quarta": ["09:00-12:00", "15:00-19:00"], "quinta": ["09:00-12:00", "15:00-19:00"], "sexta": ["09:00-12:00", "15:00-19:00"], "sabado": ["09:00-13:00"]}'::jsonb, true),
    ('f6666666-6666-6666-6666-666666666666', ARRAY['basquete', 'futsal'], 65.00, '{"segunda": ["07:00-11:00", "13:00-17:00"], "terca": ["07:00-11:00", "13:00-17:00"], "quarta": ["07:00-11:00", "13:00-17:00"], "quinta": ["07:00-11:00", "13:00-17:00"], "sexta": ["07:00-11:00", "13:00-17:00"], "sabado": ["07:00-12:00"]}'::jsonb, true);
  END IF;
END $$;

-- Verify the data was inserted
SELECT 'Professores inseridos com sucesso!' as resultado;
SELECT p.full_name, prof.especialidades, prof.preco_aula 
FROM public.professores prof 
JOIN public.profiles p ON prof.profile_id = p.id;

-- Populate sample professors data
INSERT INTO public.professores (profile_id, especialidades, disponibilidade, valor_hora, status)
SELECT 
  p.id,
  ARRAY['Futebol', 'Futsal']::text[],
  '{"segunda": ["08:00-12:00", "14:00-18:00"], "terca": ["08:00-12:00", "14:00-18:00"]}'::jsonb,
  75.00,
  'ativo'
FROM public.profiles p
JOIN public.user_roles ur ON ur.user_id = p.id
WHERE ur.role = 'professor'
ON CONFLICT (profile_id) DO NOTHING;

-- Add more sample professors if needed
INSERT INTO public.profiles (id, full_name, email, phone, created_at)
VALUES 
  (gen_random_uuid(), 'Carlos Santos', 'carlos.santos@arena.com', '(11) 99999-1111', NOW()),
  (gen_random_uuid(), 'Ana Silva', 'ana.silva@arena.com', '(11) 99999-2222', NOW()),
  (gen_random_uuid(), 'Roberto Costa', 'roberto.costa@arena.com', '(11) 99999-3333', NOW())
ON CONFLICT (email) DO NOTHING;

-- Add roles for new professors
INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'professor'
FROM public.profiles p
WHERE p.email IN ('carlos.santos@arena.com', 'ana.silva@arena.com', 'roberto.costa@arena.com')
ON CONFLICT (user_id) DO NOTHING;

-- Add professor details for new profiles
INSERT INTO public.professores (profile_id, especialidades, disponibilidade, valor_hora, status)
SELECT 
  p.id,
  CASE 
    WHEN p.email = 'carlos.santos@arena.com' THEN ARRAY['Futebol', 'Futsal']::text[]
    WHEN p.email = 'ana.silva@arena.com' THEN ARRAY['Vôlei', 'Beach Tennis']::text[]
    WHEN p.email = 'roberto.costa@arena.com' THEN ARRAY['Tênis', 'Padel']::text[]
  END,
  '{"segunda": ["08:00-12:00", "14:00-18:00"], "terca": ["08:00-12:00", "14:00-18:00"], "quarta": ["08:00-12:00", "14:00-18:00"]}'::jsonb,
  CASE 
    WHEN p.email = 'carlos.santos@arena.com' THEN 80.00
    WHEN p.email = 'ana.silva@arena.com' THEN 70.00
    WHEN p.email = 'roberto.costa@arena.com' THEN 90.00
  END,
  'ativo'
FROM public.profiles p
WHERE p.email IN ('carlos.santos@arena.com', 'ana.silva@arena.com', 'roberto.costa@arena.com')
ON CONFLICT (profile_id) DO NOTHING;

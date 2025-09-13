-- Populate sample reservas data using TSTZRANGE
INSERT INTO public.reservas (cliente_id, quadra_id, professor_id, duracao, valor_total, status, tipo, observacoes)
SELECT 
  (SELECT p.id FROM public.profiles p JOIN public.user_roles ur ON ur.user_id = p.id WHERE ur.role = 'cliente' LIMIT 1),
  (SELECT id FROM public.quadras WHERE nome ILIKE '%futsal%' LIMIT 1),
  (SELECT pr.profile_id FROM public.professores pr LIMIT 1),
  tstzrange(
    (CURRENT_DATE + INTERVAL '1 day' + TIME '10:00:00')::timestamptz,
    (CURRENT_DATE + INTERVAL '1 day' + TIME '11:00:00')::timestamptz,
    '[)'
  ),
  75.00,
  'confirmada',
  'aula_particular',
  'Aula de futsal para iniciante'
WHERE EXISTS (SELECT 1 FROM public.profiles p JOIN public.user_roles ur ON ur.user_id = p.id WHERE ur.role = 'cliente')
  AND EXISTS (SELECT 1 FROM public.quadras WHERE nome ILIKE '%futsal%')
  AND EXISTS (SELECT 1 FROM public.professores);

-- Add more sample reservas
INSERT INTO public.reservas (cliente_id, quadra_id, professor_id, duracao, valor_total, status, tipo, observacoes)
SELECT 
  (SELECT p.id FROM public.profiles p JOIN public.user_roles ur ON ur.user_id = p.id WHERE ur.role = 'cliente' LIMIT 1),
  (SELECT id FROM public.quadras WHERE nome ILIKE '%tennis%' OR nome ILIKE '%tênis%' LIMIT 1),
  (SELECT pr.profile_id FROM public.professores pr OFFSET 1 LIMIT 1),
  tstzrange(
    (CURRENT_DATE + INTERVAL '2 days' + TIME '14:00:00')::timestamptz,
    (CURRENT_DATE + INTERVAL '2 days' + TIME '15:30:00')::timestamptz,
    '[)'
  ),
  120.00,
  'confirmada',
  'aula_particular',
  'Aula de tênis avançado'
WHERE EXISTS (SELECT 1 FROM public.profiles p JOIN public.user_roles ur ON ur.user_id = p.id WHERE ur.role = 'cliente')
  AND EXISTS (SELECT 1 FROM public.quadras WHERE nome ILIKE '%tennis%' OR nome ILIKE '%tênis%')
  AND EXISTS (SELECT 1 FROM public.professores pr OFFSET 1);

-- Add a volleyball reservation
INSERT INTO public.reservas (cliente_id, quadra_id, professor_id, duracao, valor_total, status, tipo, observacoes)
SELECT 
  (SELECT p.id FROM public.profiles p JOIN public.user_roles ur ON ur.user_id = p.id WHERE ur.role = 'cliente' LIMIT 1),
  (SELECT id FROM public.quadras WHERE nome ILIKE '%vôlei%' OR nome ILIKE '%volei%' LIMIT 1),
  (SELECT pr.profile_id FROM public.professores pr WHERE 'Vôlei' = ANY(pr.especialidades) LIMIT 1),
  tstzrange(
    (CURRENT_DATE + INTERVAL '3 days' + TIME '16:00:00')::timestamptz,
    (CURRENT_DATE + INTERVAL '3 days' + TIME '17:00:00')::timestamptz,
    '[)'
  ),
  70.00,
  'pendente',
  'aula_particular',
  'Primeira aula de vôlei'
WHERE EXISTS (SELECT 1 FROM public.profiles p JOIN public.user_roles ur ON ur.user_id = p.id WHERE ur.role = 'cliente')
  AND EXISTS (SELECT 1 FROM public.quadras WHERE nome ILIKE '%vôlei%' OR nome ILIKE '%volei%')
  AND EXISTS (SELECT 1 FROM public.professores pr WHERE 'Vôlei' = ANY(pr.especialidades));

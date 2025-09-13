-- Primeiro, vamos verificar os usuários existentes no auth
-- e criar profiles correspondentes na tabela profiles

-- Inserir profiles para os usuários que existem no auth.users
-- mas não têm profile correspondente na tabela profiles

INSERT INTO profiles (id, email, name, phone, role, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN au.email LIKE '%admin%' THEN 'Administrador Arena'
    WHEN au.email LIKE '%professor%' THEN 'Professor Arena'
    WHEN au.email LIKE '%aluno%' THEN 'Aluno Arena'
    ELSE 'Usuário Arena'
  END as name,
  NULL as phone,
  CASE 
    WHEN au.email LIKE '%admin%' THEN 'admin'::text
    WHEN au.email LIKE '%professor%' THEN 'professor'::text
    WHEN au.email LIKE '%aluno%' THEN 'aluno'::text
    ELSE 'aluno'::text
  END as role,
  au.created_at,
  au.updated_at
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL
AND au.email IS NOT NULL;

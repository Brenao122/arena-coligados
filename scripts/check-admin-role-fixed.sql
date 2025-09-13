-- VERIFICAR SE O ADMIN TEM O ROLE CORRETO
-- Execute este script para ver os dados do usuário admin

-- 1. Verificar dados na tabela profiles
SELECT 'DADOS DO ADMIN NA TABELA PROFILES:' as info;
SELECT id, email, full_name, created_at
FROM profiles 
WHERE email = 'teste.admin@arena.com';

-- 2. Verificar dados na tabela user_roles
SELECT 'DADOS DO ADMIN NA TABELA USER_ROLES:' as info;
SELECT ur.user_id, ur.role, p.email, p.full_name
FROM user_roles ur
JOIN profiles p ON ur.user_id = p.id
WHERE p.email = 'teste.admin@arena.com';

-- 3. Verificar se há discrepância entre as tabelas
SELECT 'COMPARAÇÃO ENTRE PROFILES E USER_ROLES:' as info;
SELECT 
    p.email,
    p.full_name,
    ur.role,
    CASE 
        WHEN ur.role IS NULL THEN 'SEM ROLE DEFINIDO'
        WHEN ur.role = 'admin' THEN 'ROLE CORRETO'
        ELSE 'ROLE INCORRETO: ' || ur.role
    END as status_role
FROM profiles p
LEFT JOIN user_roles ur ON p.id = ur.user_id
WHERE p.email = 'teste.admin@arena.com';

-- 4. Verificar todos os usuários e seus roles
SELECT 'TODOS OS USUÁRIOS E SEUS ROLES:' as info;
SELECT 
    p.email,
    p.full_name,
    COALESCE(ur.role, 'SEM ROLE') as role
FROM profiles p
LEFT JOIN user_roles ur ON p.id = ur.user_id
ORDER BY p.email;

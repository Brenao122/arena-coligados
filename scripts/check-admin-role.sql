-- VERIFICAR SE O ADMIN TEM O ROLE CORRETO
-- Execute este script para ver os dados do usuário admin

-- 1. Verificar dados na tabela profiles
SELECT 'DADOS DO ADMIN NA TABELA PROFILES:' as info;
SELECT id, email, full_name, role 
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
    p.role as profile_role,
    ur.role as user_roles_role,
    CASE 
        WHEN p.role = ur.role THEN 'CONSISTENTE'
        ELSE 'INCONSISTENTE'
    END as status
FROM profiles p
LEFT JOIN user_roles ur ON p.id = ur.user_id
WHERE p.email = 'teste.admin@arena.com';

-- 4. Contar quantos registros existem para este usuário
SELECT 'CONTAGEM DE REGISTROS:' as info;
SELECT 
    (SELECT COUNT(*) FROM profiles WHERE email = 'teste.admin@arena.com') as profiles_count,
    (SELECT COUNT(*) FROM user_roles ur JOIN profiles p ON ur.user_id = p.id WHERE p.email = 'teste.admin@arena.com') as user_roles_count;

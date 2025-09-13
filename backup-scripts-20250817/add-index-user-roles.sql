-- Adiciona índice na coluna user_id da tabela user_roles para melhorar performance
-- das consultas de busca de role por usuário

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Comentário: Este índice acelera as consultas que buscam o role de um usuário específico,
-- melhorando a performance da função getUserWithRole() e do middleware

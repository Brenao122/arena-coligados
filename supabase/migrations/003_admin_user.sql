-- =============================================
-- ARENA COLIGADOS - USUÁRIO ADMINISTRADOR
-- =============================================

-- Inserir usuário administrador
-- NOTA: Este usuário será criado via Dashboard do Supabase
-- Aqui apenas criamos o perfil após o usuário ser criado

-- Função para promover usuário a admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles 
    SET role = 'admin' 
    WHERE email = user_email;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuário com email % não encontrado', user_email;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para promover usuário a professor
CREATE OR REPLACE FUNCTION promote_to_professor(user_email TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles 
    SET role = 'professor' 
    WHERE email = user_email;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuário com email % não encontrado', user_email;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dados de exemplo serão inseridos após criação dos usuários via autenticação

-- Inserir alguns leads de exemplo
INSERT INTO leads (nome, email, telefone, interesse, origem, status) VALUES
('João Silva', 'joao@email.com', '(62) 66666-6666', 'Aula Particular', 'Facebook', 'novo'),
('Maria Santos', 'maria@email.com', '(62) 55555-5555', 'Locação', 'Instagram', 'contatado'),
('Pedro Costa', 'pedro@email.com', '(62) 44444-4444', 'Evento', 'Indicação', 'novo');

-- Comentários
COMMENT ON FUNCTION promote_to_admin(TEXT) IS 'Promove um usuário a administrador pelo email';
COMMENT ON FUNCTION promote_to_professor(TEXT) IS 'Promove um usuário a professor pelo email';

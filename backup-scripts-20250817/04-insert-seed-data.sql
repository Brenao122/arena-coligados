-- Dados iniciais para desenvolvimento e demonstração
-- Execute após criar as tabelas

-- Inserir quadras de exemplo
INSERT INTO public.quadras (nome, tipo, preco_hora, ativa, descricao, imagem_url) VALUES
('Quadra de Tênis 1', 'tenis', 80.00, true, 'Quadra oficial de tênis com piso sintético e iluminação LED', '/tennis-court-1.jpg'),
('Quadra de Futsal', 'futsal', 120.00, true, 'Quadra coberta de futsal com grama sintética de alta qualidade', '/futsal-court.jpg'),
('Quadra de Beach Tennis', 'beach-tennis', 60.00, true, 'Quadra de beach tennis com areia importada', '/beach-tennis-court.jpg'),
('Quadra de Vôlei', 'volei', 70.00, true, 'Quadra de vôlei coberta com piso oficial', '/volleyball-court.jpg'),
('Quadra de Tênis 2', 'tenis', 85.00, true, 'Segunda quadra de tênis com arquibancada', '/tennis-court-2.jpg');

-- Inserir leads de exemplo
INSERT INTO public.leads (nome, telefone, email, origem, interesse, status) VALUES
('Ana Silva Santos', '(11) 99999-1234', 'ana.silva@email.com', 'instagram', 'Aula de tênis', 'novo'),
('Carlos Santos', '(11) 98888-5678', 'carlos.santos@email.com', 'whatsapp', 'Locação quadra futsal', 'contatado'),
('Maria Oliveira', '(11) 97777-9012', 'maria.oliveira@email.com', 'site', 'Aula experimental vôlei', 'convertido'),
('João Pedro Costa', '(11) 96666-3456', 'joao.costa@email.com', 'indicacao', 'Beach tennis', 'novo'),
('Roberto Alves', '(11) 95555-7890', 'roberto.alves@email.com', 'instagram', 'Aula de tênis', 'contatado');

-- Inserir usuários de exemplo (após criar contas via auth)
-- Estes serão criados automaticamente via trigger quando usuários se registrarem

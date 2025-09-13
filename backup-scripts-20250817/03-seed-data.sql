-- Dados iniciais para desenvolvimento

-- Inserir quadras
INSERT INTO public.quadras (name, type, description, price_per_hour, image_url) VALUES
('Quadra de Tênis 1', 'tenis', 'Quadra oficial de tênis com piso sintético', 80.00, '/tennis-court-1.jpg'),
('Quadra de Futsal', 'futsal', 'Quadra coberta de futsal com grama sintética', 120.00, '/futsal-court.jpg'),
('Quadra de Beach Tennis', 'beach-tennis', 'Quadra de beach tennis com areia', 60.00, '/beach-tennis-court.jpg'),
('Quadra de Vôlei', 'volei', 'Quadra de vôlei coberta', 70.00, '/volleyball-court.jpg'),
('Quadra de Tênis 2', 'tenis', 'Segunda quadra de tênis com iluminação', 85.00, '/tennis-court-2.jpg');

-- Inserir leads de exemplo
INSERT INTO public.leads (name, email, phone, source, interest, status) VALUES
('Ana Silva Santos', 'ana.silva@email.com', '(11) 99999-1234', 'instagram', 'Aula de tênis', 'novo'),
('Carlos Santos', 'carlos.santos@email.com', '(11) 98888-5678', 'whatsapp', 'Locação quadra futsal', 'contatado'),
('Maria Oliveira', 'maria.oliveira@email.com', '(11) 97777-9012', 'site', 'Aula experimental vôlei', 'convertido'),
('João Pedro Costa', 'joao.costa@email.com', '(11) 96666-3456', 'indicacao', 'Beach tennis', 'novo'),
('Roberto Alves', 'roberto.alves@email.com', '(11) 95555-7890', 'instagram', 'Aula de tênis', 'contatado');

-- Seed data for Arena Coligados
-- Run this after creating the tables

-- Insert sample quadras
INSERT INTO public.quadras (nome, tipo, preco_hora, descricao) VALUES
('Quadra 1 - Futsal', 'futsal', 80.00, 'Quadra oficial de futsal com grama sintética'),
('Quadra 2 - Vôlei', 'volei', 60.00, 'Quadra de vôlei com piso oficial'),
('Quadra 3 - Basquete', 'basquete', 70.00, 'Quadra de basquete com tabela oficial'),
('Quadra 4 - Society', 'society', 90.00, 'Campo society com grama natural');

-- Insert admin user (you'll need to create this user in Supabase Auth first)
-- Then update the profile to admin role
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@arenacoligados.com';

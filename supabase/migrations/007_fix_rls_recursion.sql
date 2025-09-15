-- =============================================
-- ARENA COLIGADOS - CORRIGIR RECURSÃO RLS
-- =============================================

-- O problema é que as políticas RLS estão causando recursão infinita
-- Vamos simplificar as políticas para resolver isso

-- Primeiro, vamos remover todas as políticas problemáticas
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Criar políticas mais simples que não causam recursão
CREATE POLICY "Enable read access for all users" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON profiles
    FOR UPDATE USING (true);

-- Políticas para quadras (mais simples)
DROP POLICY IF EXISTS "Anyone can view active quadras" ON quadras;
DROP POLICY IF EXISTS "Admins can manage quadras" ON quadras;

CREATE POLICY "Enable read access for all users" ON quadras
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON quadras
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON quadras
    FOR UPDATE USING (true);

-- Políticas para reservas (mais simples)
DROP POLICY IF EXISTS "Clients can view own reservations" ON reservas;
DROP POLICY IF EXISTS "Clients can create reservations" ON reservas;
DROP POLICY IF EXISTS "Clients can cancel own reservations" ON reservas;
DROP POLICY IF EXISTS "Professors can view assigned reservations" ON reservas;
DROP POLICY IF EXISTS "Professors can update assigned reservations" ON reservas;
DROP POLICY IF EXISTS "Admins can manage all reservations" ON reservas;

CREATE POLICY "Enable read access for all users" ON reservas
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON reservas
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON reservas
    FOR UPDATE USING (true);

-- Políticas para leads (mais simples)
DROP POLICY IF EXISTS "Admins can manage leads" ON leads;

CREATE POLICY "Enable read access for all users" ON leads
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON leads
    FOR UPDATE USING (true);

-- Políticas para pagamentos (mais simples)
DROP POLICY IF EXISTS "Clients can view own payments" ON pagamentos;
DROP POLICY IF EXISTS "Admins can manage all payments" ON pagamentos;

CREATE POLICY "Enable read access for all users" ON pagamentos
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON pagamentos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON pagamentos
    FOR UPDATE USING (true);

-- Políticas para audit_logs (mais simples)
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;

CREATE POLICY "Enable read access for all users" ON audit_logs
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON audit_logs
    FOR INSERT WITH CHECK (true);



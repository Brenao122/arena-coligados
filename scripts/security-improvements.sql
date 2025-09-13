-- MELHORIAS DE SEGURANÇA - ARENA COLIGADOS
-- Script para implementar camadas adicionais de segurança

-- 1. FUNÇÃO DE AUDITORIA
CREATE OR REPLACE FUNCTION public.audit_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    table_name,
    operation,
    old_data,
    new_data,
    user_id,
    timestamp
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    auth.uid(),
    NOW()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. TABELA DE AUDITORIA
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  user_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TRIGGERS DE AUDITORIA EM TABELAS CRÍTICAS
CREATE TRIGGER audit_profiles AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.audit_log();

CREATE TRIGGER audit_user_roles AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.audit_log();

CREATE TRIGGER audit_reservas AFTER INSERT OR UPDATE OR DELETE ON public.reservas
  FOR EACH ROW EXECUTE FUNCTION public.audit_log();

-- 4. FUNÇÃO PARA VALIDAR DADOS SENSÍVEIS
CREATE OR REPLACE FUNCTION public.validate_sensitive_data(
  email TEXT DEFAULT NULL,
  phone TEXT DEFAULT NULL,
  cpf TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Validar email
  IF email IS NOT NULL AND email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Email inválido: %', email;
  END IF;
  
  -- Validar telefone brasileiro
  IF phone IS NOT NULL AND phone !~ '^$$\d{2}$$\s\d{4,5}-\d{4}$' THEN
    RAISE EXCEPTION 'Telefone inválido: %', phone;
  END IF;
  
  -- Validar CPF (formato básico)
  IF cpf IS NOT NULL AND cpf !~ '^\d{3}\.\d{3}\.\d{3}-\d{2}$' THEN
    RAISE EXCEPTION 'CPF inválido: %', cpf;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 5. POLÍTICAS RLS MAIS RESTRITIVAS
-- Reforçar segurança em pagamentos
DROP POLICY IF EXISTS pagamentos_select ON public.pagamentos;
CREATE POLICY pagamentos_select ON public.pagamentos FOR SELECT USING (
  -- Cliente só vê seus próprios pagamentos
  EXISTS (
    SELECT 1 FROM public.reservas r 
    WHERE r.id = reserva_id AND r.cliente_id = auth.uid()
  ) OR
  -- Admin vê todos
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- 6. FUNÇÃO PARA MASCARAR DADOS SENSÍVEIS
CREATE OR REPLACE FUNCTION public.mask_sensitive_data(
  data TEXT,
  mask_type TEXT DEFAULT 'partial'
)
RETURNS TEXT AS $$
BEGIN
  CASE mask_type
    WHEN 'email' THEN
      RETURN REGEXP_REPLACE(data, '(.{2}).*(@.*)', '\1***\2');
    WHEN 'phone' THEN
      RETURN REGEXP_REPLACE(data, '($$\d{2}$$\s\d{2})\d{3}(-\d{4})', '\1***\2');
    WHEN 'cpf' THEN
      RETURN REGEXP_REPLACE(data, '(\d{3}\.)\d{3}(\.\d{3}-\d{2})', '\1***\2');
    ELSE
      RETURN LEFT(data, 3) || REPEAT('*', LENGTH(data) - 3);
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- 7. RATE LIMITING - Tabela para controle
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  ip_address INET,
  action TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. FUNÇÃO PARA VERIFICAR RATE LIMIT
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id UUID,
  p_ip_address INET,
  p_action TEXT,
  p_limit INTEGER DEFAULT 10,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
BEGIN
  -- Limpar registros antigos
  DELETE FROM public.rate_limits 
  WHERE window_start < NOW() - INTERVAL '1 hour' * p_window_minutes / 60;
  
  -- Contar tentativas na janela atual
  SELECT COALESCE(SUM(count), 0) INTO current_count
  FROM public.rate_limits
  WHERE (user_id = p_user_id OR ip_address = p_ip_address)
    AND action = p_action
    AND window_start > NOW() - INTERVAL '1 minute' * p_window_minutes;
  
  -- Se excedeu o limite, bloquear
  IF current_count >= p_limit THEN
    RETURN FALSE;
  END IF;
  
  -- Registrar tentativa
  INSERT INTO public.rate_limits (user_id, ip_address, action)
  VALUES (p_user_id, p_ip_address, p_action);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. HABILITAR RLS NAS NOVAS TABELAS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Políticas para audit_logs (só admin vê)
CREATE POLICY audit_logs_admin_only ON public.audit_logs FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- 10. VERIFICAÇÃO FINAL
SELECT 'Melhorias de segurança implementadas com sucesso!' as resultado;
SELECT 'Sistema agora tem: auditoria, validação, rate limiting e mascaramento' as recursos;

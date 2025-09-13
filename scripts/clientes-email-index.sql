-- Aplica índice único case-insensitive para email (aceita NULL)
CREATE UNIQUE INDEX IF NOT EXISTS ux_clientes_email_ci
ON public.clientes (lower(email))
WHERE email IS NOT NULL;

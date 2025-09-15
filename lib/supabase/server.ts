import 'server-only'
import { createClient } from '@supabase/supabase-js'

export function supabaseServer() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // use a service role aqui (no servidor)
    { auth: { persistSession: false } }
  )
}

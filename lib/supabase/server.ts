// lib/supabase/server.ts (server-only)
import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { ENV } from '@/lib/env'

export function getServerSupabase() {
  const store = cookies()
  return createServerClient(
    ENV.NEXT_PUBLIC_SUPABASE_URL,
    ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => store.get(name)?.value,
        set: (name, value, options) => store.set(name, value, options),
        remove: (name, options) => store.set(name, '', { ...options, maxAge: 0 }),
      },
    }
  )
}

// Função legacy para compatibilidade
export function supabaseServer() {
  return getServerSupabase()
}

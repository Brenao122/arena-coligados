'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const redirectTo = String(formData.get('redirectTo') ?? '/dashboard/dashboard-admin')

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  if (!url || !anon) return { ok: false, error: 'ENVs ausentes no runtime' }

  try {
    await fetch(`${url}/auth/v1/health`, { cache: 'no-store' })
  } catch (e: any) {
    return { ok: false, error: `Supabase indisponível: ${e?.message ?? 'health failed'}` }
  }

  const store = cookies()
  const supabase = createServerClient(url, anon, {
    cookies: {
      get: (n) => store.get(n)?.value,
      set: (n, v, o) => store.set(n, v, o),
      remove: (n, o) => store.set(n, '', { ...o, maxAge: 0 }),
    },
  })

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { ok: false, error: error.message }

  redirect(redirectTo)
}

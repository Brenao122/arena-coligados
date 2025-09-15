import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { DashboardClientLayout } from '@/components/layout/dashboard-client-layout'

// Forçar renderização dinâmica e não cachear
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // SSR supabase usando cookies do domínio
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) =>
          cookieStore.set({
            name,
            value,
            ...options,
            domain: process.env.AUTH_COOKIE_DOMAIN,      // arenacoligados.com.br
            secure: process.env.AUTH_COOKIE_SECURE === 'true',
            sameSite: 'lax',
            path: '/',
          }),
        remove: (name, options) =>
          cookieStore.set({
            name,
            value: '',
            ...options,
            domain: process.env.AUTH_COOKIE_DOMAIN,
            secure: process.env.AUTH_COOKIE_SECURE === 'true',
            maxAge: 0,
            path: '/',
          }),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')     // redireciona no SERVIDOR

  return (
    <DashboardClientLayout>
      {children}
    </DashboardClientLayout>
  )
}


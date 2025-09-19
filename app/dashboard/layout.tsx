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
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
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


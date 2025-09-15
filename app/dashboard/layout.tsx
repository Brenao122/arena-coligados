import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase/server'
import { DashboardClientLayout } from '@/components/layout/dashboard-client-layout'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificar autenticação no servidor
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <DashboardClientLayout>
      {children}
    </DashboardClientLayout>
  )
}


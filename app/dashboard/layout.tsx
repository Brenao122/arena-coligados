import { DashboardClientLayout } from '@/components/layout/dashboard-client-layout'
import { AuthGuard } from '@/components/auth/auth-guard'

// Forçar renderização dinâmica e não cachear
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <DashboardClientLayout>
        {children}
      </DashboardClientLayout>
    </AuthGuard>
  )
}


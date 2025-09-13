"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AccessControlProps {
  children: React.ReactNode
  allowedRoles?: ("admin" | "professor" | "cliente")[]
  requireAuth?: boolean
}

export function AccessControl({ children, allowedRoles, requireAuth = true }: AccessControlProps) {
  const { profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (requireAuth && !profile) {
      router.push('/login')
      return
    }

    if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
      router.push('/dashboard')
      return
    }
  }, [profile, loading, allowedRoles, requireAuth, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  if (requireAuth && !profile) {
    return null
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p>Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Componentes específicos por role
export function AdminOnly({ children }: { children: React.ReactNode }) {
  return (
    <AccessControl allowedRoles={["admin"]}>
      {children}
    </AccessControl>
  )
}

export function ProfessorOnly({ children }: { children: React.ReactNode }) {
  return (
    <AccessControl allowedRoles={["admin", "professor"]}>
      {children}
    </AccessControl>
  )
}

export function ClientOnly({ children }: { children: React.ReactNode }) {
  return (
    <AccessControl allowedRoles={["cliente"]}>
      {children}
    </AccessControl>
  )
}

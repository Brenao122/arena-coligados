"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface AccessControlProps {
  children: React.ReactNode
  allowedRoles?: ("admin" | "professor" | "cliente")[]
  requireAuth?: boolean
}

export function AccessControl({ children, allowedRoles, requireAuth = true }: AccessControlProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const checkUser = () => {
      try {
        const savedUser = localStorage.getItem('arena_user')
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          console.log('[LOGIN→CRM] Usuário encontrado:', userData)
        } else {
          console.log('[LOGIN→CRM] Nenhum usuário encontrado no localStorage')
          if (requireAuth) {
            router.push('/login')
          }
        }
      } catch (error) {
        console.error('[LOGIN→CRM] Erro ao verificar usuário:', error)
        if (requireAuth) {
          router.push('/login')
        }
      }
      setLoading(false)
    }

    // Aguardar um pouco para garantir que o localStorage está disponível
    setTimeout(checkUser, 100)
  }, [requireAuth, router])

  // Debug: log do estado
  console.log('[LOGIN→CRM] AccessControl - loading:', loading, 'user:', user, 'requireAuth:', requireAuth)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  if (requireAuth && !user) {
    return null
  }

  if (allowedRoles && user && !allowedRoles.includes(user.profile?.role)) {
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

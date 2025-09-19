"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth-simple'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('AuthGuard: Usuário não autenticado, redirecionando para login')
        router.replace('/login')
      } else {
        console.log('AuthGuard: Usuário autenticado:', user.email)
        setIsChecking(false)
      }
    }
  }, [user, loading, router])

  // Mostrar loading enquanto verifica autenticação
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Se não há usuário, não renderizar nada (será redirecionado)
  if (!user) {
    return null
  }

  // Se há usuário, renderizar o conteúdo
  return <>{children}</>
}

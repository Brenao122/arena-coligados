"use client"

import { useEffect, useState, createContext, useContext, ReactNode } from "react"
import { User, Session, AuthError } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase-client"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  error: AuthError | null
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, userData: any) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updateProfile: (updates: any) => Promise<{ error: AuthError | null }>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  useEffect(() => {
    // Verificar se há uma sessão ativa
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Erro ao obter sessão:', error)
          setError(error as any)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (err) {
        console.error('Erro inesperado:', err)
        setError(err as AuthError)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        setError(null)

        // Se é um novo login, criar/atualizar perfil
        if (event === 'SIGNED_IN' && session?.user) {
          await createOrUpdateProfile(session.user)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const createOrUpdateProfile = async (user: User) => {
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!existingProfile) {
        // Criar novo perfil
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email!,
            nome: user.user_metadata?.full_name || user.email!.split('@')[0],
            telefone: user.user_metadata?.phone || null,
            data_nascimento: user.user_metadata?.data_nascimento || null,
            endereco: user.user_metadata?.endereco || null,
            avatar_url: user.user_metadata?.avatar_url || null,
            role: user.user_metadata?.role || 'cliente',
            ativo: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (error) {
          console.error('Erro ao criar perfil:', error)
        }
      } else {
        // Atualizar perfil existente
        const { error } = await supabase
          .from('profiles')
          .update({
            email: user.email!,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (error) {
          console.error('Erro ao atualizar perfil:', error)
        }
      }
    } catch (err) {
      console.error('Erro ao gerenciar perfil:', err)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error as any)
        return { error }
      }

      return { error: null }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
      return { error: authError }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.nome,
            phone: userData.telefone,
            data_nascimento: userData.data_nascimento,
            endereco: userData.endereco,
            role: userData.role || 'cliente'
          }
        }
      })

      if (error) {
        setError(error as any)
        return { error }
      }

      return { error: null }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
      return { error: authError }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signOut()

      if (error) {
        setError(error as any)
        return { error }
      }

      // Limpar dados locais
      setUser(null)
      setSession(null)
      
      return { error: null }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
      return { error: authError }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setError(null)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        setError(error as any)
        return { error }
      }

      return { error: null }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
      return { error: authError }
    }
  }

  const updateProfile = async (updates: any): Promise<{ error: AuthError | null }> => {
    try {
      setError(null)

      if (!user) {
        const authError = { message: 'Usuário não autenticado' } as AuthError
        setError(authError)
        return { error: authError }
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        setError(error as any)
        return { error: error as unknown as AuthError | null }
      }

      return { error: null }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
      return { error: authError }
    }
  }

  const refreshSession = async () => {
    try {
      setError(null)
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        setError(error as any)
      } else {
        setSession(data.session)
        setUser(data.session?.user ?? null)
      }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshSession
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

// Hook para obter dados do perfil do usuário
export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          setError(error as any)
        } else {
          setProfile(data)
        }
      } catch (err) {
        setError(err as AuthError)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  return { profile, loading, error }
}


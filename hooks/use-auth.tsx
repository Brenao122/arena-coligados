"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"
import type { User } from "@supabase/supabase-js"
import { getBrowserClient } from "@/lib/supabase/browser-client"
import { getUserWithRole } from "@/lib/supabase/get-user-with-role"
import { useRouter } from "next/navigation"

type Profile = {
  id: string
  email: string
  full_name: string
  phone: string | null
  role: "admin" | "professor" | "cliente"
}

type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const fetchingProfile = useRef(false)
  const lastFetchedUserId = useRef<string | null>(null)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const supabase = getBrowserClient()

        const {
          data: { session },
        } = await supabase.auth.getSession()

        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id, false)
        }

        setLoading(false)

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("🔄 Auth state changed:", event)
          setUser(session?.user ?? null)
          if (session?.user) {
            if (session.user.id !== lastFetchedUserId.current && !fetchingProfile.current) {
              await fetchProfile(session.user.id, false)
            }
          } else {
            setProfile(null)
            lastFetchedUserId.current = null
            fetchingProfile.current = false
          }
        })

        return () => subscription.unsubscribe()
      } catch (error) {
        console.error("❌ Erro na inicialização da auth:", error)
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const fetchProfile = async (userId: string, shouldRedirect = false) => {
    if (fetchingProfile.current || lastFetchedUserId.current === userId) {
      return
    }

    fetchingProfile.current = true

    try {
      console.log("🔍 Buscando perfil para usuário:", userId)

      const { user, role } = await getUserWithRole()

      if (!user) {
        console.error("❌ Usuário não encontrado")
        throw new Error("Usuário não encontrado")
      }

      const supabase = getBrowserClient()
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (profileError) {
        console.error("❌ Erro ao buscar perfil:", profileError)
        throw profileError
      }

      console.log("[v0] Profile data:", profileData)
      console.log("[v0] Role from getUserWithRole:", role)

      const profileWithRole = {
        ...profileData,
        role: role as "admin" | "professor" | "cliente",
      }

      setProfile(profileWithRole)
      lastFetchedUserId.current = userId

      if (shouldRedirect && role) {
        console.log(`[v0] Redirecting to ${role} dashboard`)
        redirectBasedOnRole(role as "admin" | "professor" | "cliente")
      }
    } catch (error) {
      console.error("❌ Erro ao buscar perfil:", error)
    } finally {
      setLoading(false)
      fetchingProfile.current = false
    }
  }

  const redirectBasedOnRole = (role: "admin" | "professor" | "cliente") => {
    console.log("🔄 Redirecionando usuário com role:", role)

    switch (role) {
      case "admin":
        console.log("➡️ Admin redirecionado para dashboard admin")
        router.push("/dashboard/dashboard-admin")
        break
      case "professor":
        console.log("➡️ Professor redirecionado para dashboard professor")
        router.push("/dashboard/dashboard-professor")
        break
      case "cliente":
        console.log("➡️ Cliente redirecionado para dashboard aluno")
        router.push("/dashboard/dashboard-aluno")
        break
      default:
        console.log("⚠️ Role não reconhecido, redirecionando para admin")
        router.push("/dashboard/dashboard-admin")
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = getBrowserClient()

      console.log("🔐 Fazendo login com Supabase...")
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("❌ Erro no login:", error)
        return { error: { message: "Email ou senha incorretos" } }
      }

      if (!data.user) {
        console.error("❌ Usuário não retornado")
        return { error: { message: "Erro interno do sistema" } }
      }

      console.log("✅ Login bem-sucedido, usuário:", data.user.email)

      fetchingProfile.current = false
      lastFetchedUserId.current = null
      await fetchProfile(data.user.id, true)

      return { error: null }
    } catch (error) {
      console.error("❌ Erro no signIn:", error)
      return { error: { message: "Email ou senha incorretos" } }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const supabase = getBrowserClient()

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        },
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      const supabase = getBrowserClient()

      console.log("🚪 Fazendo logout...")
      await supabase.auth.signOut()

      setUser(null)
      setProfile(null)
      router.push("/")
    } catch (error) {
      console.error("❌ Erro no logout:", error)
      router.push("/")
    }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

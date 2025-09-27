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

  const sheetsUsers = [
    { email: "admin@arena.com", password: "admin123", role: "admin", name: "Administrador Arena" },
    { email: "professor@arena.com", password: "prof123", role: "professor", name: "Professor Arena" },
    { email: "cliente@arena.com", password: "cliente123", role: "cliente", name: "Cliente Arena" },
    { email: "maria.silva@email.com", password: "maria123", role: "cliente", name: "Maria Silva" },
    { email: "joao.santos@email.com", password: "joao123", role: "cliente", name: "João Santos" },
  ]

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
      console.log("🔐 Tentando login híbrido...")

      const supabase = getBrowserClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (!error && data.user) {
        console.log("✅ Login Supabase bem-sucedido:", data.user.email)
        fetchingProfile.current = false
        lastFetchedUserId.current = null
        await fetchProfile(data.user.id, true)
        return { error: null }
      }

      console.log("🔄 Tentando login com usuários da planilha...")
      const sheetsUser = sheetsUsers.find((u) => u.email === email && u.password === password)

      if (sheetsUser) {
        console.log("✅ Login com planilha bem-sucedido:", sheetsUser.email)

        const mockUser = {
          id: `sheets_${sheetsUser.email}`,
          email: sheetsUser.email,
          user_metadata: { full_name: sheetsUser.name },
        } as User

        const mockProfile = {
          id: mockUser.id,
          email: sheetsUser.email,
          full_name: sheetsUser.name,
          phone: null,
          role: sheetsUser.role as "admin" | "professor" | "cliente",
        }

        setUser(mockUser)
        setProfile(mockProfile)

        redirectBasedOnRole(sheetsUser.role as "admin" | "professor" | "cliente")

        return { error: null }
      }

      console.error("❌ Credenciais inválidas em ambos os sistemas")
      return { error: { message: "Email ou senha incorretos" } }
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

"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Profile = {
  id: string
  email: string
  full_name: string
  phone: string | null
  role: "admin" | "professor" | "cliente"
}

type AuthContextType = {
  user: any | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular usuário logado para o build
    const mockUser = {
      id: "mock-user-id",
      email: "admin@arena.com",
      user_metadata: {
        full_name: "Admin Arena"
      }
    }
    
    const mockProfile = {
      id: "mock-user-id",
      email: "admin@arena.com",
      full_name: "Admin Arena",
      phone: "(11) 99999-9999",
      role: "admin" as const
    }

    setUser(mockUser)
    setProfile(mockProfile)
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Simular login para o build
    return { error: null }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    // Simular cadastro para o build
    return { error: null }
  }

  const signOut = async () => {
    // Simular logout para o build
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

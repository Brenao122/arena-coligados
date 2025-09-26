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
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('arena_user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setProfile(userData.profile)
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      // Buscar usuários da planilha N8N
      const response = await fetch('/api/sheets/read?sheet=usuarios')
      const result = await response.json()
      
      if (!result.ok) {
        throw new Error('Erro ao buscar usuários')
      }

      const usuarios = result.rows || []
      
      // Procurar usuário com email e senha
      const usuario = usuarios.find((u: any) => 
        u.email === email && u.senha === password && u.ativo === 'SIM'
      )
      
      if (!usuario) {
        throw new Error('Email ou senha incorretos')
      }

      const userData = {
        id: usuario.id,
        email: usuario.email,
        user_metadata: {
          full_name: usuario.nome
        }
      }

      const profileData = {
        id: usuario.id,
        email: usuario.email,
        full_name: usuario.nome,
        phone: usuario.telefone,
        role: usuario.role
      }

      // Salvar no localStorage
      localStorage.setItem('arena_user', JSON.stringify({
        ...userData,
        profile: profileData
      }))

      setUser(userData)
      setProfile(profileData)
      
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Erro ao fazer login' }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true)
      
      // Criar novo usuário na planilha
      const novoUsuario = {
        id: `user-${Date.now()}`,
        email: email,
        senha: password,
        nome: fullName,
        telefone: '',
        role: 'cliente',
        ativo: 'SIM',
        criado_em: new Date().toISOString()
      }

      const response = await fetch('/api/sheets/append', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sheet: 'usuarios',
          rows: [novoUsuario]
        })
      })

      const result = await response.json()

      if (!result.ok) {
        throw new Error('Erro ao criar usuário')
      }

      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Erro ao criar conta' }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    localStorage.removeItem('arena_user')
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

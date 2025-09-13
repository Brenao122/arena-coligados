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
    console.log('🔄 AuthProvider: Inicializando...')
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('arena_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        console.log('👤 Usuário encontrado no localStorage:', userData)
        setUser(userData)
        setProfile(userData.profile)
      } catch (error) {
        console.log('❌ Erro ao parsear usuário do localStorage:', error)
        localStorage.removeItem('arena_user')
      }
    } else {
      console.log('ℹ️ Nenhum usuário encontrado no localStorage')
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('🔐 signIn chamado com:', { email, password })
    try {
      setLoading(true)
      
      // Usuários hardcoded para garantir funcionamento
      const usuarios = [
        {
          id: 'admin-001',
          email: 'admin@arena.com',
          senha: 'admin123',
          nome: 'Administrador Arena',
          telefone: '(11) 99999-9999',
          role: 'admin',
          ativo: 'SIM'
        },
        {
          id: 'prof-001',
          email: 'professor@arena.com',
          senha: 'prof123',
          nome: 'Professor Arena',
          telefone: '(11) 88888-8888',
          role: 'professor',
          ativo: 'SIM'
        },
        {
          id: 'cliente-001',
          email: 'cliente@arena.com',
          senha: 'cliente123',
          nome: 'Cliente Arena',
          telefone: '(11) 77777-7777',
          role: 'cliente',
          ativo: 'SIM'
        }
      ]
      
      console.log('👥 Usuários disponíveis:', usuarios.map(u => ({ email: u.email, role: u.role })))
      
      // Procurar usuário com email e senha
      const usuario = usuarios.find((u: any) => 
        u.email === email && u.senha === password && u.ativo === 'SIM'
      )
      
      console.log('🔍 Usuário encontrado:', usuario ? { email: usuario.email, role: usuario.role } : 'Nenhum')
      
      if (!usuario) {
        console.log('❌ Usuário não encontrado ou inativo')
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

      console.log('💾 Salvando dados do usuário:', { userData, profileData })

      // Salvar no localStorage
      const userToSave = {
        ...userData,
        profile: profileData
      }
      
      localStorage.setItem('arena_user', JSON.stringify(userToSave))
      console.log('✅ Usuário salvo no localStorage')

      setUser(userData)
      setProfile(profileData)
      
      console.log('🎉 Login bem-sucedido!')
      return { error: null }
    } catch (error) {
      console.log('💥 Erro no signIn:', error)
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
    console.log('🚪 Fazendo logout...')
    localStorage.removeItem('arena_user')
    setUser(null)
    setProfile(null)
    console.log('✅ Logout concluído')
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

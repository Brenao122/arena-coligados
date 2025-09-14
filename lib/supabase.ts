import { getBrowserClient } from "./supabase/browser-client"

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fksahbiajrccraxvowtv.supabase.co"
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2FoYmlhanJjY3JheHZvd3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTM1MjQsImV4cCI6MjA3MDY4OTUyNH0.zW0CAWuOkZaRAXVcd0uNRADnf_ADMn9FjtCySFlLKeM"

export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("https://"))
}

export const supabase = getBrowserClient()

export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    return null
  }
  return getBrowserClient()
}

export const getProfile = async (userId: string) => {
  try {
    const response = await fetch('/api/sheets/read?sheet=Usuarios')
    const result = await response.json()
    
    if (!result.ok) {
      return { data: null, error: { message: "Erro ao buscar usuários" } }
    }
    
    const usuarios = result.values?.slice(1) || []
    const usuario = usuarios.find((u: any[]) => u[0] === userId) // ID na coluna 0
    
    if (usuario) {
      const data = {
        id: usuario[0],
        email: usuario[1],
        full_name: usuario[2],
        phone: usuario[3],
        theme_preference: usuario[4] || 'system',
        created_at: usuario[5] || new Date().toISOString(),
        updated_at: usuario[6] || new Date().toISOString()
      }
      return { data, error: null }
    }

    return { data: null, error: { message: "Perfil não encontrado" } }
  } catch (error) {
    return { data: null, error }
  }
}

export const getQuadras = async () => {
  try {
    const response = await fetch('/api/sheets/read?sheet=Quadras')
    const result = await response.json()
    
    if (!result.ok) {
      return { data: [], error: { message: "Erro ao buscar quadras" } }
    }
    
    const quadras = result.values?.slice(1) || []
    const data = quadras
      .filter((q: any[]) => q[5] === 'true' || q[5] === true) // ativa na coluna 5
      .map((q: any[]) => ({
        id: q[0],
        nome: q[1],
        tipo: q[2],
        preco_hora: parseFloat(q[3]) || 0,
        capacidade: parseInt(q[4]) || 0,
        ativa: q[5] === 'true' || q[5] === true,
        descricao: q[6],
        imagem_url: q[7],
        equipamentos: q[8] ? q[8].split(',').map((e: string) => e.trim()) : [],
        created_at: q[9] || new Date().toISOString(),
        updated_at: q[10] || new Date().toISOString()
      }))
    
    return { data, error: null }
  } catch (error) {
    return { data: [], error }
  }
}

export const getLeads = async () => {
  try {
    const response = await fetch('/api/sheets/read?sheet=Leads')
    const result = await response.json()
    
    if (!result.ok) {
      return { data: [], error: { message: "Erro ao buscar leads" } }
    }
    
    const leads = result.values?.slice(1) || []
    const data = leads
      .sort((a: any[], b: any[]) => new Date(b[6]).getTime() - new Date(a[6]).getTime()) // created_at na coluna 6
      .map((l: any[]) => ({
        id: l[0],
        nome: l[1],
        telefone: l[2],
        email: l[3],
        origem: l[4] || 'site',
        interesse: l[5],
        status: l[6] || 'novo',
        created_at: l[7] || new Date().toISOString()
      }))
    
    return { data, error: null }
  } catch (error) {
    return { data: [], error }
  }
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          theme_preference: "dark" | "light" | "system"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          theme_preference?: "dark" | "light" | "system"
        }
        Update: {
          full_name?: string
          phone?: string | null
          theme_preference?: "dark" | "light" | "system"
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: "admin" | "professor" | "cliente"
          created_at: string
        }
      }
      quadras: {
        Row: {
          id: string
          nome: string
          tipo: string
          preco_hora: number
          capacidade: number
          ativa: boolean
          descricao: string | null
          imagem_url: string | null
          equipamentos: string[]
          created_at: string
          updated_at: string
        }
      }
      leads: {
        Row: {
          id: string
          nome: string
          telefone: string
          email: string | null
          origem: "whatsapp" | "instagram" | "site" | "indicacao" | "google"
          interesse: string | null
          status: "novo" | "contatado" | "qualificado" | "proposta" | "convertido" | "perdido"
          created_at: string
        }
      }
    }
  }
}


﻿import { getBrowserClient } from "./supabase/browser-client"

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
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (data) {
      return { data, error: null }
    }

    return { data: null, error: error || { message: "Perfil nÃ£o encontrado" } }
  } catch (error) {
    return { data: null, error }
  }
}

export const getQuadras = async () => {
  try {
    const { data, error } = await supabase.from("quadras").select("*").eq("ativa", true).order("nome")
    return { data, error }
  } catch (error) {
    return { data: [], error }
  }
}

export const getLeads = async () => {
  try {
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false })
    return { data, error }
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


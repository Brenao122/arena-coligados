import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fogtbptqvvhoqesljlen.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZ3RicHRxdnZob3Flc2xqbGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzU5NjgsImV4cCI6MjA3MzExMTk2OH0.Fi0L_3mnpbjZFGqLvf_peDq5XkiDtiwF0vfn6nMDfg8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos TypeScript para o banco de dados
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          nome: string
          telefone: string | null
          data_nascimento: string | null
          endereco: any | null
          avatar_url: string | null
          role: 'admin' | 'professor' | 'cliente'
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          nome: string
          telefone?: string | null
          data_nascimento?: string | null
          endereco?: any | null
          avatar_url?: string | null
          role?: 'admin' | 'professor' | 'cliente'
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nome?: string
          telefone?: string | null
          data_nascimento?: string | null
          endereco?: any | null
          avatar_url?: string | null
          role?: 'admin' | 'professor' | 'cliente'
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      quadras: {
        Row: {
          id: string
          nome: string
          tipo: string
          capacidade: number
          preco_hora: number
          descricao: string | null
          regras: string | null
          equipamentos: any | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          tipo: string
          capacidade?: number
          preco_hora: number
          descricao?: string | null
          regras?: string | null
          equipamentos?: any | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          tipo?: string
          capacidade?: number
          preco_hora?: number
          descricao?: string | null
          regras?: string | null
          equipamentos?: any | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reservas: {
        Row: {
          id: string
          cliente_id: string
          quadra_id: string
          professor_id: string | null
          tipo: string
          data_inicio: string
          data_fim: string
          valor_total: number
          status: 'pendente' | 'confirmada' | 'cancelada' | 'concluida'
          observacoes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cliente_id: string
          quadra_id: string
          professor_id?: string | null
          tipo: string
          data_inicio: string
          data_fim: string
          valor_total: number
          status?: 'pendente' | 'confirmada' | 'cancelada' | 'concluida'
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cliente_id?: string
          quadra_id?: string
          professor_id?: string | null
          tipo?: string
          data_inicio?: string
          data_fim?: string
          valor_total?: number
          status?: 'pendente' | 'confirmada' | 'cancelada' | 'concluida'
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          nome: string
          email: string | null
          telefone: string | null
          interesse: string | null
          origem: string | null
          status: 'novo' | 'contatado' | 'convertido' | 'perdido'
          observacoes: string | null
          convertido_em: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          email?: string | null
          telefone?: string | null
          interesse?: string | null
          origem?: string | null
          status?: 'novo' | 'contatado' | 'convertido' | 'perdido'
          observacoes?: string | null
          convertido_em?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string | null
          telefone?: string | null
          interesse?: string | null
          origem?: string | null
          status?: 'novo' | 'contatado' | 'convertido' | 'perdido'
          observacoes?: string | null
          convertido_em?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: any
      }
      check_quadra_availability: {
        Args: {
          p_quadra_id: string
          p_data_inicio: string
          p_data_fim: string
          p_reserva_id?: string
        }
        Returns: boolean
      }
      promote_to_admin: {
        Args: {
          user_email: string
        }
        Returns: undefined
      }
      promote_to_professor: {
        Args: {
          user_email: string
        }
        Returns: undefined
      }
    }
  }
}

// lib/data-manager.ts
// Sistema híbrido: Supabase (principal) + Google Sheets (backup)

import 'server-only'
import { supabaseServer } from './supabase/server'
import { readSheet } from './sheets'

export interface DataManagerConfig {
  useSupabase: boolean
  useSheets: boolean
  syncInterval: number // em minutos
  fallbackToSheets: boolean
}

export class DataManager {
  private supabase: any
  private config: DataManagerConfig

  constructor(config: Partial<DataManagerConfig> = {}) {
    this.config = {
      useSupabase: true,
      useSheets: true,
      syncInterval: 5, // 5 minutos
      fallbackToSheets: true,
      ...config
    }
    
    // Usar server client para APIs do servidor
    this.supabase = supabaseServer()
  }

  // =============================================
  // MÉTODOS PARA CLIENTES
  // =============================================

  async getClientes() {
    try {
      if (this.config.useSupabase) {
        const { data, error } = await this.supabase
          .from('profiles')
          .select('*')
          .eq('role', 'cliente')
          .order('created_at', { ascending: false })

        if (!error && data) {
          return { data, source: 'supabase' }
        }
      }

      // Fallback para planilha
      if (this.config.fallbackToSheets) {
        const response = await fetch('/api/sheets/read?sheet=clientes')
        const result = await response.json()
        
        if (result.ok) {
          const clientes = this.parseSheetData(result.values, 'cliente')
          return { data: clientes, source: 'sheets' }
        }
      }

      throw new Error('Erro ao buscar clientes')
    } catch (error) {
      console.error('Erro no DataManager.getClientes:', error)
      return { data: [], source: 'error', error }
    }
  }

  async createCliente(clienteData: any) {
    try {
      // 1. Salvar no Supabase primeiro
      if (this.config.useSupabase) {
        const { data, error } = await this.supabase
          .from('profiles')
          .insert([{
            ...clienteData,
            role: 'cliente',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single()

        if (!error && data) {
          // 2. Sincronizar com planilha em background
          this.syncToSheets('clientes', data)
          return { data, source: 'supabase' }
        }
      }

      // Fallback: salvar direto na planilha
      if (this.config.useSheets) {
        const response = await fetch('/api/sheets/append', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sheet: 'clientes',
            data: this.formatForSheets(clienteData, 'cliente')
          })
        })

        const result = await response.json()
        if (result.ok) {
          return { data: clienteData, source: 'sheets' }
        }
      }

      throw new Error('Erro ao criar cliente')
    } catch (error) {
      console.error('Erro no DataManager.createCliente:', error)
      throw error
    }
  }

  // =============================================
  // MÉTODOS PARA QUADRAS
  // =============================================

  async getQuadras() {
    try {
      if (this.config.useSupabase) {
        const { data, error } = await this.supabase
          .from('quadras')
          .select('*')
          .eq('ativo', true)
          .order('nome')

        if (!error && data) {
          return { data, source: 'supabase' }
        }
      }

      // Fallback para planilha
      if (this.config.fallbackToSheets) {
        const response = await fetch('/api/sheets/read?sheet=quadras')
        const result = await response.json()
        
        if (result.ok) {
          const quadras = this.parseSheetData(result.values, 'quadra')
          return { data: quadras, source: 'sheets' }
        }
      }

      throw new Error('Erro ao buscar quadras')
    } catch (error) {
      console.error('Erro no DataManager.getQuadras:', error)
      return { data: [], source: 'error', error }
    }
  }

  async createQuadra(quadraData: any) {
    try {
      // 1. Salvar no Supabase primeiro
      if (this.config.useSupabase) {
        const { data, error } = await this.supabase
          .from('quadras')
          .insert([{
            ...quadraData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single()

        if (!error && data) {
          // 2. Sincronizar com planilha em background
          this.syncToSheets('quadras', data)
          return { data, source: 'supabase' }
        }
      }

      // Fallback: salvar direto na planilha
      if (this.config.useSheets) {
        const response = await fetch('/api/sheets/append', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sheet: 'quadras',
            data: this.formatForSheets(quadraData, 'quadra')
          })
        })

        const result = await response.json()
        if (result.ok) {
          return { data: quadraData, source: 'sheets' }
        }
      }

      throw new Error('Erro ao criar quadra')
    } catch (error) {
      console.error('Erro no DataManager.createQuadra:', error)
      throw error
    }
  }

  // =============================================
  // MÉTODOS PARA RESERVAS
  // =============================================

  async getReservas() {
    try {
      if (this.config.useSupabase) {
        const { data, error } = await this.supabase
          .from('reservas_com_detalhes')
          .select('*')
          .order('data_inicio', { ascending: false })

        if (!error && data) {
          return { data, source: 'supabase' }
        }
      }

      // Fallback para planilha
      if (this.config.fallbackToSheets) {
        const response = await fetch('/api/sheets/read?sheet=reservas')
        const result = await response.json()
        
        if (result.ok) {
          const reservas = this.parseSheetData(result.values, 'reserva')
          return { data: reservas, source: 'sheets' }
        }
      }

      throw new Error('Erro ao buscar reservas')
    } catch (error) {
      console.error('Erro no DataManager.getReservas:', error)
      return { data: [], source: 'error', error }
    }
  }

  async createReserva(reservaData: any) {
    try {
      // 1. Verificar disponibilidade no Supabase
      if (this.config.useSupabase) {
        const { data: disponivel } = await this.supabase
          .rpc('check_quadra_availability', {
            p_quadra_id: reservaData.quadra_id,
            p_data_inicio: reservaData.data_inicio,
            p_data_fim: reservaData.data_fim
          })

        if (!disponivel) {
          throw new Error('Quadra não disponível neste horário')
        }

        // 2. Salvar no Supabase
        const { data, error } = await this.supabase
          .from('reservas')
          .insert([{
            ...reservaData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single()

        if (!error && data) {
          // 3. Sincronizar com planilha em background
          this.syncToSheets('reservas', data)
          return { data, source: 'supabase' }
        }
      }

      // Fallback: salvar direto na planilha
      if (this.config.useSheets) {
        const response = await fetch('/api/sheets/append', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sheet: 'reservas',
            data: this.formatForSheets(reservaData, 'reserva')
          })
        })

        const result = await response.json()
        if (result.ok) {
          return { data: reservaData, source: 'sheets' }
        }
      }

      throw new Error('Erro ao criar reserva')
    } catch (error) {
      console.error('Erro no DataManager.createReserva:', error)
      throw error
    }
  }

  // =============================================
  // MÉTODOS PARA DASHBOARD
  // =============================================

  async getDashboardStats() {
    try {
      if (this.config.useSupabase) {
        const { data, error } = await this.supabase
          .rpc('get_dashboard_stats')

        if (!error && data) {
          return { data, source: 'supabase' }
        }
      }

      // Fallback: calcular stats das planilhas
      if (this.config.fallbackToSheets) {
        const [reservasRes, clientesRes, quadrasRes] = await Promise.all([
          fetch('/api/sheets/read?sheet=reservas'),
          fetch('/api/sheets/read?sheet=clientes'),
          fetch('/api/sheets/read?sheet=quadras')
        ])

        const [reservas, clientes, quadras] = await Promise.all([
          reservasRes.json(),
          clientesRes.json(),
          quadrasRes.json()
        ])

        const stats = this.calculateStatsFromSheets(reservas, clientes, quadras)
        return { data: stats, source: 'sheets' }
      }

      throw new Error('Erro ao buscar estatísticas')
    } catch (error) {
      console.error('Erro no DataManager.getDashboardStats:', error)
      return { data: {}, source: 'error', error }
    }
  }

  // =============================================
  // MÉTODOS AUXILIARES
  // =============================================

  private parseSheetData(values: any[], type: string) {
    if (!values || values.length === 0) return []
    
    const headers = values[0]
    const rows = values.slice(1)
    
    return rows.map((row: any[], index: number) => {
      const item: any = { id: `${type}-${index}` }
      
      headers.forEach((header: string, colIndex: number) => {
        const value = row[colIndex] || ''
        const key = this.mapSheetHeader(header, type)
        item[key] = this.parseValue(value, key)
      })
      
      return item
    })
  }

  private mapSheetHeader(header: string, type: string): string {
    const headerLower = header.toLowerCase()
    
    switch (type) {
      case 'cliente':
        if (headerLower.includes('nome')) return 'nome'
        if (headerLower.includes('email')) return 'email'
        if (headerLower.includes('telefone')) return 'telefone'
        if (headerLower.includes('data')) return 'created_at'
        return headerLower.replace(/\s+/g, '_')
        
      case 'quadra':
        if (headerLower.includes('nome')) return 'nome'
        if (headerLower.includes('tipo')) return 'tipo'
        if (headerLower.includes('preco')) return 'preco_hora'
        if (headerLower.includes('ativa')) return 'ativa'
        return headerLower.replace(/\s+/g, '_')
        
      case 'reserva':
        if (headerLower.includes('cliente')) return 'cliente_id'
        if (headerLower.includes('quadra')) return 'quadra_id'
        if (headerLower.includes('data_inicio')) return 'data_inicio'
        if (headerLower.includes('data_fim')) return 'data_fim'
        if (headerLower.includes('valor')) return 'valor_total'
        return headerLower.replace(/\s+/g, '_')
        
      default:
        return headerLower.replace(/\s+/g, '_')
    }
  }

  private parseValue(value: any, key: string): any {
    if (key.includes('preco') || key.includes('valor')) {
      return parseFloat(value) || 0
    }
    if (key.includes('ativa') || key.includes('ativo')) {
      return value === 'true' || value === true
    }
    if (key.includes('data') || key.includes('created_at')) {
      return value || new Date().toISOString()
    }
    return value
  }

  private formatForSheets(data: any, type: string): any[] {
    switch (type) {
      case 'cliente':
        return [
          data.id || '',
          data.nome || '',
          data.email || '',
          data.telefone || '',
          data.created_at || new Date().toISOString()
        ]
        
      case 'quadra':
        return [
          data.id || '',
          data.nome || '',
          data.tipo || '',
          data.preco_hora || 0,
          data.capacidade || 0,
          data.ativa || true,
          data.descricao || '',
          data.imagem_url || '',
          data.equipamentos?.join(',') || '',
          data.created_at || new Date().toISOString()
        ]
        
      case 'reserva':
        return [
          data.id || '',
          data.cliente_id || '',
          data.quadra_id || '',
          data.professor_id || '',
          data.tipo || '',
          data.data_inicio || '',
          data.data_fim || '',
          data.valor_total || 0,
          data.status || 'pendente',
          data.observacoes || '',
          data.created_at || new Date().toISOString()
        ]
        
      default:
        return Object.values(data)
    }
  }

  private calculateStatsFromSheets(reservas: any, clientes: any, quadras: any) {
    const hoje = new Date().toISOString().split('T')[0]
    
    return {
      reservas_hoje: (reservas.values || []).filter((r: any[]) => {
        const dataReserva = new Date(r[5]).toISOString().split('T')[0]
        return dataReserva === hoje
      }).length,
      
      clientes_ativos: (clientes.values || []).length,
      
      receita_mes: (reservas.values || []).reduce((total: number, r: any[]) => {
        const valor = parseFloat(r[7]) || 0
        return total + valor
      }, 0),
      
      quadras_ativas: (quadras.values || []).filter((q: any[]) => q[5] === 'true').length,
      
      leads_novos: 0, // Implementar se necessário
      
      reservas_pendentes: (reservas.values || []).filter((r: any[]) => r[8] === 'pendente').length
    }
  }

  private async syncToSheets(sheet: string, data: any) {
    try {
      // Sincronização em background - não bloquear a resposta
      setTimeout(async () => {
        await fetch('/api/sheets/append', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sheet,
            data: this.formatForSheets(data, sheet.slice(0, -1)) // Remove 's' do final
          })
        })
      }, 100)
    } catch (error) {
      console.error(`Erro ao sincronizar ${sheet} com planilha:`, error)
    }
  }

  // =============================================
  // MÉTODO DE SINCRONIZAÇÃO COMPLETA
  // =============================================

  async syncAllData() {
    try {
      console.log('🔄 Iniciando sincronização completa...')
      
      // Buscar todos os dados do Supabase
      const [clientes, quadras, reservas] = await Promise.all([
        this.getClientes(),
        this.getQuadras(),
        this.getReservas()
      ])

      // Sincronizar com planilhas
      if (clientes.source === 'supabase') {
        await this.syncToSheets('clientes', clientes.data)
      }
      
      if (quadras.source === 'supabase') {
        await this.syncToSheets('quadras', quadras.data)
      }
      
      if (reservas.source === 'supabase') {
        await this.syncToSheets('reservas', reservas.data)
      }

      console.log('✅ Sincronização completa finalizada')
      return { success: true, message: 'Dados sincronizados com sucesso' }
    } catch (error) {
      console.error('❌ Erro na sincronização:', error)
      return { success: false, message: 'Erro na sincronização', error }
    }
  }
}

// Instância global do DataManager
export const dataManager = new DataManager({
  useSupabase: true,
  useSheets: true,
  fallbackToSheets: true,
  syncInterval: 5
})

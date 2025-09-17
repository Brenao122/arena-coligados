// lib/sheets-primary-manager.ts
// Sistema híbrido: Google Sheets (principal) + Supabase (backup)

import 'server-only'
import { google } from 'googleapis'
import { createClient } from '@supabase/supabase-js'
import { ENV } from '@/lib/env'

export interface SheetsPrimaryConfig {
  useSheets: boolean
  useSupabase: boolean
  syncInterval: number // em minutos
  backupToSupabase: boolean
}

export class SheetsPrimaryManager {
  private sheets: any
  private supabase: any
  private config: SheetsPrimaryConfig

  constructor(config: Partial<SheetsPrimaryConfig> = {}) {
    this.config = {
      useSheets: true,
      useSupabase: true,
      syncInterval: 5, // 5 minutos
      backupToSupabase: true,
      ...config
    }
    
    // Configurar Google Sheets
    this.initializeSheets()
    
    // Configurar Supabase para backup
    this.supabase = createClient(
      ENV.SUPABASE_URL,
      ENV.SUPABASE_SERVICE_ROLE_KEY
    )
  }

  private initializeSheets() {
    const auth = new google.auth.JWT({
      email: ENV.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: ENV.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
      ],
    })

    this.sheets = google.sheets({ version: 'v4', auth })
  }

  // =============================================
  // MÉTODOS PARA CLIENTES (PRINCIPAL: SHEETS)
  // =============================================
  async getClientes() {
    try {
      console.log('📊 [SHEETS-PRIMARY] Buscando clientes da planilha...')
      
      // 1. Buscar dados da planilha (PRINCIPAL)
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: ENV.GOOGLE_SHEETS_SPREADSHEET_ID,
        range: 'Clientes!A:F', // Ajuste conforme sua planilha
      })

      const rows = response.data.values || []
      const clientes = rows.slice(1).map((row: any[], index: number) => ({
        id: `cliente-${index + 1}`,
        nome: row[0] || '',
        email: row[1] || '',
        telefone: row[2] || '',
        data_cadastro: row[3] || new Date().toISOString(),
        status: row[4] || 'ativo',
        observacoes: row[5] || ''
      }))

      console.log(`✅ [SHEETS-PRIMARY] ${clientes.length} clientes encontrados na planilha`)

      // 2. Backup para Supabase (se habilitado)
      if (this.config.backupToSupabase) {
        await this.backupClientesToSupabase(clientes)
      }

      return {
        ok: true,
        data: clientes,
        source: 'sheets',
        count: clientes.length
      }

    } catch (error: any) {
      console.error('❌ [SHEETS-PRIMARY] Erro ao buscar clientes:', error.message)
      
      // Fallback para Supabase se Sheets falhar
      if (this.config.useSupabase) {
        console.log('🔄 [SHEETS-PRIMARY] Tentando fallback para Supabase...')
        return await this.getClientesFromSupabase()
      }

      return {
        ok: false,
        error: error.message,
        source: 'sheets-error'
      }
    }
  }

  // =============================================
  // MÉTODOS PARA QUADRAS (PRINCIPAL: SHEETS)
  // =============================================
  async getQuadras() {
    try {
      console.log('🏟️ [SHEETS-PRIMARY] Buscando quadras da planilha...')
      
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: ENV.GOOGLE_SHEETS_SPREADSHEET_ID,
        range: 'Quadras!A:G', // Ajuste conforme sua planilha
      })

      const rows = response.data.values || []
      const quadras = rows.slice(1).map((row: any[], index: number) => ({
        id: `quadra-${index + 1}`,
        nome: row[0] || '',
        tipo: row[1] || '',
        capacidade: parseInt(row[2]) || 0,
        preco_hora: parseFloat(row[3]) || 0,
        descricao: row[4] || '',
        ativo: row[5] === 'true' || row[5] === 'sim',
        unidade: row[6] || 'matriz'
      }))

      console.log(`✅ [SHEETS-PRIMARY] ${quadras.length} quadras encontradas na planilha`)

      // Backup para Supabase
      if (this.config.backupToSupabase) {
        await this.backupQuadrasToSupabase(quadras)
      }

      return {
        ok: true,
        data: quadras,
        source: 'sheets',
        count: quadras.length
      }

    } catch (error: any) {
      console.error('❌ [SHEETS-PRIMARY] Erro ao buscar quadras:', error.message)
      
      if (this.config.useSupabase) {
        console.log('🔄 [SHEETS-PRIMARY] Tentando fallback para Supabase...')
        return await this.getQuadrasFromSupabase()
      }

      return {
        ok: false,
        error: error.message,
        source: 'sheets-error'
      }
    }
  }

  // =============================================
  // MÉTODOS PARA RESERVAS (PRINCIPAL: SHEETS)
  // =============================================
  async getReservas() {
    try {
      console.log('📅 [SHEETS-PRIMARY] Buscando reservas da planilha...')
      
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: ENV.GOOGLE_SHEETS_SPREADSHEET_ID,
        range: 'Reservas!A:J', // Ajuste conforme sua planilha
      })

      const rows = response.data.values || []
      const reservas = rows.slice(1).map((row: any[], index: number) => ({
        id: `reserva-${index + 1}`,
        cliente_nome: row[0] || '',
        cliente_email: row[1] || '',
        quadra_nome: row[2] || '',
        data_inicio: row[3] || '',
        data_fim: row[4] || '',
        status: row[5] || 'pendente',
        valor: parseFloat(row[6]) || 0,
        observacoes: row[7] || '',
        data_criacao: row[8] || new Date().toISOString(),
        unidade: row[9] || 'matriz'
      }))

      console.log(`✅ [SHEETS-PRIMARY] ${reservas.length} reservas encontradas na planilha`)

      // Backup para Supabase
      if (this.config.backupToSupabase) {
        await this.backupReservasToSupabase(reservas)
      }

      return {
        ok: true,
        data: reservas,
        source: 'sheets',
        count: reservas.length
      }

    } catch (error: any) {
      console.error('❌ [SHEETS-PRIMARY] Erro ao buscar reservas:', error.message)
      
      if (this.config.useSupabase) {
        console.log('🔄 [SHEETS-PRIMARY] Tentando fallback para Supabase...')
        return await this.getReservasFromSupabase()
      }

      return {
        ok: false,
        error: error.message,
        source: 'sheets-error'
      }
    }
  }

  // =============================================
  // MÉTODOS PARA DASHBOARD (PRINCIPAL: SHEETS)
  // =============================================
  async getDashboardStats() {
    try {
      console.log('📊 [SHEETS-PRIMARY] Calculando estatísticas da planilha...')
      
      // Buscar dados de todas as abas
      const [clientesResult, quadrasResult, reservasResult] = await Promise.all([
        this.getClientes(),
        this.getQuadras(),
        this.getReservas()
      ])

      const clientes = clientesResult.data || []
      const quadras = quadrasResult.data || []
      const reservas = reservasResult.data || []

      // Calcular estatísticas
      const hoje = new Date().toISOString().split('T')[0]
      const reservasHoje = reservas.filter((r: any) => 
        r.data_inicio && r.data_inicio.startsWith(hoje)
      )

      const receitaMes = reservas
        .filter((r: any) => r.status === 'confirmada')
        .reduce((total: number, r: any) => total + (r.valor || 0), 0)

      const stats = {
        total_clientes: clientes.length,
        clientes_ativos: clientes.filter((c: any) => c.status === 'ativo').length,
        total_quadras: quadras.length,
        quadras_ativas: quadras.filter((q: any) => q.ativo).length,
        total_reservas: reservas.length,
        reservas_hoje: reservasHoje.length,
        reservas_pendentes: reservas.filter((r: any) => r.status === 'pendente').length,
        receita_mes: receitaMes,
        professores_ativos: 2 // Fixo por enquanto
      }

      console.log('✅ [SHEETS-PRIMARY] Estatísticas calculadas:', stats)

      return {
        ok: true,
        data: stats,
        source: 'sheets',
        details: {
          clientes_source: clientesResult.source,
          quadras_source: quadrasResult.source,
          reservas_source: reservasResult.source
        }
      }

    } catch (error: any) {
      console.error('❌ [SHEETS-PRIMARY] Erro ao calcular estatísticas:', error.message)
      
      if (this.config.useSupabase) {
        console.log('🔄 [SHEETS-PRIMARY] Tentando fallback para Supabase...')
        return await this.getDashboardStatsFromSupabase()
      }

      return {
        ok: false,
        error: error.message,
        source: 'sheets-error'
      }
    }
  }

  // =============================================
  // MÉTODOS DE BACKUP PARA SUPABASE
  // =============================================
  private async backupClientesToSupabase(clientes: any[]) {
    try {
      console.log('💾 [BACKUP] Sincronizando clientes para Supabase...')
      
      for (const cliente of clientes) {
        await this.supabase
          .from('profiles')
          .upsert({
            id: cliente.id,
            full_name: cliente.nome,
            email: cliente.email,
            phone: cliente.telefone,
            created_at: cliente.data_cadastro,
            role: 'cliente'
          })
      }
      
      console.log(`✅ [BACKUP] ${clientes.length} clientes sincronizados para Supabase`)
    } catch (error: any) {
      console.error('❌ [BACKUP] Erro ao sincronizar clientes:', error.message)
    }
  }

  private async backupQuadrasToSupabase(quadras: any[]) {
    try {
      console.log('💾 [BACKUP] Sincronizando quadras para Supabase...')
      
      for (const quadra of quadras) {
        await this.supabase
          .from('quadras')
          .upsert({
            id: quadra.id,
            nome: quadra.nome,
            tipo: quadra.tipo,
            capacidade: quadra.capacidade,
            preco_hora: quadra.preco_hora,
            descricao: quadra.descricao,
            ativo: quadra.ativo
          })
      }
      
      console.log(`✅ [BACKUP] ${quadras.length} quadras sincronizadas para Supabase`)
    } catch (error: any) {
      console.error('❌ [BACKUP] Erro ao sincronizar quadras:', error.message)
    }
  }

  private async backupReservasToSupabase(reservas: any[]) {
    try {
      console.log('💾 [BACKUP] Sincronizando reservas para Supabase...')
      
      for (const reserva of reservas) {
        await this.supabase
          .from('reservas')
          .upsert({
            id: reserva.id,
            cliente_nome: reserva.cliente_nome,
            cliente_email: reserva.cliente_email,
            quadra_nome: reserva.quadra_nome,
            data_inicio: reserva.data_inicio,
            data_fim: reserva.data_fim,
            status: reserva.status,
            valor: reserva.valor,
            observacoes: reserva.observacoes,
            created_at: reserva.data_criacao
          })
      }
      
      console.log(`✅ [BACKUP] ${reservas.length} reservas sincronizadas para Supabase`)
    } catch (error: any) {
      console.error('❌ [BACKUP] Erro ao sincronizar reservas:', error.message)
    }
  }

  // =============================================
  // MÉTODOS DE FALLBACK (SUPABASE)
  // =============================================
  private async getClientesFromSupabase() {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('role', 'cliente')

      if (error) throw error

      return {
        ok: true,
        data: data || [],
        source: 'supabase-fallback',
        count: data?.length || 0
      }
    } catch (error: any) {
      return {
        ok: false,
        error: error.message,
        source: 'supabase-error'
      }
    }
  }

  private async getQuadrasFromSupabase() {
    try {
      const { data, error } = await this.supabase
        .from('quadras')
        .select('*')

      if (error) throw error

      return {
        ok: true,
        data: data || [],
        source: 'supabase-fallback',
        count: data?.length || 0
      }
    } catch (error: any) {
      return {
        ok: false,
        error: error.message,
        source: 'supabase-error'
      }
    }
  }

  private async getReservasFromSupabase() {
    try {
      const { data, error } = await this.supabase
        .from('reservas')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        ok: true,
        data: data || [],
        source: 'supabase-fallback',
        count: data?.length || 0
      }
    } catch (error: any) {
      return {
        ok: false,
        error: error.message,
        source: 'supabase-error'
      }
    }
  }

  private async getDashboardStatsFromSupabase() {
    try {
      const [clientesResult, quadrasResult, reservasResult] = await Promise.all([
        this.getClientesFromSupabase(),
        this.getQuadrasFromSupabase(),
        this.getReservasFromSupabase()
      ])

      const clientes = clientesResult.data || []
      const quadras = quadrasResult.data || []
      const reservas = reservasResult.data || []

      const hoje = new Date().toISOString().split('T')[0]
      const reservasHoje = reservas.filter((r: any) => 
        r.data_inicio && r.data_inicio.startsWith(hoje)
      )

      const receitaMes = reservas
        .filter((r: any) => r.status === 'confirmada')
        .reduce((total: number, r: any) => total + (r.valor || 0), 0)

      const stats = {
        total_clientes: clientes.length,
        clientes_ativos: clientes.length,
        total_quadras: quadras.length,
        quadras_ativas: quadras.filter((q: any) => q.ativo).length,
        total_reservas: reservas.length,
        reservas_hoje: reservasHoje.length,
        reservas_pendentes: reservas.filter((r: any) => r.status === 'pendente').length,
        receita_mes: receitaMes,
        professores_ativos: 2
      }

      return {
        ok: true,
        data: stats,
        source: 'supabase-fallback'
      }
    } catch (error: any) {
      return {
        ok: false,
        error: error.message,
        source: 'supabase-error'
      }
    }
  }

  // =============================================
  // MÉTODO DE SINCRONIZAÇÃO MANUAL
  // =============================================
  async syncAllData() {
    console.log('🔄 [SYNC] Iniciando sincronização completa...')
    
    try {
      const [clientesResult, quadrasResult, reservasResult] = await Promise.all([
        this.getClientes(),
        this.getQuadras(),
        this.getReservas()
      ])

      const results = {
        clientes: clientesResult,
        quadras: quadrasResult,
        reservas: reservasResult,
        timestamp: new Date().toISOString()
      }

      console.log('✅ [SYNC] Sincronização completa finalizada')
      return {
        ok: true,
        data: results,
        message: 'Sincronização completa realizada com sucesso'
      }

    } catch (error: any) {
      console.error('❌ [SYNC] Erro na sincronização:', error.message)
      return {
        ok: false,
        error: error.message
      }
    }
  }
}

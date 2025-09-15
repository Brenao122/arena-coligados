/**
 * Script de Cron Jobs para Arena Coligados
 * Este arquivo contém as funções para automatizar tarefas do sistema
 */

import { supabase } from "@/lib/supabase-client"

// Interface para configuração de cron job
interface CronJobConfig {
  name: string
  description: string
  schedule: string // Expressão cron
  enabled: boolean
  lastRun?: string
  nextRun?: string
}

// Lista de jobs configurados
export const cronJobs: CronJobConfig[] = [
  {
    name: 'backup_diario',
    description: 'Backup diário do banco de dados',
    schedule: '0 2 * * *', // Todo dia às 2h da manhã
    enabled: true
  },
  {
    name: 'limpeza_notificacoes',
    description: 'Limpeza de notificações antigas',
    schedule: '0 3 * * 0', // Todo domingo às 3h da manhã
    enabled: true
  },
  {
    name: 'relatorio_semanal',
    description: 'Geração de relatório semanal',
    schedule: '0 9 * * 1', // Toda segunda-feira às 9h
    enabled: true
  },
  {
    name: 'verificacao_reservas',
    description: 'Verificação de reservas expiradas',
    schedule: '*/30 * * * *', // A cada 30 minutos
    enabled: true
  },
  {
    name: 'sincronizacao_google_sheets',
    description: 'Sincronização com Google Sheets',
    schedule: '0 */6 * * *', // A cada 6 horas
    enabled: true
  }
]

// Função para executar backup diário
export async function executarBackupDiario() {
  try {
    console.log('🔄 Executando backup diário...')
    
    const response = await fetch('/api/backup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tipo: 'full',
        salvar_google_sheets: true
      })
    })

    const result = await response.json()

    if (result.ok) {
      console.log('✅ Backup diário concluído com sucesso')
      return { success: true, data: result.data }
    } else {
      console.error('❌ Erro no backup diário:', result.error)
      return { success: false, error: result.error }
    }
  } catch (error: any) {
    console.error('❌ Erro ao executar backup diário:', error)
    return { success: false, error: error.message }
  }
}

// Função para limpeza de notificações antigas
export async function executarLimpezaNotificacoes() {
  try {
    console.log('🧹 Executando limpeza de notificações antigas...')
    
    // Deletar notificações lidas com mais de 30 dias
    const dataLimite = new Date()
    dataLimite.setDate(dataLimite.getDate() - 30)

    const { data, error } = await supabase
      .from('notifications')
      .delete()
      .eq('read', true)
      .lt('created_at', dataLimite.toISOString())

    if (error) {
      console.error('❌ Erro na limpeza de notificações:', error)
      return { success: false, error: error.message }
    }

    console.log('✅ Limpeza de notificações concluída')
    return { success: true, deleted: data?.length || 0 }
  } catch (error: any) {
    console.error('❌ Erro na limpeza de notificações:', error)
    return { success: false, error: error.message }
  }
}

// Função para gerar relatório semanal
export async function executarRelatorioSemanal() {
  try {
    console.log('📊 Gerando relatório semanal...')
    
    const inicioSemana = new Date()
    inicioSemana.setDate(inicioSemana.getDate() - 7)
    
    const response = await fetch(`/api/relatorios?tipo=ocupacao&periodo_inicio=${inicioSemana.toISOString()}&periodo_fim=${new Date().toISOString()}`)
    const result = await response.json()

    if (result.ok) {
      console.log('✅ Relatório semanal gerado com sucesso')
      
      // Aqui você poderia enviar o relatório por email para os administradores
      // await enviarRelatorioPorEmail(result.data)
      
      return { success: true, data: result.data }
    } else {
      console.error('❌ Erro na geração do relatório:', result.error)
      return { success: false, error: result.error }
    }
  } catch (error: any) {
    console.error('❌ Erro na geração do relatório semanal:', error)
    return { success: false, error: error.message }
  }
}

// Função para verificar reservas expiradas
export async function executarVerificacaoReservas() {
  try {
    console.log('⏰ Verificando reservas expiradas...')
    
    const agora = new Date().toISOString()
    
    // Buscar reservas que já passaram mas ainda estão como 'confirmada'
    const { data: reservasExpiradas, error } = await supabase
      .from('reservas')
      .select('*')
      .eq('status', 'confirmada')
      .lt('data_fim', agora)

    if (error) {
      console.error('❌ Erro ao buscar reservas expiradas:', error)
      return { success: false, error: error.message }
    }

    if (reservasExpiradas && reservasExpiradas.length > 0) {
      // Atualizar status para 'concluida'
      const { error: updateError } = await supabase
        .from('reservas')
        .update({ 
          status: 'concluida',
          updated_at: new Date().toISOString()
        })
        .in('id', reservasExpiradas.map(r => r.id))

      if (updateError) {
        console.error('❌ Erro ao atualizar reservas expiradas:', updateError)
        return { success: false, error: updateError.message }
      }

      console.log(`✅ ${reservasExpiradas.length} reservas marcadas como concluídas`)
      
      // Enviar notificações para os clientes
      for (const reserva of reservasExpiradas) {
        await fetch('/api/webhooks/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'reserva_concluida',
            reserva_id: reserva.id,
            cliente_id: reserva.cliente_id,
            message: `Sua reserva foi concluída! Esperamos que tenha aproveitado seu tempo na Arena Coligados.`,
            data: {
              quadra_id: reserva.quadra_id,
              data_inicio: reserva.data_inicio,
              data_fim: reserva.data_fim
            }
          })
        })
      }
    }

    return { success: true, processed: reservasExpiradas?.length || 0 }
  } catch (error: any) {
    console.error('❌ Erro na verificação de reservas:', error)
    return { success: false, error: error.message }
  }
}

// Função para sincronização com Google Sheets
export async function executarSincronizacaoGoogleSheets() {
  try {
    console.log('🔄 Executando sincronização com Google Sheets...')
    
    // Sincronizar dados de reservas
    const response = await fetch('/api/gs-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tabela: 'reservas',
        acao: 'sync'
      })
    })

    const result = await response.json()

    if (result.ok) {
      console.log('✅ Sincronização com Google Sheets concluída')
      return { success: true, data: result.data }
    } else {
      console.error('❌ Erro na sincronização:', result.error)
      return { success: false, error: result.error }
    }
  } catch (error: any) {
    console.error('❌ Erro na sincronização com Google Sheets:', error)
    return { success: false, error: error.message }
  }
}

// Função principal para executar todos os cron jobs
export async function executarTodosCronJobs() {
  console.log('🚀 Iniciando execução de todos os cron jobs...')
  
  const resultados = {}

  for (const job of cronJobs.filter(job => job.enabled)) {
    console.log(`\n📋 Executando: ${job.name} - ${job.description}`)
    
    try {
      let resultado = null
      
      switch (job.name) {
        case 'backup_diario':
          resultado = await executarBackupDiario()
          break
        case 'limpeza_notificacoes':
          resultado = await executarLimpezaNotificacoes()
          break
        case 'relatorio_semanal':
          resultado = await executarRelatorioSemanal()
          break
        case 'verificacao_reservas':
          resultado = await executarVerificacaoReservas()
          break
        case 'sincronizacao_google_sheets':
          resultado = await executarSincronizacaoGoogleSheets()
          break
        default:
          console.log(`⚠️ Job não implementado: ${job.name}`)
          resultado = { success: false, error: 'Job não implementado' }
      }
      
      resultados[job.name] = {
        ...resultado,
        executed_at: new Date().toISOString()
      }
      
      // Atualizar timestamp do último run
      job.lastRun = new Date().toISOString()
      
    } catch (error: any) {
      console.error(`❌ Erro no job ${job.name}:`, error)
      resultados[job.name] = {
        success: false,
        error: error.message,
        executed_at: new Date().toISOString()
      }
    }
  }

  console.log('\n🎉 Execução de cron jobs concluída!')
  return resultados
}

// Função para validar expressão cron (simplificada)
export function validarCronExpression(expression: string): boolean {
  const cronRegex = /^(\*|([0-5]?\d)) (\*|([01]?\d|2[0-3])) (\*|([012]?\d|3[01])) (\*|([0-6])) (\*|([012]?\d|3[01]))$/
  return cronRegex.test(expression)
}

// Função para calcular próximo run baseado na expressão cron (simplificada)
export function calcularProximoRun(expression: string): Date {
  // Implementação simplificada - em produção use uma biblioteca como 'node-cron'
  const agora = new Date()
  const proximo = new Date(agora)
  
  // Para demonstração, vamos calcular próximo run para algumas expressões comuns
  if (expression === '0 2 * * *') { // Backup diário às 2h
    proximo.setHours(2, 0, 0, 0)
    if (proximo <= agora) {
      proximo.setDate(proximo.getDate() + 1)
    }
  } else if (expression === '0 3 * * 0') { // Limpeza domingos às 3h
    proximo.setHours(3, 0, 0, 0)
    proximo.setDate(proximo.getDate() + (7 - proximo.getDay()))
  } else if (expression === '*/30 * * * *') { // A cada 30 minutos
    proximo.setMinutes(proximo.getMinutes() + 30)
  } else {
    // Fallback: próximo minuto
    proximo.setMinutes(proximo.getMinutes() + 1)
  }
  
  return proximo
}

// Atualizar próximos runs para todos os jobs
export function atualizarProximosRuns() {
  cronJobs.forEach(job => {
    if (job.enabled) {
      job.nextRun = calcularProximoRun(job.schedule).toISOString()
    }
  })
}

// Inicializar próximos runs
atualizarProximosRuns()


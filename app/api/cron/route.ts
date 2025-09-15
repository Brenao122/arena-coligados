import { NextResponse } from "next/server"
import { 
  executarTodosCronJobs, 
  executarBackupDiario,
  executarLimpezaNotificacoes,
  executarRelatorioSemanal,
  executarVerificacaoReservas,
  executarSincronizacaoGoogleSheets,
  cronJobs
} from "@/scripts/cron-jobs"

// GET - Listar cron jobs disponíveis
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const includeStats = searchParams.get('include_stats') === 'true'

    let jobsData = cronJobs.map(job => ({
      name: job.name,
      description: job.description,
      schedule: job.schedule,
      enabled: job.enabled,
      lastRun: job.lastRun,
      nextRun: job.nextRun
    }))

    if (includeStats) {
      // Adicionar estatísticas básicas (em produção, isso viria de um banco de dados)
      jobsData = jobsData.map(job => ({
        ...job,
        stats: {
          total_runs: Math.floor(Math.random() * 100),
          success_rate: Math.floor(Math.random() * 20) + 80, // 80-100%
          avg_duration_ms: Math.floor(Math.random() * 5000) + 1000 // 1-6 segundos
        }
      }))
    }

    return NextResponse.json({
      ok: true,
      data: jobsData,
      total: jobsData.length,
      enabled: jobsData.filter(job => job.enabled).length
    })

  } catch (error: any) {
    console.error('Erro ao listar cron jobs:', error)
    return NextResponse.json({
      ok: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// POST - Executar cron jobs
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { job_name = null, all = false, dry_run = false } = body

    if (!job_name && !all) {
      return NextResponse.json({
        ok: false,
        error: 'Especifique "job_name" para executar um job específico ou "all": true para executar todos'
      }, { status: 400 })
    }

    if (dry_run) {
      return NextResponse.json({
        ok: true,
        message: 'Dry run - nenhum job foi executado',
        data: {
          would_execute: job_name ? [job_name] : cronJobs.filter(job => job.enabled).map(job => job.name),
          dry_run: true
        }
      })
    }

    let resultados = {}

    if (all) {
      console.log('🚀 Executando todos os cron jobs...')
      resultados = await executarTodosCronJobs()
    } else {
      console.log(`🚀 Executando cron job específico: ${job_name}`)
      
      let resultado = null
      
      switch (job_name) {
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
          return NextResponse.json({
            ok: false,
            error: `Cron job "${job_name}" não encontrado ou não implementado`
          }, { status: 404 })
      }
      
      resultados = {
        [job_name]: {
          ...resultado,
          executed_at: new Date().toISOString()
        }
      }
    }

    // Calcular estatísticas dos resultados
    const totalJobs = Object.keys(resultados).length
    const successfulJobs = Object.values(resultados).filter((result: any) => result.success).length
    const failedJobs = totalJobs - successfulJobs

    return NextResponse.json({
      ok: failedJobs === 0,
      message: failedJobs === 0 ? 
        'Todos os cron jobs executados com sucesso' : 
        `${successfulJobs}/${totalJobs} cron jobs executados com sucesso`,
      data: {
        summary: {
          total: totalJobs,
          successful: successfulJobs,
          failed: failedJobs,
          success_rate: totalJobs > 0 ? Math.round((successfulJobs / totalJobs) * 100) : 0
        },
        results: resultados,
        executed_at: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('Erro na execução de cron jobs:', error)
    return NextResponse.json({
      ok: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// PUT - Atualizar configuração de cron job
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { job_name, enabled, schedule } = body

    if (!job_name) {
      return NextResponse.json({
        ok: false,
        error: 'Nome do job é obrigatório'
      }, { status: 400 })
    }

    // Encontrar o job
    const jobIndex = cronJobs.findIndex(job => job.name === job_name)
    
    if (jobIndex === -1) {
      return NextResponse.json({
        ok: false,
        error: `Cron job "${job_name}" não encontrado`
      }, { status: 404 })
    }

    // Atualizar configurações
    if (enabled !== undefined) {
      cronJobs[jobIndex].enabled = enabled
    }

    if (schedule) {
      // Validar expressão cron (implementação simplificada)
      const cronRegex = /^(\*|([0-5]?\d)) (\*|([01]?\d|2[0-3])) (\*|([012]?\d|3[01])) (\*|([0-6])) (\*|([012]?\d|3[01]))$/
      if (!cronRegex.test(schedule)) {
        return NextResponse.json({
          ok: false,
          error: 'Expressão cron inválida'
        }, { status: 400 })
      }
      
      cronJobs[jobIndex].schedule = schedule
    }

    return NextResponse.json({
      ok: true,
      message: 'Configuração do cron job atualizada com sucesso',
      data: {
        name: cronJobs[jobIndex].name,
        description: cronJobs[jobIndex].description,
        schedule: cronJobs[jobIndex].schedule,
        enabled: cronJobs[jobIndex].enabled,
        updated_at: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('Erro ao atualizar cron job:', error)
    return NextResponse.json({
      ok: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// DELETE - Desabilitar cron job
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const job_name = searchParams.get('job_name')

    if (!job_name) {
      return NextResponse.json({
        ok: false,
        error: 'Nome do job é obrigatório'
      }, { status: 400 })
    }

    // Encontrar o job
    const jobIndex = cronJobs.findIndex(job => job.name === job_name)
    
    if (jobIndex === -1) {
      return NextResponse.json({
        ok: false,
        error: `Cron job "${job_name}" não encontrado`
      }, { status: 404 })
    }

    // Desabilitar o job
    cronJobs[jobIndex].enabled = false

    return NextResponse.json({
      ok: true,
      message: `Cron job "${job_name}" desabilitado com sucesso`,
      data: {
        name: cronJobs[jobIndex].name,
        enabled: false,
        disabled_at: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('Erro ao desabilitar cron job:', error)
    return NextResponse.json({
      ok: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}




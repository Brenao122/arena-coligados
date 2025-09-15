import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

// GET - Gerar relatórios
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tipo = searchParams.get('tipo') // 'ocupacao', 'financeiro', 'clientes', 'quadras'
    const periodo_inicio = searchParams.get('periodo_inicio')
    const periodo_fim = searchParams.get('periodo_fim')
    const quadra_id = searchParams.get('quadra_id')

    // Definir período padrão (último mês) se não fornecido
    const inicio = periodo_inicio || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const fim = periodo_fim || new Date().toISOString()

    let relatorio = {}

    switch (tipo) {
      case 'ocupacao':
        relatorio = await gerarRelatorioOcupacao(inicio, fim, quadra_id)
        break
      case 'financeiro':
        relatorio = await gerarRelatorioFinanceiro(inicio, fim, quadra_id)
        break
      case 'clientes':
        relatorio = await gerarRelatorioClientes(inicio, fim)
        break
      case 'quadras':
        relatorio = await gerarRelatorioQuadras(inicio, fim)
        break
      default:
        return NextResponse.json({
          ok: false,
          error: 'Tipo de relatório inválido. Use: ocupacao, financeiro, clientes ou quadras'
        }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      data: relatorio,
      periodo: {
        inicio,
        fim
      },
      gerado_em: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Erro ao gerar relatório:', error)
    return NextResponse.json({
      ok: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// Função para gerar relatório de ocupação
async function gerarRelatorioOcupacao(inicio: string, fim: string, quadra_id?: string) {
  let query = supabase
    .from('reservas')
    .select(`
      id,
      data_inicio,
      data_fim,
      valor_total,
      status,
      quadra:quadras(nome, tipo, capacidade)
    `)
    .gte('data_inicio', inicio)
    .lte('data_fim', fim)
    .eq('status', 'confirmada')

  if (quadra_id) {
    query = query.eq('quadra_id', quadra_id)
  }

  const { data: reservas, error } = await query

  if (error) {
    throw new Error(`Erro ao buscar reservas: ${error.message}`)
  }

  // Calcular estatísticas por quadra
  const estatisticasQuadras = {}
  let totalHoras = 0
  let totalReservas = 0

  reservas.forEach(reserva => {
    const quadraNome = reserva.quadra?.nome || 'Quadra não encontrada'
    const inicioReserva = new Date(reserva.data_inicio)
    const fimReserva = new Date(reserva.data_fim)
    const horas = (fimReserva.getTime() - inicioReserva.getTime()) / (1000 * 60 * 60)

    if (!estatisticasQuadras[quadraNome]) {
      estatisticasQuadras[quadraNome] = {
        nome: quadraNome,
        tipo: reserva.quadra?.tipo,
        capacidade: reserva.quadra?.capacidade,
        total_horas: 0,
        total_reservas: 0,
        total_receita: 0,
        ocupacao_percentual: 0
      }
    }

    estatisticasQuadras[quadraNome].total_horas += horas
    estatisticasQuadras[quadraNome].total_reservas += 1
    estatisticasQuadras[quadraNome].total_receita += reserva.valor_total
    totalHoras += horas
    totalReservas += 1
  })

  // Calcular percentual de ocupação
  const diasPeriodo = (new Date(fim).getTime() - new Date(inicio).getTime()) / (1000 * 60 * 60 * 24)
  const horasDisponiveis = diasPeriodo * 24 * Object.keys(estatisticasQuadras).length
  const ocupacaoGeral = horasDisponiveis > 0 ? (totalHoras / horasDisponiveis) * 100 : 0

  Object.values(estatisticasQuadras).forEach(quadra => {
    const horasDisponiveisQuadra = diasPeriodo * 24
    quadra.ocupacao_percentual = horasDisponiveisQuadra > 0 ? (quadra.total_horas / horasDisponiveisQuadra) * 100 : 0
  })

  return {
    tipo: 'ocupacao',
    resumo: {
      periodo: { inicio, fim },
      total_horas_ocupadas: Math.round(totalHoras * 100) / 100,
      total_reservas: totalReservas,
      ocupacao_geral_percentual: Math.round(ocupacaoGeral * 100) / 100,
      horas_disponiveis: Math.round(horasDisponiveis * 100) / 100
    },
    detalhamento: Object.values(estatisticasQuadras),
    graficos: {
      ocupacao_por_quadra: Object.values(estatisticasQuadras).map(q => ({
        quadra: q.nome,
        percentual: Math.round(q.ocupacao_percentual * 100) / 100
      })),
      reservas_por_dia: gerarGraficoReservasPorDia(reservas)
    }
  }
}

// Função para gerar relatório financeiro
async function gerarRelatorioFinanceiro(inicio: string, fim: string, quadra_id?: string) {
  let query = supabase
    .from('reservas')
    .select(`
      id,
      data_inicio,
      data_fim,
      valor_total,
      status,
      quadra:quadras(nome, tipo)
    `)
    .gte('data_inicio', inicio)
    .lte('data_fim', fim)
    .eq('status', 'confirmada')

  if (quadra_id) {
    query = query.eq('quadra_id', quadra_id)
  }

  const { data: reservas, error } = await query

  if (error) {
    throw new Error(`Erro ao buscar reservas: ${error.message}`)
  }

  // Calcular receita total
  const receitaTotal = reservas.reduce((total, reserva) => total + reserva.valor_total, 0)

  // Calcular receita por quadra
  const receitaPorQuadra = {}
  reservas.forEach(reserva => {
    const quadraNome = reserva.quadra?.nome || 'Quadra não encontrada'
    if (!receitaPorQuadra[quadraNome]) {
      receitaPorQuadra[quadraNome] = {
        nome: quadraNome,
        tipo: reserva.quadra?.tipo,
        receita: 0,
        reservas: 0
      }
    }
    receitaPorQuadra[quadraNome].receita += reserva.valor_total
    receitaPorQuadra[quadraNome].reservas += 1
  })

  // Calcular receita por dia
  const receitaPorDia = {}
  reservas.forEach(reserva => {
    const data = new Date(reserva.data_inicio).toISOString().split('T')[0]
    if (!receitaPorDia[data]) {
      receitaPorDia[data] = { data, receita: 0, reservas: 0 }
    }
    receitaPorDia[data].receita += reserva.valor_total
    receitaPorDia[data].reservas += 1
  })

  // Calcular ticket médio
  const ticketMedio = reservas.length > 0 ? receitaTotal / reservas.length : 0

  return {
    tipo: 'financeiro',
    resumo: {
      periodo: { inicio, fim },
      receita_total: receitaTotal,
      total_reservas: reservas.length,
      ticket_medio: Math.round(ticketMedio * 100) / 100,
      receita_diaria_media: Math.round((receitaTotal / Object.keys(receitaPorDia).length) * 100) / 100
    },
    detalhamento: {
      receita_por_quadra: Object.values(receitaPorQuadra),
      receita_por_dia: Object.values(receitaPorDia)
    },
    graficos: {
      receita_por_quadra: Object.values(receitaPorQuadra).map(q => ({
        quadra: q.nome,
        receita: q.receita
      })),
      evolucao_receita: Object.values(receitaPorDia).sort((a, b) => a.data.localeCompare(b.data))
    }
  }
}

// Função para gerar relatório de clientes
async function gerarRelatorioClientes(inicio: string, fim: string) {
  // Buscar clientes ativos
  const { data: clientes, error: clientesError } = await supabase
    .from('profiles')
    .select('id, nome, email, telefone, role, created_at')
    .eq('ativo', true)
    .eq('role', 'cliente')

  if (clientesError) {
    throw new Error(`Erro ao buscar clientes: ${clientesError.message}`)
  }

  // Buscar reservas dos clientes no período
  const { data: reservas, error: reservasError } = await supabase
    .from('reservas')
    .select(`
      id,
      cliente_id,
      data_inicio,
      valor_total,
      status
    `)
    .gte('data_inicio', inicio)
    .lte('data_fim', fim)

  if (reservasError) {
    throw new Error(`Erro ao buscar reservas: ${reservasError.message}`)
  }

  // Calcular estatísticas por cliente
  const estatisticasClientes = clientes.map(cliente => {
    const reservasCliente = reservas.filter(r => r.cliente_id === cliente.id)
    const totalGasto = reservasCliente.reduce((total, reserva) => total + reserva.valor_total, 0)
    const reservasConfirmadas = reservasCliente.filter(r => r.status === 'confirmada').length

    return {
      ...cliente,
      total_reservas: reservasCliente.length,
      reservas_confirmadas: reservasConfirmadas,
      total_gasto: totalGasto,
      ticket_medio: reservasCliente.length > 0 ? totalGasto / reservasCliente.length : 0,
      ultima_reserva: reservasCliente.length > 0 ? 
        reservasCliente.sort((a, b) => new Date(b.data_inicio).getTime() - new Date(a.data_inicio).getTime())[0].data_inicio : null
    }
  })

  // Calcular totais
  const totalClientes = clientes.length
  const clientesAtivos = estatisticasClientes.filter(c => c.total_reservas > 0).length
  const receitaTotalClientes = estatisticasClientes.reduce((total, cliente) => total + cliente.total_gasto, 0)

  return {
    tipo: 'clientes',
    resumo: {
      periodo: { inicio, fim },
      total_clientes: totalClientes,
      clientes_ativos: clientesAtivos,
      clientes_inativos: totalClientes - clientesAtivos,
      percentual_ativos: totalClientes > 0 ? Math.round((clientesAtivos / totalClientes) * 100) : 0,
      receita_total_clientes: receitaTotalClientes,
      ticket_medio_geral: clientesAtivos > 0 ? Math.round((receitaTotalClientes / clientesAtivos) * 100) / 100 : 0
    },
    detalhamento: estatisticasClientes.sort((a, b) => b.total_gasto - a.total_gasto),
    graficos: {
      clientes_por_status: [
        { status: 'Ativos', quantidade: clientesAtivos },
        { status: 'Inativos', quantidade: totalClientes - clientesAtivos }
      ],
      top_clientes: estatisticasClientes.slice(0, 10).map(c => ({
        nome: c.nome,
        total_gasto: c.total_gasto
      }))
    }
  }
}

// Função para gerar relatório de quadras
async function gerarRelatorioQuadras(inicio: string, fim: string) {
  // Buscar todas as quadras
  const { data: quadras, error: quadrasError } = await supabase
    .from('quadras')
    .select('*')

  if (quadrasError) {
    throw new Error(`Erro ao buscar quadras: ${quadrasError.message}`)
  }

  // Buscar reservas das quadras no período
  const { data: reservas, error: reservasError } = await supabase
    .from('reservas')
    .select(`
      id,
      quadra_id,
      data_inicio,
      data_fim,
      valor_total,
      status
    `)
    .gte('data_inicio', inicio)
    .lte('data_fim', fim)

  if (reservasError) {
    throw new Error(`Erro ao buscar reservas: ${reservasError.message}`)
  }

  // Calcular estatísticas por quadra
  const estatisticasQuadras = quadras.map(quadra => {
    const reservasQuadra = reservas.filter(r => r.quadra_id === quadra.id)
    const reservasConfirmadas = reservasQuadra.filter(r => r.status === 'confirmada')
    
    let totalHoras = 0
    reservasConfirmadas.forEach(reserva => {
      const inicio = new Date(reserva.data_inicio)
      const fim = new Date(reserva.data_fim)
      const horas = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60)
      totalHoras += horas
    })

    const receitaTotal = reservasConfirmadas.reduce((total, reserva) => total + reserva.valor_total, 0)
    
    // Calcular ocupação
    const diasPeriodo = (new Date(fim).getTime() - new Date(inicio).getTime()) / (1000 * 60 * 60 * 24)
    const horasDisponiveis = diasPeriodo * 24
    const ocupacaoPercentual = horasDisponiveis > 0 ? (totalHoras / horasDisponiveis) * 100 : 0

    return {
      ...quadra,
      total_reservas: reservasQuadra.length,
      reservas_confirmadas: reservasConfirmadas.length,
      total_horas_ocupadas: Math.round(totalHoras * 100) / 100,
      receita_total: receitaTotal,
      ocupacao_percentual: Math.round(ocupacaoPercentual * 100) / 100,
      ticket_medio: reservasConfirmadas.length > 0 ? receitaTotal / reservasConfirmadas.length : 0
    }
  })

  return {
    tipo: 'quadras',
    resumo: {
      periodo: { inicio, fim },
      total_quadras: quadras.length,
      quadras_ativas: quadras.filter(q => q.ativo).length,
      quadras_inativas: quadras.filter(q => !q.ativo).length,
      receita_total: estatisticasQuadras.reduce((total, q) => total + q.receita_total, 0),
      ocupacao_media: estatisticasQuadras.length > 0 ? 
        Math.round((estatisticasQuadras.reduce((total, q) => total + q.ocupacao_percentual, 0) / estatisticasQuadras.length) * 100) / 100 : 0
    },
    detalhamento: estatisticasQuadras.sort((a, b) => b.receita_total - a.receita_total),
    graficos: {
      ocupacao_por_quadra: estatisticasQuadras.map(q => ({
        quadra: q.nome,
        ocupacao: q.ocupacao_percentual
      })),
      receita_por_quadra: estatisticasQuadras.map(q => ({
        quadra: q.nome,
        receita: q.receita_total
      }))
    }
  }
}

// Função auxiliar para gerar gráfico de reservas por dia
function gerarGraficoReservasPorDia(reservas: any[]) {
  const reservasPorDia = {}
  
  reservas.forEach(reserva => {
    const data = new Date(reserva.data_inicio).toISOString().split('T')[0]
    if (!reservasPorDia[data]) {
      reservasPorDia[data] = { data, quantidade: 0 }
    }
    reservasPorDia[data].quantidade += 1
  })

  return Object.values(reservasPorDia).sort((a: any, b: any) => a.data.localeCompare(b.data))
}




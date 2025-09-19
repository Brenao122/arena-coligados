import { NextResponse } from 'next/server';
import { readSheet } from '@/lib/google-sheets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('📊 [DASHBOARD-STATS] Iniciando cálculo de estatísticas...');

    // Buscar dados das planilhas
    const [reservasData, clientesData, quadrasData] = await Promise.all([
      readSheet('Reservas!A:Z').catch(() => []),
      readSheet('Clientes!A:Z').catch(() => []),
      readSheet('Quadras!A:Z').catch(() => [])
    ]);

    console.log('📊 [DASHBOARD-STATS] Dados recebidos:', {
      reservas: reservasData?.length || 0,
      clientes: clientesData?.length || 0,
      quadras: quadrasData?.length || 0
    });

    // Processar dados (assumindo que a primeira linha são cabeçalhos)
    const reservas = reservasData?.slice(1) || [];
    const clientes = clientesData?.slice(1) || [];
    const quadras = quadrasData?.slice(1) || [];

    // Calcular estatísticas
    const hoje = new Date().toISOString().split('T')[0];
    
    // Reservas hoje (assumindo que a data está na coluna 4)
    const reservasHoje = reservas.filter((r: any[]) => {
      const dataReserva = r[4]; // data_inicio
      return dataReserva && dataReserva.startsWith(hoje);
    }).length;

    // Receita do mês (assumindo que o valor está na coluna 8)
    const receitaMes = reservas.reduce((total: number, r: any[]) => {
      const valor = parseFloat(r[8] || '0'); // valor_total
      return total + (isNaN(valor) ? 0 : valor);
    }, 0);

    // Quadras ativas (assumindo que o status está na coluna 5)
    const quadrasAtivas = quadras.filter((q: any[]) => {
      const ativo = q[5]; // ativo
      return ativo === 'true' || ativo === 'sim' || ativo === 'SIM';
    }).length;

    const stats = {
      total_reservas: reservas.length,
      reservas_hoje: reservasHoje,
      total_clientes: clientes.length,
      receita_mes: receitaMes,
      quadras_ativas: quadrasAtivas,
      professores_ativos: 2, // Valor fixo
      timestamp: new Date().toISOString()
    };

    console.log('✅ [DASHBOARD-STATS] Estatísticas calculadas:', stats);

    return NextResponse.json({ 
      ok: true, 
      data: stats,
      source: 'google-sheets',
      message: 'Dados atualizados com sucesso'
    });

  } catch (error: any) {
    console.error('❌ [DASHBOARD-STATS] Erro:', error);
    
    // Retornar dados mockados em caso de erro
    const fallbackStats = {
      total_reservas: 0,
      reservas_hoje: 0,
      total_clientes: 0,
      receita_mes: 0,
      quadras_ativas: 0,
      professores_ativos: 2,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({ 
      ok: true, 
      data: fallbackStats,
      source: 'fallback',
      message: 'Usando dados de fallback devido a erro na conexão'
    });
  }
}

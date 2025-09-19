import { NextResponse } from 'next/server';
import { readSheet } from '@/lib/google-sheets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('📊 [DASHBOARD] Calculando estatísticas...');
    
    // Buscar dados de todas as abas
    const [reservas, clientes, quadras] = await Promise.all([
      readSheet('Reservas!A:Z'),
      readSheet('Clientes!A:Z'),
      readSheet('Quadras!A:Z')
    ]);

    // Processar dados
    const reservasData = reservas.slice(1); // Remove header
    const clientesData = clientes.slice(1); // Remove header
    const quadrasData = quadras.slice(1); // Remove header

    // Calcular estatísticas
    const hoje = new Date().toISOString().split('T')[0];
    const reservasHoje = reservasData.filter((r: any[]) => {
      const dataReserva = r[4]; // data_inicio na coluna 4
      return dataReserva && dataReserva.startsWith(hoje);
    });

    const receitaMes = reservasData.reduce((total: number, r: any[]) => {
      const valor = parseFloat(r[8] || 0); // valor_total na coluna 8
      return total + (isNaN(valor) ? 0 : valor);
    }, 0);

    const stats = {
      total_clientes: clientesData.length,
      clientes_ativos: clientesData.filter((c: any[]) => c[4] === 'ativo').length,
      total_quadras: quadrasData.length,
      quadras_ativas: quadrasData.filter((q: any[]) => q[5] === 'true' || q[5] === 'sim').length,
      total_reservas: reservasData.length,
      reservas_hoje: reservasHoje.length,
      reservas_pendentes: reservasData.filter((r: any[]) => r[7] === 'pendente').length,
      receita_mes: receitaMes,
      professores_ativos: 2 // Fixo por enquanto
    };

    console.log('✅ [DASHBOARD] Estatísticas calculadas:', stats);

    return NextResponse.json({
      ok: true,
      data: stats,
      source: 'sheets',
      details: {
        reservas_count: reservasData.length,
        clientes_count: clientesData.length,
        quadras_count: quadrasData.length
      }
    });

  } catch (error: any) {
    console.error('❌ [DASHBOARD] Erro ao calcular estatísticas:', error);
    
    return NextResponse.json({
      ok: false,
      error: error.message,
      source: 'error'
    }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { readSheet } from '@/lib/google-sheets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('📊 [SHEETS-PRIMARY/DASH] Calculando estatísticas...');

    const [reservasRaw, clientesRaw, quadrasRaw] = await Promise.all([
      readSheet('Reservas!A:Z'),
      readSheet('Clientes!A:Z'),
      readSheet('Quadras!A:Z'),
    ]);

    // Assume a primeira linha são os cabeçalhos
    const mapRowsToObjects = (rows: string[][]) => {
      if (!rows || rows.length === 0) return [];
      const headers = rows[0];
      return rows.slice(1).map(row => {
        const obj: { [key: string]: string | number | boolean } = {};
        headers.forEach((header, index) => {
          const value = row[index];
          // Tenta converter para número ou booleano se aplicável
          if (!isNaN(Number(value)) && value !== '') {
            obj[header.toLowerCase().replace(/\s/g, '_')] = Number(value);
          } else if (value?.toLowerCase() === 'true' || value?.toLowerCase() === 'false') {
            obj[header.toLowerCase().replace(/\s/g, '_')] = value.toLowerCase() === 'true';
          } else {
            obj[header.toLowerCase().replace(/\s/g, '_')] = value || '';
          }
        });
        return obj;
      });
    };

    const reservas = mapRowsToObjects(reservasRaw);
    const clientes = mapRowsToObjects(clientesRaw);
    const quadras = mapRowsToObjects(quadrasRaw);

    const hoje = new Date().toISOString().split('T')[0];
    const reservasHoje = reservas.filter((r: any) => r.data_inicio?.startsWith(hoje)).length;
    const reservasPendentes = reservas.filter((r: any) => r.status === 'pendente').length;
    const receitaMes = reservas
      .filter((r: any) => r.status === 'confirmada' && r.valor_total)
      .reduce((sum: number, r: any) => sum + Number(r.valor_total), 0);

    const stats = {
      total_clientes: clientes.length,
      clientes_ativos: clientes.filter((c: any) => c.status === 'ativo').length,
      total_quadras: quadras.length,
      quadras_ativas: quadras.filter((q: any) => q.ativo).length,
      total_reservas: reservas.length,
      reservas_hoje: reservasHoje,
      reservas_pendentes: reservasPendentes,
      receita_mes: receitaMes,
      professores_ativos: 2, // Valor fixo por enquanto
    };

    console.log('✅ [SHEETS-PRIMARY/DASH] Estatísticas calculadas:', stats);

    return NextResponse.json({ 
      ok: true, 
      data: stats,
      source: 'google-sheets-primary',
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error: any) {
    console.error('❌ [SHEETS-PRIMARY/DASH] Erro ao calcular estatísticas:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message 
    }, { status: 500 });
  }
}

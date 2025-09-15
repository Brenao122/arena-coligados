import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET - Estatísticas do dashboard
export async function GET() {
  try {
    const { data: stats, error } = await supabase.rpc('get_dashboard_stats');

    if (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    // Buscar dados adicionais
    const [
      { data: reservasHoje },
      { data: clientesAtivos },
      { data: quadrasAtivas },
      { data: leadsNovos }
    ] = await Promise.all([
      supabase
        .from('reservas')
        .select('*')
        .gte('data_inicio', new Date().toISOString().split('T')[0])
        .lt('data_inicio', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .eq('status', 'confirmada'),
      
      supabase
        .from('profiles')
        .select('id')
        .eq('role', 'cliente')
        .eq('ativo', true),
      
      supabase
        .from('quadras')
        .select('id')
        .eq('ativo', true),
      
      supabase
        .from('leads')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    const dashboardData = {
      ...stats,
      reservas_hoje_detalhes: reservasHoje || [],
      clientes_ativos_count: clientesAtivos?.length || 0,
      quadras_ativas_count: quadrasAtivas?.length || 0,
      leads_novos_detalhes: leadsNovos || [],
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      ok: true,
      data: dashboardData
    });
  } catch (error: any) {
    console.error('Erro na API do dashboard:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}



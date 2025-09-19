import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET - Listar reservas
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const cliente_id = searchParams.get('cliente_id');
    const data_inicio = searchParams.get('data_inicio');
    const data_fim = searchParams.get('data_fim');

    let query = supabase
      .from('reservas')
      .select(`
        *,
        cliente:profiles!cliente_id(nome, email, telefone),
        quadra:quadras(nome, tipo, preco_hora),
        professor:profiles!professor_id(nome, email)
      `)
      .order('data_inicio', { ascending: false });

    // Filtros opcionais
    if (status) query = query.eq('status', status);
    if (cliente_id) query = query.eq('cliente_id', cliente_id);
    if (data_inicio) query = query.gte('data_inicio', data_inicio);
    if (data_fim) query = query.lte('data_inicio', data_fim);

    const { data: reservas, error } = await query;

    if (error) {
      console.error('Erro ao buscar reservas:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      data: reservas,
      count: reservas?.length || 0
    });
  } catch (error: any) {
    console.error('Erro na API de reservas:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

// POST - Criar nova reserva
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Verificar disponibilidade da quadra
    const { data: disponivel } = await supabase.rpc('check_quadra_availability', {
      p_quadra_id: body.quadra_id,
      p_data_inicio: body.data_inicio,
      p_data_fim: body.data_fim
    });

    if (!disponivel) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Quadra não está disponível no horário solicitado' 
      }, { status: 400 });
    }

    const { data: reserva, error } = await supabase
      .from('reservas')
      .insert([body])
      .select(`
        *,
        cliente:profiles!cliente_id(nome, email, telefone),
        quadra:quadras(nome, tipo, preco_hora),
        professor:profiles!professor_id(nome, email)
      `)
      .single();

    if (error) {
      console.error('Erro ao criar reserva:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      data: reserva,
      message: 'Reserva criada com sucesso'
    });
  } catch (error: any) {
    console.error('Erro na API de reservas:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}




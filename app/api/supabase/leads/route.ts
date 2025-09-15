import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET - Listar leads
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const origem = searchParams.get('origem');

    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    // Filtros opcionais
    if (status) query = query.eq('status', status);
    if (origem) query = query.eq('origem', origem);

    const { data: leads, error } = await query;

    if (error) {
      console.error('Erro ao buscar leads:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      data: leads,
      count: leads?.length || 0
    });
  } catch (error: any) {
    console.error('Erro na API de leads:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

// POST - Criar novo lead
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { data: lead, error } = await supabase
      .from('leads')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar lead:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      data: lead,
      message: 'Lead criado com sucesso'
    });
  } catch (error: any) {
    console.error('Erro na API de leads:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

// PUT - Atualizar lead
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    
    const { data: lead, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar lead:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      data: lead,
      message: 'Lead atualizado com sucesso'
    });
  } catch (error: any) {
    console.error('Erro na API de leads:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}



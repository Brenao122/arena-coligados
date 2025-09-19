import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET - Listar todas as quadras
export async function GET() {
  try {
    const { data: quadras, error } = await supabase
      .from('quadras')
      .select('*')
      .eq('ativo', true)
      .order('nome');

    if (error) {
      console.error('Erro ao buscar quadras:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      data: quadras,
      count: quadras?.length || 0
    });
  } catch (error: any) {
    console.error('Erro na API de quadras:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

// POST - Criar nova quadra
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { data: quadra, error } = await supabase
      .from('quadras')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar quadra:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      data: quadra,
      message: 'Quadra criada com sucesso'
    });
  } catch (error: any) {
    console.error('Erro na API de quadras:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}




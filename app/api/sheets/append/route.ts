import { NextResponse } from 'next/server';
import { appendRow } from '@/lib/google-sheets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type AppendBody = {
  sheet?: string;          // aba, ex: 'leads'
  values: (string | number | null)[][]; // linhas a inserir
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AppendBody;
    const sheet = body.sheet ?? 'leads';
    const values = body.values;
    
    if (!Array.isArray(values) || values.length === 0) {
      return NextResponse.json({ ok: false, error: 'values inválido' }, { status: 400 });
    }

    const range = `${sheet}!A1`;
    
    // Adicionar cada linha individualmente
    const results = [];
    for (const row of values) {
      const result = await appendRow(range, row);
      results.push(result);
    }

    return NextResponse.json({ ok: true, updates: results });
  } catch (err: any) {
    console.error("APPEND ERROR:", err);
    return NextResponse.json(
      { ok: false, message: err?.message ?? "Erro ao adicionar dados" },
      { status: 500 }
    );
  }
}
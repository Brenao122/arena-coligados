export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { appendRow } from '@/lib/google-sheets';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sheet: string = body.sheet || 'Reservas';
    const values: (string | number | null)[] = body.values || [];
    
    console.log(`📝 [API] Adicionando dados à planilha: ${sheet}`);
    console.log(`📝 [API] Dados:`, values);
    
    if (!Array.isArray(values) || values.length === 0) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Valores inválidos - deve ser um array não vazio' 
      }, { status: 400 });
    }

    // Usar a biblioteca que tem credenciais hardcoded e funciona
    const result = await appendRow(`${sheet}!A1`, values);
    
    console.log(`✅ [API] Dados adicionados com sucesso`);
    
    return NextResponse.json({ 
      ok: true, 
      message: 'Dados adicionados com sucesso',
      result 
    }, { status: 200 });
    
  } catch (err: any) {
    console.error('❌ [API] Erro ao adicionar dados:', err);
    return NextResponse.json({ 
      ok: false, 
      error: String(err?.message ?? err) 
    }, { status: 500 });
  }
}
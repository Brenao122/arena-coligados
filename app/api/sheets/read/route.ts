export const runtime = 'nodejs'; // googleapis precisa de Node runtime

import { NextResponse } from 'next/server';
import { readSheet } from '@/lib/google-sheets';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sheet = url.searchParams.get('sheet') || 'Reservas';
    
    console.log(`📖 [API] Lendo planilha: ${sheet}`);
    
    // Usar a biblioteca que tem credenciais hardcoded e funciona
    const values = await readSheet(`${sheet}!A:Z`);
    
    console.log(`✅ [API] Dados lidos: ${values.length} linhas`);
    
    return NextResponse.json({ 
      ok: true, 
      sheet, 
      count: values.length, 
      values 
    }, { status: 200 });
    
  } catch (err: any) {
    console.error('❌ [API] Erro ao ler planilha:', err);
    return NextResponse.json({ 
      ok: false, 
      error: String(err?.message ?? err) 
    }, { status: 500 });
  }
}
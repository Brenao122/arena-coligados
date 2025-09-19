import { NextResponse } from 'next/server';
import { readSheet } from '@/lib/google-sheets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🧪 [TEST] Iniciando teste da API Google Sheets...');
    
    // Testar com a biblioteca que tem credenciais hardcoded
    const values = await readSheet('Reservas!A:Z');
    
    console.log('✅ [TEST] Dados lidos com sucesso:', values.length, 'linhas');
    
    return NextResponse.json({
      ok: true,
      message: 'Teste bem-sucedido',
      rows: values.length,
      data: values.slice(0, 3) // Primeiras 3 linhas para debug
    });
    
  } catch (error: any) {
    console.error('❌ [TEST] Erro no teste:', error);
    
    return NextResponse.json({
      ok: false,
      message: 'Erro no teste',
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

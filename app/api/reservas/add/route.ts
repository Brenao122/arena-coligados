import { NextResponse } from 'next/server';
import { appendRow } from '@/lib/google-sheets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📝 [RESERVAS/ADD] Nova reserva recebida:', body);

    // Validar dados obrigatórios
    const { cliente_id, quadra_id, data_inicio, data_fim, valor_total, tipo, professor_id, observacoes } = body;

    if (!cliente_id || !quadra_id || !data_inicio || !data_fim || !valor_total) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Dados obrigatórios não fornecidos' 
      }, { status: 400 });
    }

    // Criar ID único para a reserva
    const reserva_id = `reserva-${Date.now()}`;

    // Preparar dados para inserção na planilha
    const reservaData = [
      reserva_id,
      cliente_id,
      quadra_id,
      professor_id || '',
      tipo || 'aula',
      data_inicio,
      data_fim,
      valor_total,
      'pendente', // status
      observacoes || '',
      new Date().toISOString(), // created_at
      new Date().toISOString()  // updated_at
    ];

    // Inserir na planilha
    await appendRow('Reservas!A1', reservaData);

    console.log('✅ [RESERVAS/ADD] Reserva adicionada com sucesso:', reserva_id);

    return NextResponse.json({ 
      ok: true, 
      message: 'Reserva adicionada com sucesso',
      data: {
        id: reserva_id,
        status: 'pendente'
      }
    });

  } catch (error: any) {
    console.error('❌ [RESERVAS/ADD] Erro ao adicionar reserva:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message || 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

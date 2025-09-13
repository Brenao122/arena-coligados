export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { appendRows } from '@/lib/google-sheets';

export async function POST(request: Request) {
  try {
    const { sheet, rows } = await request.json();
    if (!sheet || !Array.isArray(rows)) {
      return NextResponse.json({ ok: false, error: 'payload inválido' }, { status: 400 });
    }
    await appendRows(sheet, rows);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

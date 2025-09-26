export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { readRows } from '@/lib/google-sheets';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sheet = url.searchParams.get('sheet');
    if (!sheet) return NextResponse.json({ ok: false, error: 'sheet requerido' }, { status: 400 });
    const rows = await readRows(sheet);
    return NextResponse.json({ ok: true, rows });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

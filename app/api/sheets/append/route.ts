export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { appendObject } from '@/lib/googleSheets';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sheet: string = body.sheet || 'reservas';
    const data: Record<string, any> = body.data || {};
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
    if (!spreadsheetId) throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID ausente');

    await appendObject(spreadsheetId, sheet, data);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 });
  }
}
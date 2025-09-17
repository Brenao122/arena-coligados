export const runtime = 'nodejs'; // googleapis precisa de Node runtime

import { NextResponse } from 'next/server';
import { readSheetAsObjects } from '@/lib/google-sheets';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sheet = url.searchParams.get('sheet') || 'reservas';
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
    if (!spreadsheetId) throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID ausente');

    const data = await readSheetAsObjects(spreadsheetId, sheet);
    return NextResponse.json({ ok: true, sheet, count: data.length, data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 });
  }
}
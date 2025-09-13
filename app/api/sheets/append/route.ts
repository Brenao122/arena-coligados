import { NextResponse } from 'next/server';
import { getSheetsClient, getSpreadsheetId } from '@/lib/google/sheets';
import { formatSheetRange } from '@/lib/google/sheets-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type AppendBody = {
  sheet?: string;          // aba, ex: 'leads'
  values: (string | number | null)[][]; // linhas a inserir
  userEntered?: boolean;   // default: true (USER_ENTERED)
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AppendBody;
    const sheet = body.sheet ?? 'leads';
    const values = body.values;
    if (!Array.isArray(values) || !Array.isArray(values[0])) {
      return NextResponse.json({ ok: false, error: 'values inválido' }, { status: 400 });
    }

    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    const range = formatSheetRange(sheet, 'A1');
    const valueInputOption = body.userEntered !== false ? 'USER_ENTERED' : 'RAW';

    const { data } = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values },
    });

    return NextResponse.json({ ok: true, updates: data.updates ?? null });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
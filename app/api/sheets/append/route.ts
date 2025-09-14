import { NextResponse } from 'next/server';
import { appendToGoogleSheet } from "@/lib/google-sheets-auth";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type AppendBody = {
  sheet?: string;          // aba, ex: 'Leads'
  values: (string | number | null)[][]; // linhas a inserir
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AppendBody;
    const sheet = body.sheet ?? 'Leads';
    const values = body.values;
    
    if (!Array.isArray(values) || values.length === 0) {
      return NextResponse.json({ ok: false, error: 'values inválido' }, { status: 400 });
    }

    console.log(`Appending to sheet: ${sheet}, rows: ${values.length}`);

    const range = `${sheet}!A1`;
    const result = await appendToGoogleSheet(range, values);

    return NextResponse.json({ 
      ok: true, 
      result,
      sheet,
      range,
      rowsAdded: values.length
    });
  } catch (err: any) {
    console.error("APPEND ERROR:", JSON.stringify({
      message: err?.message,
      stack: err?.stack,
      body: req.body,
      env: {
        hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
        hasServiceEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        hasSpreadsheetId: !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID
      }
    }, null, 2));
    
    return NextResponse.json({
      ok: false,
      message: err?.message || "Failed to append to Google Sheet",
      error: process.env.NODE_ENV === 'development' ? err?.stack : undefined
    }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { appendRow } from "@/lib/google-sheets";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type AppendBody = {
  sheet?: string;
  values: (string | number | null)[][];
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
    const results = [];
    
    // Adicionar cada linha individualmente
    for (const row of values) {
      const result = await appendRow(range, row);
      results.push(result);
    }

    return NextResponse.json({ 
      ok: true, 
      results,
      sheet,
      range,
      rowsAdded: values.length
    });
  } catch (error: any) {
    console.error("APPEND ERROR:", error);
    return NextResponse.json({
      ok: false,
      message: error?.message || "Failed to append to Google Sheet"
    }, { status: 500 });
  }
}
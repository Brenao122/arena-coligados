import { NextResponse } from "next/server";
import { getSheetsClient, getSpreadsheetId } from "@/lib/google/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sheet = searchParams.get("sheet") ?? "leads";
    const range = searchParams.get("range") ?? `${sheet}!A1:Z1000`;

    console.log(`📖 Lendo planilha: ${sheet}, range: ${range}`);

    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    const { data } = await sheets.spreadsheets.values.get({ 
      spreadsheetId, 
      range 
    });
    
    const values = data.values ?? [];
    console.log(`✅ Dados lidos: ${values.length} linhas`);
    
    return NextResponse.json({ 
      ok: true, 
      values,
      count: values.length,
      sheet,
      range 
    });
    
  } catch (e: any) {
    console.error("❌ Erro ao ler planilha:", e);
    return NextResponse.json({ 
      ok: false, 
      error: String(e?.message ?? e),
      details: "Verifique se a aba existe e se as credenciais estão corretas"
    }, { status: 500 });
  }
}
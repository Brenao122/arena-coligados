import { NextResponse } from "next/server";
import { getSheetsClient, getSpreadsheetId } from "@/lib/google/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("🔍 Testando autenticação Google Sheets...");
    
    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();
    
    console.log("📊 Spreadsheet ID:", spreadsheetId);
    
    // Testa apenas o acesso à planilha (sem range específico)
    const { data } = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: "properties.title,sheets.properties.title"
    });
    
    const title = data.properties?.title || "Planilha sem título";
    const sheetsList = data.sheets?.map(s => s.properties?.title).filter(Boolean) || [];
    
    console.log("✅ Autenticação OK - Título:", title);
    console.log("📋 Abas disponíveis:", sheetsList);
    
    return NextResponse.json({ 
      ok: true, 
      title,
      sheets: sheetsList,
      message: "Conexão com Google Sheets funcionando!" 
    });
    
  } catch (e: any) {
    console.error("❌ Erro na autenticação Google Sheets:", e);
    return NextResponse.json({ 
      ok: false, 
      error: String(e?.message ?? e),
      details: "Verifique as credenciais no .env.local"
    }, { status: 500 });
  }
}

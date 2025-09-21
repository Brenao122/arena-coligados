import { NextResponse } from "next/server"
import { readSheetData, listAllSheets } from "@/lib/integrations/google-sheets-complete"

export async function GET() {
  try {
    console.log("[v0] Testando conexão com Google Sheets...")

    const sheets = await listAllSheets()
    console.log("[v0] Abas encontradas:", sheets)

    let sampleData = null
    if (sheets.length > 0) {
      try {
        sampleData = await readSheetData(sheets[0])
        console.log(`[v0] Dados da aba '${sheets[0]}':`, sampleData?.slice(0, 3))
      } catch (error) {
        console.log(`[v0] Erro ao ler aba '${sheets[0]}':`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Conexão com Google Sheets funcionando!",
      sheets,
      sampleDataCount: sampleData?.length || 0,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Erro no teste do Google Sheets:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao conectar com Google Sheets",
        details: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

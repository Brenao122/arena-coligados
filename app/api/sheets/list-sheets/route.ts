import { NextResponse } from "next/server"
import { listAllSheets } from "@/lib/integrations/google-sheets-complete"

export async function GET() {
  try {
    const sheets = await listAllSheets()

    return NextResponse.json({
      success: true,
      sheets,
      message: `Encontradas ${sheets.length} abas na planilha`,
    })
  } catch (error) {
    console.error("Erro ao listar abas da planilha:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao conectar com Google Sheets",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

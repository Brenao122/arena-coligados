import { NextResponse } from "next/server"
import { readSheetData } from "@/lib/integrations/google-sheets-complete"

export async function GET() {
  try {
    console.log("[v0] Iniciando busca de reservas...")
    const data = await readSheetData("reservas")
    console.log("[v0] ✅ Reservas carregadas com sucesso:", data.length)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] ❌ Erro ao buscar reservas:", error)
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    return NextResponse.json(
      {
        error: "Erro ao conectar com Google Sheets",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}

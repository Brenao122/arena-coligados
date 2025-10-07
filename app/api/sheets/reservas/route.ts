import { NextResponse } from "next/server"
import { readSheetData } from "@/lib/integrations/google-sheets-complete"

export async function GET() {
  try {
    const data = await readSheetData("Página1")
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Erro ao buscar reservas:", error)
    return NextResponse.json({ error: "Erro ao conectar com Google Sheets" }, { status: 500 })
  }
}

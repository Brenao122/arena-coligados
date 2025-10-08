import { NextResponse } from "next/server"
import { readSheetData } from "@/lib/integrations/google-sheets-complete"

export async function GET() {
  try {
    const data = await readSheetData("Pagamentos")
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao buscar pagamentos:", error)
    return NextResponse.json({ error: "Erro ao conectar com Google Sheets" }, { status: 500 })
  }
}

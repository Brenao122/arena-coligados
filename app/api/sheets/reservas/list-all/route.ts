import { NextResponse } from "next/server"
import { google } from "googleapis"

export async function GET() {
  try {
    console.log("[v0] Buscando todas as reservas...")

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "leads - quadra!A:N",
    })

    const rows = response.data.values || []
    if (rows.length === 0) {
      return NextResponse.json({ reservas: [] })
    }

    const headers = rows[0]
    const reservas = rows.slice(1).map((row) => {
      const reserva: any = {}
      headers.forEach((header: string, index: number) => {
        reserva[header] = row[index] || ""
      })
      return reserva
    })

    console.log("[v0] Total de reservas encontradas:", reservas.length)

    return NextResponse.json({ reservas })
  } catch (error) {
    console.error("[v0] Erro ao buscar reservas:", error)
    return NextResponse.json(
      { error: "Erro ao buscar reservas", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}

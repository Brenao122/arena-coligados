import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

export async function GET(request: NextRequest) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "leads - quadra!A:O",
    })

    const rows = response.data.values || []
    const bloqueios: any[] = []

    // Filtrar apenas bloqueios ativos
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      if (row[5] === "BLOQUEIO" && row[10] === "CONFIRMADA") {
        bloqueios.push({
          timestamp: row[0],
          data: row[1],
          unidade: row[2],
          quadra: row[3],
          horarios: row[4],
          motivo: row[14] || "Sem motivo especificado",
        })
      }
    }

    return NextResponse.json({ bloqueios })
  } catch (error) {
    console.error("[v0] Erro ao listar bloqueios:", error)
    return NextResponse.json(
      { error: "Erro ao listar bloqueios", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}

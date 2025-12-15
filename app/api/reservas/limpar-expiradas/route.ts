import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Limpando reservas PENDENTES expiradas...")

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
      range: "leads - quadra!A:K",
    })

    const rows = response.data.values || []
    const agora = new Date()
    let canceladas = 0

    // Percorrer todas as linhas (começar em 1 para pular header)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      const timestamp = row[0]
      const status = row[10]

      // Se for PENDENTE
      if (status === "PENDENTE") {
        const timestampReserva = new Date(timestamp)
        const diferencaMinutos = (agora.getTime() - timestampReserva.getTime()) / 1000 / 60

        // Se passou mais de 15 minutos, cancelar
        if (diferencaMinutos > 15) {
          const rowIndex = i + 1 // +1 porque Sheets usa indexação 1-based

          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `leads - quadra!K${rowIndex}`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
              values: [["EXPIRADA"]],
            },
          })

          canceladas++
          console.log(`[v0] Reserva expirada cancelada na linha ${rowIndex}`)
        }
      }
    }

    console.log(`[v0] ${canceladas} reservas expiradas foram canceladas`)

    return NextResponse.json({
      success: true,
      message: `${canceladas} reservas PENDENTES expiradas foram canceladas`,
      canceladas,
    })
  } catch (error) {
    console.error("[v0] Erro ao limpar reservas expiradas:", error)
    return NextResponse.json(
      {
        error: "Erro ao limpar reservas expiradas",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

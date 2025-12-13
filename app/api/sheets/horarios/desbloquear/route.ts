import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

export async function POST(request: NextRequest) {
  try {
    const { data, unidade, quadra, horarios } = await request.json()

    console.log("[v0] Desbloqueando horários:", { data, unidade, quadra, horarios })

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    // Buscar todas as linhas
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "leads - quadra!A:O",
    })

    const rows = response.data.values || []

    // Encontrar a linha do bloqueio
    let rowIndex = -1
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      if (
        row[1] === data &&
        row[2] === unidade &&
        row[3] === quadra &&
        row[4] === horarios &&
        row[5] === "BLOQUEIO" &&
        row[10] === "CONFIRMADA"
      ) {
        rowIndex = i + 1
        break
      }
    }

    if (rowIndex === -1) {
      return NextResponse.json({ error: "Bloqueio não encontrado" }, { status: 404 })
    }

    // Atualizar status para CANCELADA
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `leads - quadra!K${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [["CANCELADA"]],
      },
    })

    console.log("[v0] Horário desbloqueado com sucesso!")

    return NextResponse.json({ success: true, message: "Horário desbloqueado com sucesso" })
  } catch (error) {
    console.error("[v0] Erro ao desbloquear horário:", error)
    return NextResponse.json(
      { error: "Erro ao desbloquear horário", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}

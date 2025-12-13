import { NextResponse } from "next/server"
import { google } from "googleapis"

export async function POST(request: Request) {
  try {
    const { paymentId, status } = await request.json()

    console.log("[v0] Atualizando status da reserva:", { paymentId, status })

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    // Buscar todas as reservas
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "leads - quadra!A:Z",
    })

    const rows = response.data.values || []
    const headers = rows[0]
    const paymentIdIndex = headers.indexOf("payment_id")
    const statusIndex = headers.indexOf("status")

    if (paymentIdIndex === -1 || statusIndex === -1) {
      console.error("[v0] Colunas não encontradas na planilha")
      return NextResponse.json({ error: "Estrutura da planilha inválida" }, { status: 500 })
    }

    // Encontrar a linha com o payment_id
    let rowIndex = -1
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][paymentIdIndex] === paymentId) {
        rowIndex = i + 1 // +1 porque Sheets usa indexação 1-based
        break
      }
    }

    if (rowIndex === -1) {
      console.error("[v0] Reserva não encontrada para payment_id:", paymentId)
      return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 })
    }

    // Atualizar o status
    const columnLetter = String.fromCharCode(65 + statusIndex) // A=65, B=66, etc
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `leads - quadra!${columnLetter}${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[status]],
      },
    })

    console.log("[v0] Status atualizado com sucesso na linha:", rowIndex)

    return NextResponse.json({ success: true, rowIndex })
  } catch (error) {
    console.error("[v0] Erro ao atualizar status:", error)
    return NextResponse.json(
      {
        error: "Erro ao atualizar status",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

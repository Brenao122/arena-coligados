import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] ===== WEBHOOK ASAAS RECEBIDO =====")
    console.log("[v0] Event:", body.event)
    console.log("[v0] Payment ID:", body.payment?.id)
    console.log("[v0] Status:", body.payment?.status)

    if (!body.event || !body.payment) {
      console.error("[v0] Webhook inválido:", body)
      return NextResponse.json({ error: "Webhook inválido" }, { status: 400 })
    }

    // Processar apenas pagamentos confirmados/recebidos
    if (body.event === "PAYMENT_RECEIVED" || body.event === "PAYMENT_CONFIRMED") {
      console.log("[v0] ✅ Pagamento confirmado, atualizando status...")

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

        // Buscar todas as reservas
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: "leads - quadra!A:N",
        })

        const rows = response.data.values || []
        const headers = rows[0]
        const paymentIdIndex = headers.indexOf("payment_id")
        const statusIndex = headers.indexOf("status")

        if (paymentIdIndex === -1 || statusIndex === -1) {
          console.error("[v0] Colunas payment_id ou status não encontradas")
          return NextResponse.json({ error: "Estrutura da planilha inválida" }, { status: 500 })
        }

        // Encontrar a linha com o payment_id
        let rowIndex = -1
        for (let i = 1; i < rows.length; i++) {
          if (rows[i][paymentIdIndex] === body.payment.id) {
            rowIndex = i + 1 // +1 porque Sheets usa indexação 1-based
            break
          }
        }

        if (rowIndex === -1) {
          console.error("[v0] Reserva não encontrada para payment_id:", body.payment.id)
          return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 })
        }

        // Atualizar o status para CONFIRMADA
        const columnLetter = String.fromCharCode(65 + statusIndex) // A=65, B=66, etc
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `leads - quadra!${columnLetter}${rowIndex}`,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [["CONFIRMADA"]],
          },
        })

        console.log("[v0] ✅ Status atualizado para CONFIRMADA na linha:", rowIndex)
      } catch (error) {
        console.error("[v0] Erro ao atualizar status:", error)
        // Não retornar erro para o ASAAS continuar tentando
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao processar webhook:", error)
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 })
  }
}

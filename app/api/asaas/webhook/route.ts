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

        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: "leads - quadra!A:N",
        })

        const rows = response.data.values || []
        const headers = rows[0]
        const paymentIdIndex = headers.indexOf("payment_id")
        const statusIndex = headers.indexOf("status")
        const telefoneIndex = headers.indexOf("telefone")
        const nomeIndex = headers.indexOf("nome")
        const dataIndex = headers.indexOf("data")
        const horariosIndex = headers.indexOf("horarios")
        const unidadeIndex = headers.indexOf("unidade")
        const quadraIndex = headers.indexOf("quadra")
        const modalidadeIndex = headers.indexOf("modalidade")

        if (paymentIdIndex === -1 || statusIndex === -1) {
          console.error("[v0] Colunas payment_id ou status não encontradas")
          return NextResponse.json({ error: "Estrutura da planilha inválida" }, { status: 500 })
        }

        let rowIndex = -1
        let clienteData: any = {}

        for (let i = 1; i < rows.length; i++) {
          if (rows[i][paymentIdIndex] === body.payment.id) {
            rowIndex = i + 1
            clienteData = {
              telefone: rows[i][telefoneIndex],
              nome: rows[i][nomeIndex],
              data: rows[i][dataIndex],
              horarios: rows[i][horariosIndex],
              unidade: rows[i][unidadeIndex],
              quadra: rows[i][quadraIndex],
              modalidade: rows[i][modalidadeIndex],
            }
            break
          }
        }

        if (rowIndex === -1) {
          console.error("[v0] Reserva não encontrada para payment_id:", body.payment.id)
          return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 })
        }

        const columnLetter = String.fromCharCode(65 + statusIndex)
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `leads - quadra!${columnLetter}${rowIndex}`,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [["CONFIRMADA"]],
          },
        })

        console.log("[v0] ✅ Status atualizado para CONFIRMADA na linha:", rowIndex)

        try {
          await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/whatsapp/enviar-confirmacao`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clienteData),
          })
          console.log("[v0] ✅ WhatsApp de confirmação enviado")
        } catch (whatsappError) {
          console.error("[v0] Erro ao enviar WhatsApp:", whatsappError)
          // Não falhar o webhook por causa do WhatsApp
        }
      } catch (error) {
        console.error("[v0] Erro ao atualizar status:", error)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao processar webhook:", error)
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 })
  }
}

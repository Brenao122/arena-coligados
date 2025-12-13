import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Webhook Asaas recebido:", {
      event: body.event,
      paymentId: body.payment?.id,
      status: body.payment?.status,
    })

    if (!body.event || !body.payment) {
      console.error("[v0] Webhook inválido:", body)
      return NextResponse.json({ error: "Webhook inválido" }, { status: 400 })
    }

    switch (body.event) {
      case "PAYMENT_RECEIVED":
      case "PAYMENT_CONFIRMED":
        console.log("[v0] Pagamento confirmado:", body.payment.id)

        // Buscar a reserva pelo externalReference (payment ID) e atualizar status
        try {
          const externalRef = body.payment.externalReference || body.payment.id

          // Atualizar o status da reserva para CONFIRMADA
          // Nota: Esta é uma simplificação. Na produção, você deve buscar a linha específica e atualizar
          console.log("[v0] Atualizando status da reserva para CONFIRMADA:", externalRef)

          // TODO: Implementar lógica para atualizar linha específica no Google Sheets
          // Por enquanto, apenas registramos o log
        } catch (error) {
          console.error("[v0] Erro ao atualizar status da reserva:", error)
        }
        break

      case "PAYMENT_OVERDUE":
        console.log("[v0] Pagamento vencido:", body.payment.id)
        break

      case "PAYMENT_DELETED":
        console.log("[v0] Pagamento deletado:", body.payment.id)
        break

      default:
        console.log("[v0] Evento não tratado:", body.event)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao processar webhook:", error)
    return NextResponse.json({ success: false, error: "Erro interno" })
  }
}

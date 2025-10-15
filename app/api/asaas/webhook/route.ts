import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Webhook Asaas recebido:", {
      event: body.event,
      paymentId: body.payment?.id,
      status: body.payment?.status,
    })

    // Validar evento
    if (!body.event || !body.payment) {
      console.error("[v0] Webhook inválido:", body)
      return NextResponse.json({ error: "Webhook inválido" }, { status: 400 })
    }

    // Processar eventos de pagamento
    switch (body.event) {
      case "PAYMENT_RECEIVED":
      case "PAYMENT_CONFIRMED":
        console.log("[v0] Pagamento confirmado:", body.payment.id)
        // Aqui você pode adicionar lógica adicional, como:
        // - Enviar email de confirmação
        // - Atualizar status na planilha
        // - Notificar o usuário
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

    // Sempre retornar 200 para o Asaas saber que recebemos o webhook
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao processar webhook:", error)
    // Mesmo com erro, retornar 200 para não ficar reenviando
    return NextResponse.json({ success: false, error: "Erro interno" })
  }
}

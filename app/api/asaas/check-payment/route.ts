import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get("paymentId")

    if (!paymentId) {
      return NextResponse.json({ error: "paymentId é obrigatório" }, { status: 400 })
    }

    const asaasApiKey = process.env.ASAAS_API_KEY
    if (!asaasApiKey) {
      console.error("[v0] ASAAS_API_KEY não configurada")
      return NextResponse.json({ error: "Chave API Asaas não configurada" }, { status: 500 })
    }

    console.log("[v0] Verificando status do pagamento:", paymentId)

    // Buscar status do pagamento no Asaas
    const response = await fetch(`https://api.asaas.com/v3/payments/${paymentId}`, {
      method: "GET",
      headers: {
        access_token: asaasApiKey,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Erro ao verificar pagamento:", errorData)
      return NextResponse.json(
        { error: "Erro ao verificar pagamento", details: errorData },
        { status: response.status },
      )
    }

    const paymentData = await response.json()
    console.log("[v0] Status do pagamento:", paymentData.status)

    return NextResponse.json({
      success: true,
      payment: {
        id: paymentData.id,
        status: paymentData.status, // PENDING, RECEIVED, CONFIRMED, etc.
        value: paymentData.value,
        netValue: paymentData.netValue,
        paymentDate: paymentData.paymentDate,
        confirmedDate: paymentData.confirmedDate,
      },
    })
  } catch (error) {
    console.error("[v0] Erro ao verificar pagamento:", error)
    return NextResponse.json({ error: "Erro interno ao verificar pagamento" }, { status: 500 })
  }
}

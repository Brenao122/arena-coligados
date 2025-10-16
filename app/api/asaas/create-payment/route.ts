import { type NextRequest, NextResponse } from "next/server"

function getAsaasApiKey(unidade?: string): string {
  if (unidade === "Parque Amazônia" && process.env.ASAAS_API_KEY_PARQUE_AMAZONIA) {
    return process.env.ASAAS_API_KEY_PARQUE_AMAZONIA
  }

  if (unidade === "Vila Rosa" && process.env.ASAAS_API_KEY_VILA_ROSA) {
    return process.env.ASAAS_API_KEY_VILA_ROSA
  }

  // Fallback para a chave padrão
  return process.env.ASAAS_API_KEY || ""
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer, value, description, dueDate, externalReference, unidade } = body

    console.log("[v0] Criando cobrança PIX no Asaas...")
    console.log("[v0] Unidade:", unidade)
    console.log("[v0] Valor original:", value)

    const valorReserva = value / 2
    console.log("[v0] Valor da reserva (50%):", valorReserva)

    // Validação do valor mínimo do Asaas (R$ 5,00)
    if (valorReserva < 5) {
      return NextResponse.json({ error: "Valor mínimo de cobrança é R$ 5,00" }, { status: 400 })
    }

    const apiKey = getAsaasApiKey(unidade)

    if (!apiKey) {
      console.error("[v0] Chave API não configurada para unidade:", unidade)
      return NextResponse.json({ error: "Configuração de pagamento não encontrada para esta unidade" }, { status: 500 })
    }

    console.log("[v0] Usando chave API para unidade:", unidade)

    // Criar cliente no Asaas
    const customerResponse = await fetch("https://sandbox.asaas.com/api/v3/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: apiKey,
      },
      body: JSON.stringify({
        name: customer.name,
        cpfCnpj: customer.cpfCnpj,
        email: customer.email,
        phone: customer.phone,
      }),
    })

    if (!customerResponse.ok) {
      const errorData = await customerResponse.json()
      console.error("[v0] Erro ao criar cliente:", errorData)
      return NextResponse.json({ error: "Erro ao criar cliente", details: errorData }, { status: 400 })
    }

    const customerData = await customerResponse.json()
    console.log("[v0] Cliente criado:", customerData.id)

    // Criar cobrança PIX com 50% do valor
    const paymentResponse = await fetch("https://sandbox.asaas.com/api/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: apiKey,
      },
      body: JSON.stringify({
        customer: customerData.id,
        billingType: "PIX",
        value: valorReserva,
        dueDate: dueDate,
        description: `${description} (Reserva - 50%)`,
        externalReference: externalReference,
      }),
    })

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json()
      console.error("[v0] Erro ao criar cobrança:", errorData)
      return NextResponse.json({ error: "Erro ao criar cobrança", details: errorData }, { status: 400 })
    }

    const paymentData = await paymentResponse.json()
    console.log("[v0] Cobrança criada:", paymentData.id)

    // Gerar QR Code PIX
    const pixResponse = await fetch(`https://sandbox.asaas.com/api/v3/payments/${paymentData.id}/pixQrCode`, {
      headers: {
        access_token: apiKey,
      },
    })

    if (!pixResponse.ok) {
      const errorData = await pixResponse.json()
      console.error("[v0] Erro ao gerar QR Code:", errorData)
      return NextResponse.json({ error: "Erro ao gerar QR Code PIX", details: errorData }, { status: 400 })
    }

    const pixData = await pixResponse.json()

    return NextResponse.json({
      success: true,
      payment: paymentData,
      pix: {
        qrCode: pixData.encodedImage,
        payload: pixData.payload,
        expirationDate: pixData.expirationDate,
      },
    })
  } catch (error) {
    console.error("[v0] Erro no servidor:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

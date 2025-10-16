import { type NextRequest, NextResponse } from "next/server"

function getAsaasApiKey(unidade?: string): string {
  console.log("[v0] Buscando chave API para unidade:", unidade)
  console.log("[v0] Variáveis disponíveis:", {
    parqueAmazonia: !!process.env.ASAAS_API_KEY_PARQUE_AMAZONIA,
    vilaRosa: !!process.env.ASAAS_API_KEY_VILA_ROSA,
    padrao: !!process.env.ASAAS_API_KEY,
  })

  if (unidade === "Parque Amazônia" && process.env.ASAAS_API_KEY_PARQUE_AMAZONIA) {
    console.log("[v0] Usando chave do Parque Amazônia")
    return process.env.ASAAS_API_KEY_PARQUE_AMAZONIA
  }

  if (unidade === "Vila Rosa" && process.env.ASAAS_API_KEY_VILA_ROSA) {
    console.log("[v0] Usando chave da Vila Rosa")
    return process.env.ASAAS_API_KEY_VILA_ROSA
  }

  // Fallback para a chave padrão
  console.log("[v0] Usando chave padrão (fallback)")
  return process.env.ASAAS_API_KEY || ""
}

function getAsaasBaseUrl(apiKey: string): string {
  const isProduction = apiKey.startsWith("$aact_prod_")
  const baseUrl = isProduction ? "https://api.asaas.com" : "https://sandbox.asaas.com"
  console.log("[v0] Ambiente detectado:", isProduction ? "PRODUÇÃO" : "SANDBOX")
  console.log("[v0] URL base:", baseUrl)
  return baseUrl
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer, value, description, dueDate, externalReference, unidade } = body

    console.log("[v0] ===== CRIANDO COBRANÇA PIX =====")
    console.log("[v0] Unidade:", unidade)
    console.log("[v0] Valor recebido:", value)
    console.log("[v0] Dados do cliente:", {
      name: customer.name,
      cpfCnpj: customer.cpfCnpj,
      email: customer.email,
      phone: customer.phone,
    })

    const valorReserva = value / 2
    console.log("[v0] Valor da reserva (50%):", valorReserva)

    // Validação do valor mínimo do Asaas (R$ 5,00)
    if (valorReserva < 5) {
      return NextResponse.json({ error: "Valor mínimo de cobrança é R$ 5,00" }, { status: 400 })
    }

    const apiKey = getAsaasApiKey(unidade)

    if (!apiKey) {
      console.error("[v0] ❌ Chave API não configurada para unidade:", unidade)
      return NextResponse.json(
        {
          error: "Configuração de pagamento não encontrada para esta unidade",
          details: { unidade, message: "Chave API não configurada" },
        },
        { status: 500 },
      )
    }

    console.log("[v0] ✓ Chave API encontrada:", apiKey.substring(0, 15) + "..." + apiKey.substring(apiKey.length - 5))

    const baseUrl = getAsaasBaseUrl(apiKey)

    // Criar cliente no Asaas
    console.log("[v0] Criando cliente no Asaas...")
    console.log("[v0] URL:", `${baseUrl}/api/v3/customers`)

    const customerResponse = await fetch(`${baseUrl}/api/v3/customers`, {
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

    console.log("[v0] Status da resposta:", customerResponse.status)

    if (!customerResponse.ok) {
      const errorData = await customerResponse.json()
      console.error("[v0] ❌ Erro ao criar cliente - Status:", customerResponse.status)
      console.error("[v0] ❌ Detalhes do erro:", JSON.stringify(errorData, null, 2))
      return NextResponse.json({ error: "Erro ao criar cliente", details: errorData }, { status: 400 })
    }

    const customerData = await customerResponse.json()
    console.log("[v0] ✓ Cliente criado:", customerData.id)

    console.log("[v0] Criando cobrança PIX com valor de reserva (50%)...")
    const paymentResponse = await fetch(`${baseUrl}/api/v3/payments`, {
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
      console.error("[v0] ❌ Erro ao criar cobrança:", errorData)
      return NextResponse.json({ error: "Erro ao criar cobrança", details: errorData }, { status: 400 })
    }

    const paymentData = await paymentResponse.json()
    console.log("[v0] ✓ Cobrança criada:", paymentData.id)

    // Gerar QR Code PIX
    console.log("[v0] Gerando QR Code PIX...")
    const pixResponse = await fetch(`${baseUrl}/api/v3/payments/${paymentData.id}/pixQrCode`, {
      headers: {
        access_token: apiKey,
      },
    })

    if (!pixResponse.ok) {
      const errorData = await pixResponse.json()
      console.error("[v0] ❌ Erro ao gerar QR Code:", errorData)
      return NextResponse.json({ error: "Erro ao gerar QR Code PIX", details: errorData }, { status: 400 })
    }

    const pixData = await pixResponse.json()
    console.log("[v0] ✓ QR Code gerado com sucesso")
    console.log("[v0] ===== COBRANÇA CRIADA COM SUCESSO =====")

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
    console.error("[v0] ❌ Erro no servidor:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

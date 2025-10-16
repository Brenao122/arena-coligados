import { type NextRequest, NextResponse } from "next/server"

function getAsaasApiKey(unidade?: string): string {
  console.log("[v0] Buscando chave API para unidade:", unidade)
  console.log("[v0] Variáveis disponíveis:", {
    parqueAmazonia: !!process.env.ASAAS_API_KEY_PARQUE_AMAZONIA,
    vilaRosa: !!process.env.ASAAS_API_KEY_VILA_ROSA,
  })

  if (unidade === "Parque Amazônia" && process.env.ASAAS_API_KEY_PARQUE_AMAZONIA) {
    console.log("[v0] Usando chave do Parque Amazônia")
    return process.env.ASAAS_API_KEY_PARQUE_AMAZONIA
  }

  if (unidade === "Vila Rosa" && process.env.ASAAS_API_KEY_VILA_ROSA) {
    console.log("[v0] Usando chave da Vila Rosa")
    return process.env.ASAAS_API_KEY_VILA_ROSA
  }

  console.error("[v0] ❌ Nenhuma chave configurada para unidade:", unidade)
  return ""
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

    const cleanApiKey = apiKey.trim().replace(/\s+/g, "")
    console.log("[v0] Comprimento da chave:", cleanApiKey.length)
    console.log("[v0] Primeiros 20 chars:", cleanApiKey.substring(0, 20))
    console.log("[v0] Últimos 10 chars:", cleanApiKey.substring(cleanApiKey.length - 10))
    console.log("[v0] Chave começa com $aact_:", cleanApiKey.startsWith("$aact_"))

    // Validar formato básico da chave
    if (!cleanApiKey.startsWith("$aact_")) {
      console.error("[v0] ❌ Formato de chave inválido - deve começar com $aact_")
      return NextResponse.json(
        {
          error: "Chave API em formato inválido",
          details: { message: "A chave deve começar com $aact_" },
        },
        { status: 500 },
      )
    }

    const baseUrl = getAsaasBaseUrl(cleanApiKey)

    console.log("[v0] Testando autenticação...")
    try {
      const testResponse = await fetch(`${baseUrl}/api/v3/customers?limit=1`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          access_token: cleanApiKey,
        },
      })

      console.log("[v0] Status do teste de autenticação:", testResponse.status)
      const testText = await testResponse.text()
      console.log("[v0] Resposta do teste (primeiros 200 chars):", testText.substring(0, 200))

      if (!testResponse.ok) {
        console.error("[v0] ❌ Falha na autenticação")
        return NextResponse.json(
          {
            error: "Falha na autenticação com o servidor de pagamentos",
            details: {
              status: testResponse.status,
              message: "Verifique se a chave API está correta",
              response: testText.substring(0, 200),
            },
          },
          { status: 401 },
        )
      }

      console.log("[v0] ✓ Autenticação bem-sucedida")
    } catch (testError) {
      console.error("[v0] ❌ Erro ao testar autenticação:", testError)
      return NextResponse.json(
        {
          error: "Erro de conexão ao testar autenticação",
          details: { message: testError instanceof Error ? testError.message : "Erro desconhecido" },
        },
        { status: 500 },
      )
    }

    // Criar cliente no Asaas
    console.log("[v0] Criando cliente no Asaas...")
    console.log("[v0] URL:", `${baseUrl}/api/v3/customers`)

    let customerResponse
    try {
      customerResponse = await fetch(`${baseUrl}/api/v3/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: cleanApiKey,
        },
        body: JSON.stringify({
          name: customer.name,
          cpfCnpj: customer.cpfCnpj,
          email: customer.email,
          phone: customer.phone,
        }),
      })
    } catch (fetchError) {
      console.error("[v0] ❌ Erro de rede ao criar cliente:", fetchError)
      return NextResponse.json(
        {
          error: "Erro de conexão com o servidor de pagamentos",
          details: { message: fetchError instanceof Error ? fetchError.message : "Erro desconhecido" },
        },
        { status: 500 },
      )
    }

    console.log("[v0] Status da resposta:", customerResponse.status)
    console.log("[v0] Headers da resposta:", Object.fromEntries(customerResponse.headers.entries()))

    const responseText = await customerResponse.text()
    console.log("[v0] Resposta bruta (primeiros 500 chars):", responseText.substring(0, 500))

    if (!customerResponse.ok) {
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch {
        console.error("[v0] ❌ Resposta não é JSON válido")
        errorData = { message: "Resposta inválida do servidor", rawResponse: responseText.substring(0, 200) }
      }
      console.error("[v0] ❌ Erro ao criar cliente - Status:", customerResponse.status)
      console.error("[v0] ❌ Detalhes do erro:", JSON.stringify(errorData, null, 2))
      return NextResponse.json({ error: "Erro ao criar cliente", details: errorData }, { status: 400 })
    }

    let customerData
    try {
      customerData = JSON.parse(responseText)
    } catch (parseError) {
      console.error("[v0] ❌ Erro ao fazer parse da resposta:", parseError)
      return NextResponse.json(
        {
          error: "Erro ao processar resposta do servidor",
          details: { message: "Resposta inválida", rawResponse: responseText.substring(0, 200) },
        },
        { status: 500 },
      )
    }

    console.log("[v0] ✓ Cliente criado:", customerData.id)

    // Criar cobrança PIX
    console.log("[v0] Criando cobrança PIX com valor de reserva (50%)...")
    let paymentResponse
    try {
      paymentResponse = await fetch(`${baseUrl}/api/v3/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: cleanApiKey,
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
    } catch (fetchError) {
      console.error("[v0] ❌ Erro de rede ao criar cobrança:", fetchError)
      return NextResponse.json(
        {
          error: "Erro de conexão ao criar cobrança",
          details: { message: fetchError instanceof Error ? fetchError.message : "Erro desconhecido" },
        },
        { status: 500 },
      )
    }

    console.log("[v0] Status da resposta:", paymentResponse.status)
    console.log("[v0] Headers da resposta:", Object.fromEntries(paymentResponse.headers.entries()))

    if (!paymentResponse.ok) {
      let errorData
      try {
        errorData = await paymentResponse.json()
      } catch {
        errorData = { message: "Resposta inválida do servidor" }
      }
      console.error("[v0] ❌ Erro ao criar cobrança - Status:", paymentResponse.status)
      console.error("[v0] ❌ Detalhes do erro:", JSON.stringify(errorData, null, 2))
      return NextResponse.json({ error: "Erro ao criar cobrança", details: errorData }, { status: 400 })
    }

    const paymentData = await paymentResponse.json()
    console.log("[v0] ✓ Cobrança criada:", paymentData.id)

    // Gerar QR Code PIX
    console.log("[v0] Gerando QR Code PIX...")
    let pixResponse
    try {
      pixResponse = await fetch(`${baseUrl}/api/v3/payments/${paymentData.id}/pixQrCode`, {
        headers: {
          access_token: cleanApiKey,
        },
      })
    } catch (fetchError) {
      console.error("[v0] ❌ Erro de rede ao gerar QR Code:", fetchError)
      return NextResponse.json(
        {
          error: "Erro de conexão ao gerar QR Code",
          details: { message: fetchError instanceof Error ? fetchError.message : "Erro desconhecido" },
        },
        { status: 500 },
      )
    }

    console.log("[v0] Status da resposta:", pixResponse.status)
    console.log("[v0] Headers da resposta:", Object.fromEntries(pixResponse.headers.entries()))

    if (!pixResponse.ok) {
      let errorData
      try {
        errorData = await pixResponse.json()
      } catch {
        errorData = { message: "Resposta inválida do servidor" }
      }
      console.error("[v0] ❌ Erro ao gerar QR Code - Status:", pixResponse.status)
      console.error("[v0] ❌ Detalhes do erro:", JSON.stringify(errorData, null, 2))
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
    console.error("[v0] ❌ Erro no servidor (catch geral):", error)
    console.error("[v0] ❌ Stack trace:", error instanceof Error ? error.stack : "N/A")
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: { message: error instanceof Error ? error.message : "Erro desconhecido" },
      },
      { status: 500 },
    )
  }
}

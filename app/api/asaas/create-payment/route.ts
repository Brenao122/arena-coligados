import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer, value, description, dueDate } = body

    // TODO: Remover esta linha e usar o valor real quando for para produção
    const valorTeste = 3.0 // VALOR DE TESTE - Mudar para 'value' em produção

    console.log("[v0] Criando cobrança Asaas:", { customer, value: valorTeste, description })

    // Validação
    if (!customer?.name || !customer?.cpfCnpj || !valorTeste) {
      console.error("[v0] Dados incompletos:", { customer, value: valorTeste })
      return NextResponse.json(
        { error: "Dados incompletos. Nome, CPF/CNPJ e valor são obrigatórios." },
        { status: 400 },
      )
    }

    const asaasApiKey = process.env.ASAAS_API_KEY
    if (!asaasApiKey) {
      console.error("[v0] ASAAS_API_KEY não configurada")
      return NextResponse.json({ error: "Chave API Asaas não configurada" }, { status: 500 })
    }

    console.log("[v0] Chave API encontrada, criando cliente primeiro...")

    const cpfCnpjLimpo = customer.cpfCnpj.replace(/[^\d]/g, "")
    const telefoneLimpo = customer.phone?.replace(/[^\d]/g, "") || ""

    // Validar CPF/CNPJ (deve ter 11 ou 14 dígitos)
    if (cpfCnpjLimpo.length !== 11 && cpfCnpjLimpo.length !== 14) {
      console.error("[v0] CPF/CNPJ inválido:", cpfCnpjLimpo)
      return NextResponse.json({ error: "CPF/CNPJ inválido. Deve ter 11 (CPF) ou 14 (CNPJ) dígitos." }, { status: 400 })
    }

    // Payload mínimo para criar cliente (apenas campos obrigatórios)
    const customerPayload: any = {
      name: customer.name,
      cpfCnpj: cpfCnpjLimpo,
    }

    // Adicionar email apenas se fornecido e válido
    if (customer.email && customer.email.includes("@")) {
      customerPayload.email = customer.email
    }

    // Adicionar telefone apenas se fornecido e válido (mínimo 10 dígitos)
    if (telefoneLimpo.length >= 10) {
      customerPayload.mobilePhone = telefoneLimpo
    }

    console.log("[v0] Payload do cliente:", JSON.stringify(customerPayload, null, 2))

    const customerResponse = await fetch("https://api.asaas.com/v3/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: asaasApiKey,
      },
      body: JSON.stringify(customerPayload),
    })

    const customerResponseText = await customerResponse.text()
    console.log("[v0] Resposta cliente Asaas (status " + customerResponse.status + "):", customerResponseText)

    let customerId
    if (customerResponse.ok) {
      const customerData = JSON.parse(customerResponseText)
      customerId = customerData.id
      console.log("[v0] Cliente criado/encontrado:", customerId)
    } else {
      // Se der erro 400, pode ser que o cliente já existe, tentar buscar
      const errorData = JSON.parse(customerResponseText)
      console.log("[v0] Erro ao criar cliente, tentando buscar existente...")

      const searchResponse = await fetch(`https://api.asaas.com/v3/customers?cpfCnpj=${cpfCnpjLimpo}`, {
        method: "GET",
        headers: {
          access_token: asaasApiKey,
        },
      })

      if (searchResponse.ok) {
        const searchData = await searchResponse.json()
        if (searchData.data && searchData.data.length > 0) {
          customerId = searchData.data[0].id
          console.log("[v0] Cliente existente encontrado:", customerId)
        }
      }

      if (!customerId) {
        console.error("[v0] Erro ao criar/buscar cliente:", errorData)
        return NextResponse.json(
          { error: "Erro ao criar cliente", details: errorData },
          { status: customerResponse.status },
        )
      }
    }

    console.log("[v0] Criando cobrança para cliente:", customerId)

    const paymentPayload = {
      customer: customerId, // Usa o ID do cliente criado/encontrado
      billingType: "PIX",
      value: valorTeste, // TESTE: R$ 3,00 fixo - Mudar para 'value' em produção
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      description: description || "Reserva de Quadra",
      externalReference: body.externalReference,
    }

    console.log("[v0] Payload da cobrança:", JSON.stringify(paymentPayload, null, 2))

    // Criar cobrança PIX no Asaas
    const paymentResponse = await fetch("https://api.asaas.com/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: asaasApiKey,
      },
      body: JSON.stringify(paymentPayload),
    })

    const responseText = await paymentResponse.text()
    console.log("[v0] Resposta Asaas (status " + paymentResponse.status + "):", responseText)

    if (!paymentResponse.ok) {
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch {
        errorData = { message: responseText }
      }
      console.error("[v0] Erro detalhado Asaas:", JSON.stringify(errorData, null, 2))
      if (errorData.errors) {
        console.error("[v0] Array de erros:", JSON.stringify(errorData.errors, null, 2))
      }
      return NextResponse.json(
        { error: "Erro ao criar cobrança", details: errorData },
        { status: paymentResponse.status },
      )
    }

    const paymentData = JSON.parse(responseText)
    console.log("[v0] Cobrança criada com sucesso:", paymentData.id)

    // Buscar QR Code PIX
    const qrCodeResponse = await fetch(`https://api.asaas.com/v3/payments/${paymentData.id}/pixQrCode`, {
      method: "GET",
      headers: {
        access_token: asaasApiKey,
      },
    })

    if (!qrCodeResponse.ok) {
      const errorData = await qrCodeResponse.json()
      console.error("[v0] Erro ao buscar QR Code:", errorData)
      return NextResponse.json(
        {
          error: "Cobrança criada mas erro ao gerar QR Code",
          paymentId: paymentData.id,
          details: errorData,
        },
        { status: qrCodeResponse.status },
      )
    }

    const qrCodeData = await qrCodeResponse.json()
    console.log("[v0] QR Code gerado com sucesso")

    return NextResponse.json({
      success: true,
      payment: {
        id: paymentData.id,
        value: paymentData.value,
        status: paymentData.status,
        dueDate: paymentData.dueDate,
        invoiceUrl: paymentData.invoiceUrl,
      },
      pix: {
        qrCode: qrCodeData.encodedImage, // Base64 da imagem do QR Code
        payload: qrCodeData.payload, // Código PIX copia e cola
        expirationDate: qrCodeData.expirationDate,
      },
    })
  } catch (error) {
    console.error("[v0] Erro ao processar pagamento:", error)
    return NextResponse.json({ error: "Erro interno ao processar pagamento", details: String(error) }, { status: 500 })
  }
}

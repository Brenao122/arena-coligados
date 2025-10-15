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

    console.log("[v0] Chave API encontrada, criando cobrança...")

    const paymentPayload = {
      billingType: "PIX",
      value: valorTeste, // TESTE: R$ 3,00 fixo - Mudar para 'value' em produção
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      description: description || "Reserva de Quadra",
      externalReference: body.externalReference,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      mobilePhone: customer.mobilePhone || customer.phone,
      cpfCnpj: customer.cpfCnpj,
      postalCode: customer.postalCode || "00000000",
      address: customer.address || "Não informado",
      addressNumber: customer.addressNumber || "S/N",
      province: customer.province || "Centro",
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
      console.error("[v0] Erro ao criar cobrança Asaas:", errorData)
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

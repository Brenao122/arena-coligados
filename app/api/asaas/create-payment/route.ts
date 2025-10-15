import { type NextRequest, NextResponse } from "next/server"
import { ASAAS_PAYMENT_VALUE, ASAAS_API_URL } from "@/lib/asaas-config"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer, value, description, dueDate } = body

    const valorCobranca = ASAAS_PAYMENT_VALUE

    console.log("[v0] Criando cobrança Asaas:", { customer, value: valorCobranca, description })

    // Validação
    if (!customer?.name || !customer?.cpfCnpj || !valorCobranca) {
      console.error("[v0] Dados incompletos:", { customer, value: valorCobranca })
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

    const cpfCnpjLimpo = customer.cpfCnpj.replace(/[^\d]/g, "")

    // Validação básica do CPF (11 dígitos)
    if (cpfCnpjLimpo.length !== 11) {
      console.error("[v0] CPF inválido:", cpfCnpjLimpo)
      return NextResponse.json({ error: "CPF inválido. Deve conter 11 dígitos." }, { status: 400 })
    }

    console.log("[v0] Criando/buscando cliente no Asaas com CPF:", cpfCnpjLimpo)

    const customerPayload = {
      name: customer.name,
      cpfCnpj: cpfCnpjLimpo,
      email: customer.email || `cliente${cpfCnpjLimpo}@temp.com`,
      mobilePhone: customer.phone ? customer.phone.replace(/[^\d]/g, "") : undefined,
    }

    console.log("[v0] Payload do cliente:", JSON.stringify(customerPayload, null, 2))

    const customerResponse = await fetch(`${ASAAS_API_URL}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: asaasApiKey,
      },
      body: JSON.stringify(customerPayload),
    })

    const customerResponseText = await customerResponse.text()
    console.log("[v0] Resposta criação cliente (status " + customerResponse.status + "):", customerResponseText)

    if (!customerResponse.ok) {
      let errorData
      try {
        errorData = JSON.parse(customerResponseText)
      } catch {
        errorData = { message: customerResponseText }
      }
      console.error("[v0] Erro ao criar cliente:", JSON.stringify(errorData, null, 2))
      return NextResponse.json(
        { error: "Erro ao criar cliente", details: errorData },
        { status: customerResponse.status },
      )
    }

    const customerData = JSON.parse(customerResponseText)
    console.log("[v0] Cliente criado/encontrado com ID:", customerData.id)

    const paymentPayload = {
      customer: customerData.id, // Usar o ID do cliente criado
      billingType: "PIX",
      value: valorCobranca,
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      description: description || "Reserva de Quadra",
    }

    console.log("[v0] Payload da cobrança:", JSON.stringify(paymentPayload, null, 2))

    const paymentResponse = await fetch(`${ASAAS_API_URL}/payments`, {
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

    const qrCodeResponse = await fetch(`${ASAAS_API_URL}/payments/${paymentData.id}/pixQrCode`, {
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
        qrCode: qrCodeData.encodedImage,
        payload: qrCodeData.payload,
        expirationDate: qrCodeData.expirationDate,
      },
    })
  } catch (error) {
    console.error("[v0] Erro ao processar pagamento:", error)
    return NextResponse.json({ error: "Erro interno ao processar pagamento", details: String(error) }, { status: 500 })
  }
}
